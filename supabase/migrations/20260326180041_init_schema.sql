-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists pgcrypto;


-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists public.profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  username   text unique,
  avatar_url text,
  bio        text,
  banner_url text,
  plan       text default 'free',
  is_public  boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);


-- ============================================================
-- MANGA
-- ============================================================
create table if not exists public.manga (
  id        uuid primary key default gen_random_uuid(),
  title     text not null,
  author    text,
  status    text,
  total_chapters int,
  cover_url text,
  cached_at timestamp with time zone default now()
);


-- ============================================================
-- MANGA SOURCES
-- ============================================================
create table if not exists public.manga_sources (
  id          uuid primary key default gen_random_uuid(),
  manga_id    uuid references public.manga(id) on delete cascade not null,
  source      text not null,
  external_id text not null,
  url         text,
  cached_at   timestamp with time zone default now(),
  unique(source, external_id)
);


-- ============================================================
-- BOOKMARKS
-- ============================================================
create table if not exists public.bookmarks (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete cascade not null,
  manga_id     uuid references public.manga(id) on delete cascade not null,
  read_status  text default 'plan_to_read'
                 check (read_status in ('reading', 'completed', 'plan_to_read', 'dropped', 'on_hold')),
  score        int check (score between 1 and 10),
  notes        text,
  started_at   timestamp with time zone,
  completed_at timestamp with time zone,
  created_at   timestamp with time zone default now(),
  updated_at   timestamp with time zone default now(),
  unique(user_id, manga_id)
);


-- ============================================================
-- CHAPTERS
-- ============================================================
create table if not exists public.chapters (
  id             uuid primary key default gen_random_uuid(),
  manga_id       uuid references public.manga(id) on delete cascade not null,
  source         text not null,
  language       text not null,
  chapter_number float not null,
  external_id    text,
  published_at   timestamp with time zone,
  cached_at      timestamp with time zone default now(),
  unique(manga_id, chapter_number, language, source)
);


-- ============================================================
-- READING PROGRESS
-- ============================================================
create table if not exists public.reading_progress (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references public.profiles(id) on delete cascade not null,
  manga_id       uuid references public.manga(id) on delete cascade not null,
  chapter_number float not null,
  page_number    int default 1,
  read_at        timestamp with time zone default now(),
  updated_at     timestamp with time zone default now(),
  unique(user_id, manga_id, chapter_number)
);


-- ============================================================
-- READING SESSIONS
-- ============================================================
create table if not exists public.reading_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references public.profiles(id) on delete cascade not null,
  manga_id         uuid references public.manga(id) on delete cascade not null,
  chapters_read    int default 1,
  duration_seconds int,
  session_date     date default current_date,
  created_at       timestamp with time zone default now(),
  unique(user_id, manga_id, session_date)
);


-- ============================================================
-- LISTS
-- ============================================================
create table if not exists public.lists (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  name        text not null,
  description text,
  is_public   boolean default false,
  position    int default 0,
  created_at  timestamp with time zone default now(),
  updated_at  timestamp with time zone default now()
);


-- ============================================================
-- LIST ITEMS
-- ============================================================
create table if not exists public.list_items (
  id       uuid primary key default gen_random_uuid(),
  list_id  uuid references public.lists(id) on delete cascade not null,
  manga_id uuid references public.manga(id) on delete cascade not null,
  position int default 0,
  added_at timestamp with time zone default now(),
  unique(list_id, manga_id)
);


-- ============================================================
-- USER STATS
-- ============================================================
create table if not exists public.user_stats (
  user_id         uuid references public.profiles(id) on delete cascade primary key,
  total_chapters  int default 0,
  total_time_mins int default 0,
  updated_at      timestamp with time zone default now()
);


-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid references public.profiles(id) on delete cascade unique,
  plan                   text not null default 'free'
                           check (plan in ('free', 'pro')),
  status                 text not null default 'active'
                           check (status in ('active', 'cancelled', 'expired')),
  started_at             timestamp with time zone default now(),
  expires_at             timestamp with time zone,
  stripe_customer_id     text,
  stripe_subscription_id text
);


