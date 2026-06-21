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
  title_en  text,
  author    text,
  status    text,
  total_chapters float,
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
-- READING PROGRESS
-- ============================================================
create table if not exists public.reading_progress (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references public.profiles(id) on delete cascade not null,
  manga_id       uuid references public.manga(id) on delete cascade not null,
  chapter_number float not null,
  chapter_id     text, 
  page_number    int default 1,
  updated_at     timestamp with time zone default now(),
  unique(user_id, manga_id)
);

-- ============================================================
-- LISTS
-- ============================================================
create table if not exists public.lists (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  name        text not null,
  icon        text,
  color       text,
  is_public   boolean default false,
  position    int not null default 0,
  created_at  timestamp with time zone default now(),
  updated_at  timestamp with time zone default now()
  
  constraint lists_name_length check (char_length(name) <= 32)
);


-- ============================================================
-- LIST ITEMS
-- ============================================================
create table if not exists public.list_items (
  id       uuid primary key default gen_random_uuid(),
  list_id  uuid references public.lists(id) on delete cascade not null,
  manga_id uuid references public.manga(id) on delete cascade not null,
  added_at timestamp with time zone default now(),
  unique(list_id, manga_id)
);


-- ============================================================
-- USER STATS
-- ============================================================
create table if not exists public.user_stats (
  user_id         uuid references public.profiles(id) on delete cascade primary key,
  total_chapters  int default 0,
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

-- 3. total_chapters
create or replace function public.update_stats_on_progress()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
    update public.user_stats
    set
        total_chapters = (
            select coalesce(sum(floor(chapter_number)), 0)
            from public.reading_progress
            where user_id = NEW.user_id
        ),
        updated_at = now()
    where user_id = NEW.user_id;
    return NEW;
end;
$$;

drop trigger if exists on_reading_progress_update on public.reading_progress;
create trigger on_reading_progress_update
  after insert or update on public.reading_progress
  for each row execute function public.update_stats_on_progress();

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

-- 5. limit on lists - 12 per user
create or replace function public.check_lists_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  list_count int;
begin
  select count(*) into list_count
  from public.lists
  where user_id = NEW.user_id;

  if list_count >= 12 then
    raise exception 'Collection limit reached (12 max)';
  end if;

  return NEW;
end;
$$;

drop trigger if exists on_list_insert_limit on public.lists;
create trigger on_list_insert_limit
  before insert on public.lists
  for each row execute function public.check_lists_limit();

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
alter table public.bookmarks        enable row level security;
alter table public.reading_progress enable row level security;
alter table public.lists            enable row level security;
alter table public.list_items       enable row level security;
alter table public.user_stats       enable row level security;
alter table public.subscriptions    enable row level security;


-- ============================================================
-- POLICIES
-- ============================================================

create policy "manga public read"
  on public.manga
  for select
  to authenticated
  using (true);

create policy "manga insert (cache)"
  on public.manga
  for insert
  to authenticated
  with check (true);

create policy "manga update (cache)"
  on public.manga
  for update
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- MANGA_SOURCES (cache for authenticated)
-- ============================================================
create policy "manga_sources public read"
  on public.manga_sources
  for select
  to authenticated
  using (true);

create policy "manga_sources insert (cache)"
  on public.manga_sources
  for insert
  to authenticated
  with check (true);

create policy "manga_sources update (cache)"
  on public.manga_sources
  for update
  to authenticated
  using (true)
  with check (true);

-- Public read (only if is_public = true)
create policy "profiles public read"
  on public.profiles
  for select
  to authenticated
  using (is_public = true);

-- Own profile read
create policy "own profile select"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Own profile insert
create policy "own profile insert"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Own profile update
create policy "own profile update"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Own profile delete
create policy "own profile delete"
  on public.profiles
  for delete
  to authenticated
  using (auth.uid() = id);

-- user owned
create policy "own bookmarks"
  on public.bookmarks
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own progress"
  on public.reading_progress
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own lists"
  on public.lists
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own list items"
  on public.list_items
  for all
  to authenticated
  using (auth.uid() = (select user_id from public.lists where id = list_id))
  with check (auth.uid() = (select user_id from public.lists where id = list_id));

create policy "own stats"
  on public.user_stats
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own subscription"
  on public.subscriptions
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_bookmarks_score      on public.bookmarks (user_id, score);
create index if not exists idx_bookmarks_user       on public.bookmarks (user_id);
create index if not exists idx_bookmarks_manga      on public.bookmarks (manga_id);
create index if not exists idx_bookmarks_status     on public.bookmarks (user_id, read_status);
create index if not exists idx_progress_user_manga  on public.reading_progress (user_id, manga_id);
create index if not exists idx_list_items_list      on public.list_items (list_id);
create index if not exists idx_lists_user           on public.lists (user_id);
create index if not exists idx_manga_sources_manga  on public.manga_sources (manga_id);
create index if not exists idx_manga_sources_lookup on public.manga_sources (source, external_id);
create index if not exists idx_manga_title_ru       on public.manga using gin(to_tsvector('russian', title));
create index if not exists idx_manga_title_en       on public.manga using gin(to_tsvector('english', coalesce(title_en, '')));