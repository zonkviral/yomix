-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- SHARED HELPERS
-- ============================================================
-- auto-update updated_at on row update
CREATE OR REPLACE FUNCTION public.update_timestamp()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SET search_path = ''
    AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.normalize_manga_title(p_title text)
    RETURNS text
    LANGUAGE sql
    IMMUTABLE
    SET search_path = ''
    AS $$
    SELECT
        trim(regexp_replace(lower(p_title), '[^[:alnum:]]+', ' ', 'g'));
$$;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE public.profiles(
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username text UNIQUE,
    bio text,
    banner_url text,
    system_lang text DEFAULT 'en',
    is_public boolean DEFAULT TRUE,
    avatar_type text NOT NULL DEFAULT 'generated' CHECK (avatar_type IN ('generated', 'upload')),
    avatar_seed text NOT NULL DEFAULT substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================
-- MANGA
-- ============================================================
CREATE TABLE IF NOT EXISTS public.manga(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id text NOT NULL UNIQUE,
    author text,
    status text,
    total_chapters float,
    cover_url text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    genres text[] NOT NULL DEFAULT '{}'
);

-- ============================================================
-- MANGA TITLES
-- ============================================================
CREATE TABLE public.manga_titles(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    manga_id uuid NOT NULL REFERENCES public.manga(id) ON DELETE CASCADE,
    lang text NOT NULL CHECK (char_length(lang) BETWEEN 2 AND 16),
    title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 500),
    normalized_title text GENERATED ALWAYS AS (public.normalize_manga_title(title)) STORED,
    title_type text NOT NULL DEFAULT 'alternative' CHECK (title_type IN ('original', 'alternative')),
    is_primary boolean NOT NULL DEFAULT FALSE,
    UNIQUE (manga_id, lang, title)
);

-- ============================================================
-- BOOKMARKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookmarks(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    manga_id uuid REFERENCES public.manga(id) ON DELETE CASCADE NOT NULL,
    read_status text DEFAULT 'plan_to_read' CHECK (read_status IN ('reading', 'completed', 'plan_to_read', 'dropped', 'on_hold')),
    score int CHECK (score BETWEEN 1 AND 10),
    notes text,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, manga_id)
);

-- ============================================================
-- READING PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reading_progress(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    manga_id uuid REFERENCES public.manga(id) ON DELETE CASCADE NOT NULL,
    source text NOT NULL DEFAULT 'mangadex' CHECK (source IN ('mangadex', 'remanga', 'mangalib', 'senkuro')),
    chapter_number float NOT NULL,
    chapter_id text,
    page_number int DEFAULT 1,
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, manga_id)
);

-- ============================================================
-- COLLECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.collections(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 32),
    icon text CHECK (char_length(icon) <= 32),
    color text CHECK (char_length(color) <= 32),
    is_public boolean NOT NULL DEFAULT FALSE,
    position int NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.collection_items(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id uuid REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
    manga_id uuid REFERENCES public.manga(id) ON DELETE CASCADE NOT NULL,
    added_at timestamp with time zone DEFAULT now(),
    UNIQUE (collection_id, manga_id)
);

-- ============================================================
-- USER STATS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_stats(
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    total_chapters int DEFAULT 0,
    longest_streak int NOT NULL DEFAULT 0,
    completed_count int NOT NULL DEFAULT 0,
    current_streak int NOT NULL DEFAULT 0,
    updated_at timestamp with time zone DEFAULT now(),
    last_visit_date date
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    started_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone,
    stripe_customer_id text,
    stripe_subscription_id text
);

