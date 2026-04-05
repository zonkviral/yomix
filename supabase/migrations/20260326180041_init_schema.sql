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
  id             uuid primary key default gen_random_uuid(),
  mangadex_id    text unique,
  remanga_slug   text unique,
  anilist_id     text,
  title          text not null,
  cover_url      text,
  status         text,
  total_chapters int,
  cached_at      timestamp with time zone default now()
);


-- ============================================================
-- GENRES
-- ============================================================
create table if not exists public.genres (
  id   serial primary key,
  name text unique not null
);

create table if not exists public.manga_genres (
  manga_id uuid references public.manga(id) on delete cascade,
  genre_id int  references public.genres(id) on delete cascade,
  primary key (manga_id, genre_id)
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
  pages          int,
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
  total_manga     int default 0,
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

-- auto-create profile on auth signup
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


-- 4. auto-update updated_at timestamps
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
alter table public.profiles        enable row level security;
alter table public.manga           enable row level security;
alter table public.chapters        enable row level security;
alter table public.genres          enable row level security;
alter table public.manga_genres    enable row level security;
alter table public.bookmarks       enable row level security;
alter table public.reading_progress enable row level security;
alter table public.reading_sessions enable row level security;
alter table public.lists           enable row level security;
alter table public.list_items      enable row level security;
alter table public.user_stats      enable row level security;
alter table public.subscriptions   enable row level security;


-- ============================================================
-- POLICIES
-- ============================================================

-- public readable tables
create policy "manga public read"        on public.manga        for select using (true);
create policy "chapters public read"     on public.chapters     for select using (true);
create policy "genres public read"       on public.genres       for select using (true);
create policy "manga_genres public read" on public.manga_genres for select using (true);

-- profiles: public can read public profiles, owner can do everything
create policy "profiles public read" on public.profiles
  for select using (is_public = true);

create policy "own profile" on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- user-owned tables
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
create index if not exists idx_progress_user_manga  on public.reading_progress (user_id, manga_id);
create index if not exists idx_sessions_user        on public.reading_sessions (user_id);
create index if not exists idx_list_items_list      on public.list_items (list_id);
create index if not exists idx_chapters_manga       on public.chapters (manga_id);
create index if not exists idx_manga_genres_manga   on public.manga_genres (manga_id);
create index if not exists idx_manga_genres_genre   on public.manga_genres (genre_id);
create index if not exists idx_chapters_published   on public.chapters (published_at desc);
create index if not exists idx_lists_user           on public.lists (user_id);