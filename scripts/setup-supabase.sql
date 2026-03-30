-- =============================================
-- EuroUni Database Setup Script for Supabase
-- Run this in: Supabase SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql editor
-- =============================================

-- =============================================
-- Extensions
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Reference Tables
-- =============================================

CREATE TABLE IF NOT EXISTS countries (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(3) NOT NULL UNIQUE,
    name        VARCHAR(100) NOT NULL,
    region      VARCHAR(50),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_fields (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(100) NOT NULL UNIQUE,
    name        VARCHAR(100) NOT NULL,
    keywords    TEXT[],
    parent_id   UUID REFERENCES study_fields(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS languages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(10) NOT NULL UNIQUE,
    name        VARCHAR(50) NOT NULL,
    is_local    BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS degree_types (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(20) NOT NULL UNIQUE,
    name        VARCHAR(50) NOT NULL,
    level       INTEGER NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS instruction_types (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(20) NOT NULL UNIQUE,
    name        VARCHAR(50) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- Universities
-- =============================================

CREATE TABLE IF NOT EXISTS universities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legacy_id       VARCHAR(50) UNIQUE,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    country_id      UUID NOT NULL REFERENCES countries(id),
    city            VARCHAR(100) NOT NULL,
    city_slug       VARCHAR(100) NOT NULL,
    latitude        DECIMAL(9,6) NOT NULL,
    longitude       DECIMAL(9,6) NOT NULL,
    website         VARCHAR(255),
    logo_url        VARCHAR(500),
    qs_rank         INTEGER,
    ranking_year    INTEGER,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    deleted_at      TIMESTAMPTZ,
    created_by      UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_universities_coords ON universities (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_universities_country ON universities (country_id);
CREATE INDEX IF NOT EXISTS idx_universities_active ON universities (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_universities_slug ON universities (slug);

-- =============================================
-- Programs & Versions (Temporal)
-- =============================================

CREATE TABLE IF NOT EXISTS programs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legacy_id       VARCHAR(50) UNIQUE,
    university_id   UUID NOT NULL REFERENCES universities(id),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL,
    field_id        UUID NOT NULL REFERENCES study_fields(id),
    degree_type_id  UUID NOT NULL REFERENCES degree_types(id),
    instruction_type_id UUID NOT NULL REFERENCES instruction_types(id),
    primary_language_id UUID NOT NULL REFERENCES languages(id),
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    deleted_at      TIMESTAMPTZ,
    created_by      UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (university_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_programs_university ON programs (university_id);
CREATE INDEX IF NOT EXISTS idx_programs_field ON programs (field_id);
CREATE INDEX IF NOT EXISTS idx_programs_active ON programs (is_active) WHERE is_active = true;

-- =============================================
-- Program Versions (Yearly Snapshots)
-- =============================================

CREATE TABLE IF NOT EXISTS program_versions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id      UUID NOT NULL REFERENCES programs(id),
    academic_year   VARCHAR(9) NOT NULL,
    effective_from  DATE NOT NULL,
    effective_to    DATE,
    is_current      BOOLEAN NOT NULL DEFAULT false,
    ects            INTEGER NOT NULL,
    duration_months INTEGER NOT NULL,
    tuition_eur     INTEGER NOT NULL DEFAULT 0,
    tuition_note     VARCHAR(255),
    living_cost_eur INTEGER,
    description     TEXT,
    official_url    VARCHAR(500),
    data_source     VARCHAR(20) NOT NULL DEFAULT 'manual',
    scraped_at      TIMESTAMPTZ,
    scrape_url      VARCHAR(500),
    scrape_hash     VARCHAR(64),
    created_by      UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (program_id, academic_year)
);

CREATE INDEX IF NOT EXISTS idx_pv_program_current ON program_versions (program_id, is_current) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_pv_effective ON program_versions (program_id, effective_from, effective_to);
CREATE INDEX IF NOT EXISTS idx_pv_academic_year ON program_versions (academic_year);

-- =============================================
-- Admission Criteria (Versioned)
-- =============================================

CREATE TABLE IF NOT EXISTS admission_criteria (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_version_id UUID NOT NULL REFERENCES program_versions(id) ON DELETE CASCADE,
    requirement_type   VARCHAR(50) NOT NULL,
    label              VARCHAR(255) NOT NULL,
    criteria_json      JSONB NOT NULL DEFAULT '{}',
    is_hard            BOOLEAN NOT NULL DEFAULT true,
    priority           INTEGER NOT NULL DEFAULT 0,
    created_by          UUID,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admission_version ON admission_criteria (program_version_id);
CREATE INDEX IF NOT EXISTS idx_admission_type ON admission_criteria (requirement_type);

-- =============================================
-- Tuition & Cost History (Versioned)
-- =============================================

CREATE TABLE IF NOT EXISTS program_costs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_version_id  UUID NOT NULL REFERENCES program_versions(id) ON DELETE CASCADE,
    cost_category       VARCHAR(30) NOT NULL,
    amount_eur           INTEGER NOT NULL,
    currency             VARCHAR(3) NOT NULL DEFAULT 'EUR',
    effective_from       DATE NOT NULL,
    effective_to         DATE,
    note                 VARCHAR(255),
    created_by           UUID,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_costs_version ON program_costs (program_version_id);
CREATE INDEX IF NOT EXISTS idx_costs_category ON program_costs (cost_category);

-- =============================================
-- Program Language Variants
-- =============================================

CREATE TABLE IF NOT EXISTS program_version_languages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_version_id  UUID NOT NULL REFERENCES program_versions(id) ON DELETE CASCADE,
    language_id         UUID NOT NULL REFERENCES languages(id),
    instruction_pct     INTEGER NOT NULL CHECK (instruction_pct >= 0 AND instruction_pct <= 100),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (program_version_id, language_id)
);

-- =============================================
-- Student Profiles
-- =============================================

CREATE TABLE IF NOT EXISTS students (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id    UUID NOT NULL UNIQUE,
    gpa             DECIMAL(5,2),
    math_level      INTEGER CHECK (math_level >= 0 AND math_level <= 100),
    science_level   INTEGER CHECK (science_level >= 0 AND science_level <= 100),
    home_city       VARCHAR(100),
    home_latitude   DECIMAL(9,6),
    home_longitude  DECIMAL(9,6),
    preferred_city_size INTEGER CHECK (preferred_city_size >= 0 AND preferred_city_size <= 100),
    distance_max_km INTEGER DEFAULT 500,
    english_level   INTEGER CHECK (english_level >= 0 AND english_level <= 100),
    willing_learn_local INTEGER CHECK (willing_learn_local >= 0 AND willing_learn_local <= 100),
    monthly_budget  INTEGER DEFAULT 1000,
    career_focus    INTEGER CHECK (career_focus >= 0 AND career_focus <= 100),
    field_of_study_id UUID REFERENCES study_fields(id),
    preferred_countries  UUID[],
    preferred_degree_types UUID[],
    preferred_instruction_types UUID[],
    onboarding_complete BOOLEAN NOT NULL DEFAULT false,
    onboarding_completed_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_auth ON students (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_students_field ON students (field_of_study_id);

-- =============================================
-- Saved & Matched Programs
-- =============================================

CREATE TABLE IF NOT EXISTS saved_programs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES students(id),
    program_id      UUID NOT NULL REFERENCES programs(id),
    note            TEXT,
    saved_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, program_id)
);

CREATE TABLE IF NOT EXISTS program_matches (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES students(id),
    program_version_id UUID NOT NULL REFERENCES program_versions(id),
    university_id   UUID NOT NULL REFERENCES universities(id),
    score           DECIMAL(5,2) NOT NULL,
    breakdown_json  JSONB NOT NULL DEFAULT '{}',
    distance_km     DECIMAL(10,2),
    weights_json    JSONB NOT NULL DEFAULT '{}',
    match_label     VARCHAR(30),
    search_session_id UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matches_student ON program_matches (student_id);
CREATE INDEX IF NOT EXISTS idx_matches_version ON program_matches (program_version_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON program_matches (student_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_matches_session ON program_matches (student_id, search_session_id);

-- =============================================
-- Scoring Weights Configuration
-- =============================================

CREATE TABLE IF NOT EXISTS scoring_weight_configs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(50) NOT NULL DEFAULT 'default',
    description     TEXT,
    academic        DECIMAL(4,3) NOT NULL DEFAULT 0.25,
    location        DECIMAL(4,3) NOT NULL DEFAULT 0.15,
    language        DECIMAL(4,3) NOT NULL DEFAULT 0.20,
    budget          DECIMAL(4,3) NOT NULL DEFAULT 0.20,
    career          DECIMAL(4,3) NOT NULL DEFAULT 0.20,
    is_active       BOOLEAN NOT NULL DEFAULT false,
    student_id      UUID REFERENCES students(id),
    created_by      UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (name),
    UNIQUE (student_id)
);

-- =============================================
-- Data Change Log (Audit Trail)
-- =============================================

CREATE TABLE IF NOT EXISTS data_change_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type      VARCHAR(50) NOT NULL,
    entity_id        UUID NOT NULL,
    changed_by      UUID,
    change_source   VARCHAR(20) NOT NULL DEFAULT 'manual',
    change_reason   TEXT,
    change_json     JSONB NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_change_log_entity ON data_change_log (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_change_log_time ON data_change_log (created_at DESC);

-- =============================================
-- Scraping Pipeline Metadata
-- =============================================

CREATE TABLE IF NOT EXISTS scrape_jobs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',
    scraper_name    VARCHAR(100) NOT NULL,
    target_url      VARCHAR(500),
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    error_message   TEXT,
    programs_updated  INTEGER DEFAULT 0,
    programs_created  INTEGER DEFAULT 0,
    programs_failed   INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scrape_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scrape_job_id   UUID REFERENCES scrape_jobs(id),
    university_id   UUID REFERENCES universities(id),
    program_id      UUID REFERENCES programs(id),
    level           VARCHAR(10) NOT NULL,
    message         TEXT NOT NULL,
    details_json    JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scrape_logs_job ON scrape_logs (scrape_job_id);
CREATE INDEX IF NOT EXISTS idx_scrape_logs_time ON scrape_logs (created_at DESC);

-- =============================================
-- Utility Functions
-- =============================================

-- Haversine distance function (km)
CREATE OR REPLACE FUNCTION distance_km(lat1 float, lon1 float, lat2 float, lon2 float)
RETURNS float AS $$
    SELECT 6371 * sqrt(
        power(radians($3 - $1), 2) +
        power(radians($4 - $2) * cos(radians(($1 + $3) / 2)), 2)
    );
$$ LANGUAGE SQL IMMUTABLE;

-- Auto-update updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS trg_countries_updated_at ON countries;
CREATE TRIGGER trg_countries_updated_at BEFORE UPDATE ON countries FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_study_fields_updated_at ON study_fields;
CREATE TRIGGER trg_study_fields_updated_at BEFORE UPDATE ON study_fields FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_languages_updated_at ON languages;
CREATE TRIGGER trg_languages_updated_at BEFORE UPDATE ON languages FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_degree_types_updated_at ON degree_types;
CREATE TRIGGER trg_degree_types_updated_at BEFORE UPDATE ON degree_types FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_instruction_types_updated_at ON instruction_types;
CREATE TRIGGER trg_instruction_types_updated_at BEFORE UPDATE ON instruction_types FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_universities_updated_at ON universities;
CREATE TRIGGER trg_universities_updated_at BEFORE UPDATE ON universities FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_programs_updated_at ON programs;
CREATE TRIGGER trg_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_program_versions_updated_at ON program_versions;
CREATE TRIGGER trg_program_versions_updated_at BEFORE UPDATE ON program_versions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_admission_criteria_updated_at ON admission_criteria;
CREATE TRIGGER trg_admission_criteria_updated_at BEFORE UPDATE ON admission_criteria FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_program_costs_updated_at ON program_costs;
CREATE TRIGGER trg_program_costs_updated_at BEFORE UPDATE ON program_costs FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_students_updated_at ON students;
CREATE TRIGGER trg_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_scoring_weight_configs_updated_at ON scoring_weight_configs;
CREATE TRIGGER trg_scoring_weight_configs_updated_at BEFORE UPDATE ON scoring_weight_configs FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Trigger to auto-set is_current when new version is created
CREATE OR REPLACE FUNCTION set_program_current_version()
RETURNS TRIGGER AS $$
BEGIN
    -- If this new version is marked as current, unset previous current
    IF NEW.is_current = true THEN
        UPDATE program_versions
        SET is_current = false
        WHERE program_id = NEW.program_id
          AND id != NEW.id
          AND is_current = true;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_program_current_version ON program_versions;
CREATE TRIGGER trg_set_program_current_version
    AFTER INSERT OR UPDATE OF is_current ON program_versions
    FOR EACH ROW EXECUTE FUNCTION set_program_current_version();

-- =============================================
-- Row Level Security (RLS)
-- Note: Enable RLS after initial setup
-- =============================================

-- For now, we keep RLS disabled for easier development
-- To enable RLS, uncomment these and adjust to your auth setup:

-- ALTER TABLE students ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE program_matches ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE saved_programs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE scoring_weight_configs ENABLE ROW LEVEL SECURITY;

-- Students: users can only see/edit their own profile
-- CREATE POLICY "Users can view own student profile"
--     ON students FOR SELECT USING (auth.uid() = auth_user_id);
-- CREATE POLICY "Users can update own student profile"
--     ON students FOR UPDATE USING (auth.uid() = auth_user_id);

-- Matches: users can read their own
-- CREATE POLICY "Students can read own matches"
--     ON program_matches FOR SELECT USING (auth.uid() = student_id);

-- Saved programs: users can manage their own
-- CREATE POLICY "Students can manage own saved programs"
--     ON saved_programs FOR ALL USING (auth.uid() = student_id);

-- Universities & Programs: public read for active items
-- CREATE POLICY "Public read active universities"
--     ON universities FOR SELECT USING (is_active = true AND deleted_at IS NULL);
-- CREATE POLICY "Public read current program versions"
--     ON program_versions FOR SELECT USING (is_current = true);

-- =============================================
-- Seed Reference Data
-- =============================================

-- Countries
INSERT INTO countries (code, name, region) VALUES
    ('SVK', 'Slovakia', 'Central Europe'),
    ('CZE', 'Czech Republic', 'Central Europe'),
    ('AUT', 'Austria', 'Central Europe'),
    ('POL', 'Poland', 'Central Europe'),
    ('HUN', 'Hungary', 'Central Europe'),
    ('DEU', 'Germany', 'Western Europe'),
    ('NLD', 'Netherlands', 'Western Europe')
ON CONFLICT (code) DO NOTHING;

-- Languages
INSERT INTO languages (code, name, is_local) VALUES
    ('en', 'English', false),
    ('de', 'German', true),
    ('sk', 'Slovak', true),
    ('cs', 'Czech', true),
    ('pl', 'Polish', true),
    ('hu', 'Hungarian', true),
    ('nl', 'Dutch', true)
ON CONFLICT (code) DO NOTHING;

-- Degree types
INSERT INTO degree_types (slug, name, level) VALUES
    ('bachelor', 'Bachelor', 6),
    ('master', 'Master', 7)
ON CONFLICT (slug) DO NOTHING;

-- Instruction types
INSERT INTO instruction_types (slug, name, description) VALUES
    ('english', 'English Taught', 'Program taught entirely in English'),
    ('local', 'Local Language', 'Program taught in local language'),
    ('both', 'Mixed', 'Program available in both English and local language')
ON CONFLICT (slug) DO NOTHING;

-- Study fields
INSERT INTO study_fields (slug, name, keywords) VALUES
    ('computer-science', 'Computer Science', ARRAY['cs', 'computing', 'software', 'it', 'information', 'data']),
    ('engineering', 'Engineering', ARRAY['mechanical', 'electrical', 'civil', 'chemical', 'aerospace', 'automotive']),
    ('business', 'Business & Economics', ARRAY['management', 'economics', 'finance', 'marketing', 'accounting']),
    ('medicine', 'Medicine & Health', ARRAY['health', 'nursing', 'pharmacy', 'dentistry', 'biomedical']),
    ('physics', 'Physics', ARRAY['astrophysics', 'quantum', 'materials']),
    ('mathematics', 'Mathematics', ARRAY['stats', 'statistics', 'applied-math', 'financial-math']),
    ('chemistry', 'Chemistry', ARRAY['biochemistry', 'molecular', 'pharmaceutical']),
    ('biology', 'Biology', ARRAY['biotechnology', 'bioinformatics', 'ecology', 'genetics']),
    ('psychology', 'Psychology', ARRAY['psychology', 'counseling', 'social-work', 'cognitive', 'behavioral']),
    ('law', 'Law', ARRAY['legal', 'jurisprudence', 'international-law']),
    ('art', 'Art & Design', ARRAY['design', 'fine-arts', 'visual', 'music', 'theater'])
ON CONFLICT (slug) DO NOTHING;

-- Default scoring weights
INSERT INTO scoring_weight_configs (name, description, academic, location, language, budget, career, is_active) VALUES
    ('default', 'Default EuroUni weights', 0.25, 0.15, 0.20, 0.20, 0.20, true)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- Done!
-- =============================================
-- Now run the seed script: npx tsx scripts/seed-supabase.ts
-- Or manually seed using the Supabase dashboard