-- ============================================================
-- CHAPTER READS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.chapter_reads(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    manga_id uuid REFERENCES public.manga(id) ON DELETE CASCADE NOT NULL,
    chapter_id text NOT NULL,
    chapter_number float,
    pages int,
    read_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_manga_genres ON public.manga USING gin(genres);

CREATE UNIQUE INDEX idx_manga_titles_primary ON public.manga_titles(manga_id, lang)
WHERE
    is_primary;

CREATE INDEX idx_manga_titles_search ON public.manga_titles USING gin(normalized_title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_chapter_reads_user_date ON public.chapter_reads(user_id, read_at DESC);

CREATE INDEX IF NOT EXISTS idx_chapter_reads_user_manga ON public.chapter_reads(user_id, manga_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_score ON public.bookmarks(user_id, score);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_manga ON public.bookmarks(manga_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_status ON public.bookmarks(user_id, read_status);

CREATE INDEX IF NOT EXISTS idx_progress_user_manga ON public.reading_progress(user_id, manga_id);

CREATE INDEX IF NOT EXISTS idx_collections_user ON public.collections(user_id);

CREATE INDEX IF NOT EXISTS idx_collection_items_manga ON public.collection_items(manga_id);

-- ============================================================
-- FUNCTIONS
-- ============================================================
-- auto-create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
    AS $$
DECLARE
    v_lang text := coalesce(NEW.raw_user_meta_data ->> 'system_lang', '');
BEGIN
    IF v_lang !~ '^[a-z]{2,3}$' THEN
        v_lang := 'en';
    END IF;
    INSERT INTO public.profiles(id, username, system_lang)
        VALUES (NEW.id, NEW.raw_user_meta_data ->> 'username', v_lang)
    ON CONFLICT (id)
        DO UPDATE SET
            username = coalesce(excluded.username, public.profiles.username);
    RETURN new;
END;
$$;

-- auto-create user_stats row when profile is created
CREATE OR REPLACE FUNCTION public.handle_new_profile()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
    AS $$
BEGIN
    INSERT INTO public.user_stats(user_id)
        VALUES(NEW.id)
    ON CONFLICT(user_id)
        DO NOTHING;
    RETURN new;
END;
$$;

-- limit on collections - 12 per user
CREATE OR REPLACE FUNCTION public.check_collections_limit()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
    AS $$
DECLARE
    collection_count int;
BEGIN
    SELECT
        count(*)
    INTO
        collection_count
    FROM
        public.collections
    WHERE
        user_id = NEW.user_id;
    IF collection_count >= 12 THEN
        RAISE EXCEPTION 'Collection limit reached (12 max)';
    END IF;
    RETURN NEW;
END;
$$;

-- get all collections for a user, with manga external_ids aggregated
CREATE OR REPLACE FUNCTION public.get_user_collections(p_user_id uuid)
    RETURNS TABLE(
        id uuid,
        name text,
        color text,
        icon text,
        is_public boolean,
        "position" int,
        external_ids text[])
    LANGUAGE sql
    STABLE
    SECURITY INVOKER
    SET search_path = ''
    AS $$
    SELECT
        c.id,
        c.name,
        c.color,
        c.icon,
        c.is_public,
        c.position,
        coalesce(array_agg(m.external_id ORDER BY ci.added_at) FILTER(WHERE m.external_id IS NOT NULL), '{}')
    FROM
        public.collections c
    LEFT JOIN public.collection_items ci ON ci.collection_id = c.id
    LEFT JOIN public.manga m ON m.id = ci.manga_id
WHERE
    c.user_id = p_user_id
GROUP BY
    c.id
ORDER BY
    c.position;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_collections(uuid) TO authenticated;

-- resolve manga title with language preference
CREATE OR REPLACE FUNCTION public.resolve_manga_title(p_manga_id uuid, p_system_lang text DEFAULT 'en')
    RETURNS text
    LANGUAGE sql
    STABLE
    SET search_path = ''
    AS $$
    SELECT
        coalesce((
            SELECT
                mt.title
            FROM public.manga_titles mt
            WHERE
                mt.manga_id = p_manga_id
                AND mt.lang = p_system_lang
                AND mt.is_primary = TRUE LIMIT 1),(
        SELECT
            mt.title
        FROM public.manga_titles mt
        WHERE
            mt.manga_id = p_manga_id
            AND mt.lang = 'en'
            AND mt.is_primary = TRUE LIMIT 1),(
    SELECT
        mt.title
    FROM public.manga_titles mt
WHERE
    mt.manga_id = p_manga_id ORDER BY mt.is_primary DESC LIMIT 1));
$$;

-- resolve manga titles for multiple manga_ids with language preference
CREATE OR REPLACE FUNCTION public.resolve_manga_titles(p_manga_ids uuid[], p_system_lang text DEFAULT 'en')
    RETURNS TABLE(
        manga_id uuid,
        title text)
    LANGUAGE sql
    STABLE
    SET search_path = ''
    AS $$
    SELECT
        m_id,
        public.resolve_manga_title(m_id, p_system_lang)
    FROM
        unnest(p_manga_ids) AS m_id;
$$;

GRANT EXECUTE ON FUNCTION public.resolve_manga_titles(uuid[], text) TO authenticated, service_role;

-- get continue reading
CREATE OR REPLACE FUNCTION public.get_continue_reading(p_user_id uuid, p_system_lang text DEFAULT 'en')
    RETURNS TABLE(
        id uuid,
        read_status text,
        created_at timestamptz,
        updated_at timestamptz,
        manga_id uuid,
        manga_title text,
        manga_cover_url text,
        manga_total_chapters float,
        manga_author text,
        external_id text,
        reading_source text,
        chapter_id text,
        chapter_number float,
        page_number int,
        progress_updated_at timestamptz)
    LANGUAGE sql
    STABLE
    SECURITY INVOKER
    SET search_path = ''
    AS $$
    SELECT
        b.id,
        b.read_status,
        b.created_at,
        b.updated_at,
        m.id,
        public.resolve_manga_title(m.id, p_system_lang),
        m.cover_url,
        m.total_chapters,
        m.author,
        m.external_id,
        rp.source,
        rp.chapter_id,
        rp.chapter_number,
        rp.page_number,
        rp.updated_at
    FROM
        public.bookmarks b
        INNER JOIN public.manga m ON m.id = b.manga_id
        INNER JOIN public.reading_progress rp ON rp.manga_id = b.manga_id
            AND rp.user_id = b.user_id
    WHERE
        b.user_id = p_user_id
    ORDER BY
        rp.updated_at DESC
    LIMIT 10;
$$;

GRANT EXECUTE ON FUNCTION public.get_continue_reading(uuid, text) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_continue_reading(uuid, text) TO authenticated;

-- total_chapters, recomputed from chapter_reads, scoped to manga
CREATE OR REPLACE FUNCTION public.update_stats_on_chapter_read()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
    AS $$
BEGIN
    UPDATE
        public.user_stats
    SET
        total_chapters =(
            SELECT
                count(DISTINCT(cr.manga_id, cr.chapter_number))
            FROM
                public.chapter_reads cr
            WHERE
                cr.user_id = NEW.user_id
                AND EXISTS(
                    SELECT
                        1
                    FROM
                        public.bookmarks b
                    WHERE
                        b.user_id = cr.user_id
                        AND b.manga_id = cr.manga_id)),
            updated_at = now()
    WHERE
        user_id = NEW.user_id;
    RETURN new;
END;
$$;

-- completed_count, maintained from bookmark status transitions
CREATE OR REPLACE FUNCTION public.update_completed_count()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
    AS $$
BEGIN
    IF tg_op = 'INSERT' THEN
        IF NEW.read_status = 'completed' THEN
            UPDATE
                public.user_stats
            SET
                completed_count = completed_count + 1,
                updated_at = now()
            WHERE
                user_id = NEW.user_id;
        END IF;
    ELSIF tg_op = 'UPDATE' THEN
        IF NEW.read_status = 'completed' AND OLD.read_status IS DISTINCT FROM 'completed' THEN
            UPDATE
                public.user_stats
            SET
                completed_count = completed_count + 1,
                updated_at = now()
            WHERE
                user_id = NEW.user_id;
        ELSIF OLD.read_status = 'completed'
                AND NEW.read_status IS DISTINCT FROM 'completed' THEN
                UPDATE
                    public.user_stats
                SET
                    completed_count = greatest(completed_count - 1, 0),
                    updated_at = now()
                WHERE
                    user_id = NEW.user_id;
        END IF;
    ELSIF tg_op = 'DELETE' THEN
        IF OLD.read_status = 'completed' THEN
            UPDATE
                public.user_stats
            SET
                completed_count = greatest(completed_count - 1, 0),
                updated_at = now()
            WHERE
                user_id = OLD.user_id;
        END IF;
        RETURN old;
    END IF;
    RETURN new;
END;
$$;

-- daily check-in — powers the login/visit streak
CREATE OR REPLACE FUNCTION public.record_daily_visit()
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
    AS $$
DECLARE
    v_user_id uuid := auth.uid();
    today date :=(now() at time zone 'utc')::date;
    v_last_visit date;
    v_current_streak int;
    new_streak int;
BEGIN
    IF v_user_id IS NULL THEN
        RETURN;
    END IF;
    SELECT
        last_visit_date,
        current_streak
    INTO
        v_last_visit,
        v_current_streak
    FROM
        public.user_stats
    WHERE
        user_id = v_user_id;
    IF v_last_visit IS NULL THEN
        new_streak := 1;
    ELSIF v_last_visit = today THEN
        RETURN;
    ELSIF v_last_visit = today - 1 THEN
        new_streak := v_current_streak + 1;
    ELSE
        new_streak := 1;
    END IF;
    UPDATE
        public.user_stats
    SET
        current_streak = new_streak,
        longest_streak = greatest(longest_streak, new_streak),
        last_visit_date = today,
        updated_at = now()
    WHERE
        user_id = v_user_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.record_daily_visit() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.record_daily_visit() TO authenticated;

-- profile header stat bar
CREATE OR REPLACE FUNCTION public.get_profile_stats(p_user_id uuid)
    RETURNS TABLE(
        bookmarks_count int,
        completed_count int,
        collections_count int,
        longest_streak int,
        current_streak int,
        avg_score numeric)
    LANGUAGE sql
    STABLE
    SECURITY INVOKER
    SET search_path = ''
    AS $$
    SELECT
(
            SELECT
                count(*)
            FROM
                public.bookmarks
            WHERE
                user_id = p_user_id)::int,
        us.completed_count,
(
            SELECT
                count(*)
            FROM
                public.collections
            WHERE
                user_id = p_user_id)::int,
        us.longest_streak,
        us.current_streak,
(
            SELECT
                round(avg(score), 2)
            FROM
                public.bookmarks
            WHERE
                user_id = p_user_id
                AND score IS NOT NULL)
    FROM
        public.user_stats us
    WHERE
        us.user_id = p_user_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_profile_stats(uuid) TO authenticated;

-- period-scoped plate under the activity graph
CREATE OR REPLACE FUNCTION public.get_period_stats(p_user_id uuid, p_start timestamptz, p_end timestamptz)
    RETURNS TABLE(
        bookmarks_added int,
        chapters_read int)
    LANGUAGE sql
    STABLE
    SECURITY INVOKER
    SET search_path = ''
    AS $$
    SELECT
(
            SELECT
                count(*)
            FROM
                public.bookmarks
            WHERE
                user_id = p_user_id
                AND created_at >= p_start
                AND created_at < p_end)::int,
(
            SELECT
                count(*)
            FROM
                public.chapter_reads cr
            WHERE
                cr.user_id = p_user_id
                AND cr.read_at >= p_start
                AND cr.read_at < p_end
                AND EXISTS(
                    SELECT
                        1
                    FROM
                        public.bookmarks b
                    WHERE
                        b.user_id = cr.user_id
                        AND b.manga_id = cr.manga_id))::int;
$$;

GRANT EXECUTE ON FUNCTION public.get_period_stats(uuid, timestamptz, timestamptz) TO authenticated;

-- favorite genres — percentage breakdown across non-dropped bookmarks
CREATE OR REPLACE FUNCTION public.get_favorite_genres(p_user_id uuid)
    RETURNS TABLE(
        genre text,
        manga_count int,
        percentage numeric)
    LANGUAGE sql
    STABLE
    SECURITY INVOKER
    SET search_path = ''
    AS $$
    WITH genre_counts AS(
        SELECT
            g.genre,
            count(*) AS manga_count
        FROM
            public.bookmarks b
            JOIN public.manga m ON m.id = b.manga_id
            CROSS JOIN LATERAL unnest(m.genres) AS g(genre)
        WHERE
            b.user_id = p_user_id
            AND b.read_status <> 'dropped'
        GROUP BY
            g.genre
),
total AS(
    SELECT
        sum(manga_count) AS total_count
    FROM
        genre_counts
)
SELECT
    gc.genre,
    gc.manga_count::int,
    round(gc.manga_count * 100.0 / nullif(t.total_count, 0), 1) AS percentage
FROM
    genre_counts gc,
    total t
ORDER BY
    gc.manga_count DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_favorite_genres(uuid) TO authenticated;

-- search manga by title, with fuzzy matching and language preference
CREATE OR REPLACE FUNCTION public.search_manga_titles(p_query text, p_system_lang text DEFAULT 'en', p_limit int DEFAULT 20, p_user_id uuid DEFAULT NULL)
    RETURNS TABLE(
        manga_id uuid,
        display_title text,
        matched_title text,
        matched_lang text,
        score real)
    LANGUAGE sql
    STABLE
    SET search_path = ''
    AS $$
    WITH q AS(
        SELECT
            public.normalize_manga_title(p_query) AS query
),
best AS(
    SELECT DISTINCT ON(mt.manga_id)
        mt.manga_id,
        mt.title AS matched_title,
        mt.lang AS matched_lang,
(public.word_similarity(q.query, mt.normalized_title) + CASE WHEN mt.normalized_title = q.query THEN
                1.0
            ELSE
                0.0
            END + CASE WHEN mt.lang = p_system_lang THEN
                0.10
            ELSE
                0.0
            END + CASE WHEN mt.is_primary THEN
                0.05
            ELSE
                0.0
            END)::real AS score
    FROM
        public.manga_titles mt
        CROSS JOIN q
    WHERE
        q.query OPERATOR(public. <%) mt.normalized_title
        AND(p_user_id IS NULL
            OR EXISTS(
                SELECT
                    1
                FROM
                    public.bookmarks b
                WHERE
                    b.manga_id = mt.manga_id
                    AND b.user_id = p_user_id))
        ORDER BY
            mt.manga_id,
            score DESC
)
    SELECT
        b.manga_id,
        public.resolve_manga_title(b.manga_id, p_system_lang),
        b.matched_title,
        b.matched_lang,
        b.score
    FROM
        best b
    ORDER BY
        b.score DESC
    LIMIT greatest(1, least(p_limit, 100));
$$;

GRANT EXECUTE ON FUNCTION public.search_manga_titles(text, text, int, uuid) TO authenticated;

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE TRIGGER set_manga_timestamp
    BEFORE UPDATE ON public.manga
    FOR EACH ROW
    WHEN(OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_metadata_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN(old.raw_user_meta_data ->> 'username' IS DISTINCT FROM new.raw_user_meta_data ->> 'username')
    EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_profile();

CREATE TRIGGER on_chapter_read_insert
    AFTER INSERT ON public.chapter_reads
    FOR EACH ROW
    EXECUTE FUNCTION public.update_stats_on_chapter_read();

CREATE TRIGGER on_bookmark_completed_count
    AFTER INSERT OR UPDATE OR DELETE ON public.bookmarks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_completed_count();

CREATE TRIGGER on_collection_insert_limit
    BEFORE INSERT ON public.collections
    FOR EACH ROW
    EXECUTE FUNCTION public.check_collections_limit();

CREATE TRIGGER set_profile_timestamp
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER set_bookmarks_timestamp
    BEFORE UPDATE ON public.bookmarks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER set_collections_timestamp
    BEFORE UPDATE ON public.collections
    FOR EACH ROW
    EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER set_progress_timestamp
    BEFORE UPDATE ON public.reading_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.update_timestamp();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.manga ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.manga_titles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.chapter_reads ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('avatars', 'avatars', TRUE, 1048576, ARRAY['image/webp', 'image/jpeg', 'image/png'])
ON CONFLICT (id)
    DO NOTHING;

-- ============================================================
-- POLICIES
-- ============================================================
CREATE POLICY "manga titles public read" ON public.manga_titles
    FOR SELECT TO authenticated
    USING (TRUE);

CREATE POLICY "own chapter reads" ON public.chapter_reads
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "manga public read" ON public.manga
    FOR SELECT TO authenticated
    USING (TRUE);

CREATE POLICY "public collections read" ON public.collections
    FOR SELECT TO authenticated
    USING (is_public = TRUE);

CREATE POLICY "public collection items read" ON public.collection_items
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT
            1
        FROM
            public.collections c
        WHERE
            c.id = collection_id
            AND c.is_public = TRUE));

CREATE POLICY "profiles read" ON public.profiles
    FOR SELECT TO authenticated
    USING (is_public
        OR (
            SELECT
                auth.uid()) = id);

-- Own profile insert
CREATE POLICY "own profile insert" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

-- Own profile update
CREATE POLICY "own profile update" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Own profile delete
CREATE POLICY "own profile delete" ON public.profiles
    FOR DELETE TO authenticated
    USING (auth.uid() = id);

-- user owned
CREATE POLICY "own bookmarks" ON public.bookmarks
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own progress" ON public.reading_progress
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own collections" ON public.collections
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own collection items" ON public.collection_items
    FOR ALL TO authenticated
    USING ((
        SELECT
            auth.uid()) =(
                SELECT
                    c.user_id
                FROM
                    public.collections c
                WHERE
                    c.id = collection_items.collection_id))
    WITH CHECK ((
        SELECT
            auth.uid()) =(
                SELECT
                    c.user_id
                FROM
                    public.collections c
                WHERE
                    c.id = collection_items.collection_id));

CREATE POLICY "own subscription" ON public.subscriptions
    FOR SELECT TO authenticated
    USING ((
        SELECT
            auth.uid()) = user_id);

CREATE POLICY "read own stats" ON public.user_stats
    FOR SELECT TO authenticated
    USING ((
        SELECT
            auth.uid()) = user_id);

-- Storage object policies
CREATE POLICY "own avatar upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'avatars'
    AND (storage.foldername(name))[1] =(
        SELECT
            auth.uid())::text);

CREATE POLICY "own avatar update" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'avatars'
        AND (storage.foldername(name))[1] =(
            SELECT
                auth.uid())::text);

CREATE POLICY "avatars public read" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'avatars');