-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- 1. auto-create profile on auth signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username')
  on conflict (id) do update
    set username = coalesce(
      excluded.username,
      public.profiles.username
    );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute function public.handle_new_user();

-- 2. auto-create user_stats row when profile is created
create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_stats (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created on public.profiles;
create trigger on_profile_created
  after insert on public.profiles
  for each row execute function public.handle_new_profile();

-- 3. increment total_chapters on new reading session
create or replace function public.update_user_stats()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_stats (user_id, total_chapters, total_time_mins)
  values (
    new.user_id,
    new.chapters_read,
    coalesce(new.duration_seconds, 0) / 60
  )
  on conflict (user_id) do update set
    total_chapters  = public.user_stats.total_chapters + new.chapters_read,
    total_time_mins = public.user_stats.total_time_mins + coalesce(new.duration_seconds, 0) / 60,
    updated_at      = now();
  return new;
end;
$$;

drop trigger if exists on_reading_session on public.reading_sessions;
create trigger on_reading_session
  after insert on public.reading_sessions
  for each row execute function public.update_user_stats();


-- 4. auto-update updated_at on row update
create or replace function public.update_timestamp()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  NEW.updated_at := now();
  return NEW;
end;
$$;

drop trigger if exists set_profile_timestamp on public.profiles;
create trigger set_profile_timestamp
  before update on public.profiles
  for each row execute function public.update_timestamp();

drop trigger if exists set_bookmarks_timestamp on public.bookmarks;
create trigger set_bookmarks_timestamp
  before update on public.bookmarks
  for each row execute function public.update_timestamp();

drop trigger if exists set_lists_timestamp on public.lists;
create trigger set_lists_timestamp
  before update on public.lists
  for each row execute function public.update_timestamp();

drop trigger if exists set_progress_timestamp on public.reading_progress;
create trigger set_progress_timestamp
  before update on public.reading_progress
  for each row execute function public.update_timestamp();


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles         enable row level security;
alter table public.manga            enable row level security;
alter table public.manga_sources    enable row level security;
alter table public.chapters         enable row level security;
alter table public.bookmarks        enable row level security;
alter table public.reading_progress enable row level security;
alter table public.reading_sessions enable row level security;
alter table public.lists            enable row level security;
alter table public.list_items       enable row level security;
alter table public.user_stats       enable row level security;
alter table public.subscriptions    enable row level security;


-- ============================================================
-- POLICIES
-- ============================================================

-- public read
create policy "manga public read"         on public.manga         for select using (true);
create policy "manga_sources public read" on public.manga_sources for select using (true);
create policy "chapters public read"      on public.chapters      for select using (true);

-- profiles
create policy "profiles public read" on public.profiles
  for select using (is_public = true);

create policy "own profile" on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- user owned
create policy "own bookmarks" on public.bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own progress" on public.reading_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own sessions" on public.reading_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own lists" on public.lists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own list items" on public.list_items for all
  using (auth.uid() = (select user_id from public.lists where id = list_id))
  with check (auth.uid() = (select user_id from public.lists where id = list_id));

create policy "own stats" on public.user_stats for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own subscription" on public.subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_bookmarks_user       on public.bookmarks (user_id);
create index if not exists idx_bookmarks_manga      on public.bookmarks (manga_id);
create index if not exists idx_bookmarks_status     on public.bookmarks (user_id, read_status);
create index if not exists idx_progress_user_manga  on public.reading_progress (user_id, manga_id);
create index if not exists idx_sessions_user        on public.reading_sessions (user_id);
create index if not exists idx_list_items_list      on public.list_items (list_id);
create index if not exists idx_chapters_manga       on public.chapters (manga_id);
create index if not exists idx_chapters_published   on public.chapters (published_at desc);
create index if not exists idx_lists_user           on public.lists (user_id);
create index if not exists idx_manga_sources_manga  on public.manga_sources (manga_id);
create index if not exists idx_manga_sources_lookup on public.manga_sources (source, external_id);