-- ============================================================================
-- AI LEARNING HUB — SUPABASE POSTGRESQL PRODUCTION SCHEMA & ROW LEVEL SECURITY
-- Platform: Class 10 Artificial Intelligence (Scalable to Classes 6-10)
-- Features: Streaming Lectures, PDF Notes, Quizzes, Progress, Role-Based Access
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('ADMIN', 'STUDENT');
CREATE TYPE resource_type AS ENUM ('PDF', 'PPT', 'DOC', 'WORKSHEET', 'IMAGE');
CREATE TYPE video_provider AS ENUM ('cloudflare_stream', 'mux', 'direct_stream');
CREATE TYPE badge_level AS ENUM ('STARTER', 'EXPLORER', 'BUILDER', 'ANALYST', 'CREATOR');

-- 2. SCHOOLS TABLE
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city TEXT,
    state TEXT,
    board TEXT DEFAULT 'CBSE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'STUDENT',
    full_name TEXT NOT NULL,
    roll_number TEXT NOT NULL,
    class_number TEXT NOT NULL DEFAULT '10',
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    school_name TEXT NOT NULL,
    avatar_url TEXT,
    learning_streak_days INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CLASSES TABLE (Scalable for Class 6 - 10)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE, -- 'Class 10', 'Class 9', etc.
    numeric_level INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    code TEXT NOT NULL, -- e.g. '417' for CBSE AI
    name TEXT NOT NULL,
    icon TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    class_number TEXT NOT NULL,
    academic_year TEXT DEFAULT '2026-2027',
    description TEXT,
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. UNITS TABLE
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    unit_number INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    display_order INT NOT NULL DEFAULT 1,
    is_published BOOLEAN DEFAULT FALSE,
    estimated_hours NUMERIC(4,1) DEFAULT 6.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. LECTURES TABLE
CREATE TABLE IF NOT EXISTS public.lectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
    lecture_number INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_stream_id TEXT NOT NULL, -- Cloudflare Stream UID or Mux Playback ID
    video_provider video_provider DEFAULT 'cloudflare_stream',
    duration_seconds INT NOT NULL DEFAULT 0,
    thumbnail_url TEXT,
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    key_concepts JSONB DEFAULT '[]'::jsonb,
    important_points JSONB DEFAULT '[]'::jsonb,
    formulas JSONB DEFAULT '[]'::jsonb,
    display_order INT NOT NULL DEFAULT 1,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. RESOURCES TABLE (PDFs, PPTs, Worksheets stored in Supabase Storage / Cloudflare R2)
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
    lecture_id UUID REFERENCES public.lectures(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    resource_type resource_type NOT NULL DEFAULT 'PDF',
    file_size TEXT,
    page_count INT,
    storage_path TEXT NOT NULL, -- Path inside Supabase Storage bucket 'notes_and_resources'
    download_url TEXT NOT NULL,
    text_content_markdown TEXT, -- In-app preview content for instant reading
    display_order INT NOT NULL DEFAULT 1,
    is_published BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. QUIZZES TABLE
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
    lecture_id UUID REFERENCES public.lectures(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    time_limit_minutes INT DEFAULT 10,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. QUIZ QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    explanation TEXT,
    display_order INT DEFAULT 1
);

-- 12. QUIZ ATTEMPTS TABLE (Student attempts & scores)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lecture_id UUID REFERENCES public.lectures(id) ON DELETE SET NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    percentage NUMERIC(5,2) NOT NULL,
    user_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. LECTURE PROGRESS TABLE (Tracks watched timestamp and completion)
CREATE TABLE IF NOT EXISTS public.lecture_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE,
    last_watched_seconds INT NOT NULL DEFAULT 0,
    max_watched_seconds INT NOT NULL DEFAULT 0,
    total_duration_seconds INT NOT NULL DEFAULT 0,
    percentage_watched NUMERIC(5,2) DEFAULT 0.0,
    is_completed BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, lecture_id)
);

-- 14. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_id UUID NOT NULL, -- references lecture_id or resource_id
    item_type TEXT NOT NULL CHECK (item_type IN ('LECTURE', 'RESOURCE')),
    title TEXT NOT NULL,
    subtitle TEXT,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, target_id)
);

-- 15. BADGES & STUDENT BADGES
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    level badge_level NOT NULL,
    criteria TEXT
);

CREATE TABLE IF NOT EXISTS public.student_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, badge_id)
);

-- 16. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'GENERAL',
    is_pinned BOOLEAN DEFAULT FALSE,
    target_unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Students have learning-only access.
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecture_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Helper function: Is current user an Admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROFILES POLICIES
-- Students can read & update their own profile. Admins can view all student profiles.
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 2. CONTENT POLICIES (Units, Lectures, Resources, Quizzes)
-- Students can ONLY view published items. Admins have full access.
CREATE POLICY "Public/Students can view published units"
    ON public.units FOR SELECT
    USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "Admins have full CRUD on units"
    ON public.units FOR ALL
    USING (public.is_admin());

CREATE POLICY "Students can view published lectures"
    ON public.lectures FOR SELECT
    USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "Admins have full CRUD on lectures"
    ON public.lectures FOR ALL
    USING (public.is_admin());

CREATE POLICY "Students can view published resources"
    ON public.resources FOR SELECT
    USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "Admins have full CRUD on resources"
    ON public.resources FOR ALL
    USING (public.is_admin());

CREATE POLICY "Students can view published quizzes"
    ON public.quizzes FOR SELECT
    USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "Admins have full CRUD on quizzes"
    ON public.quizzes FOR ALL
    USING (public.is_admin());

-- 3. QUESTIONS POLICIES
CREATE POLICY "Students can view questions for published quizzes"
    ON public.questions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.quizzes
        WHERE quizzes.id = questions.quiz_id AND (quizzes.is_published = TRUE OR public.is_admin())
    ));

CREATE POLICY "Admins have full CRUD on questions"
    ON public.questions FOR ALL
    USING (public.is_admin());

-- 4. STUDENT PROGRESS & ATTEMPTS POLICIES
-- Strict Isolation: Students can only read and write their OWN progress and attempts.
CREATE POLICY "Students manage own progress"
    ON public.lecture_progress FOR ALL
    USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Students manage own quiz attempts"
    ON public.quiz_attempts FOR ALL
    USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Students manage own bookmarks"
    ON public.bookmarks FOR ALL
    USING (auth.uid() = student_id);

-- 5. ANNOUNCEMENTS
CREATE POLICY "Anyone can view announcements"
    ON public.announcements FOR SELECT
    USING (TRUE);

CREATE POLICY "Admins manage announcements"
    ON public.announcements FOR ALL
    USING (public.is_admin());

-- ============================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION
-- Bucket Name: 'notes_and_resources'
-- ============================================================================
-- 1. Read: Anyone authenticated or students can read/download published documents
-- 2. Write/Delete: Strictly authenticated admins only
