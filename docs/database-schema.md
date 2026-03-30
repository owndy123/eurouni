# EuroUni Database Schema

**Version:** 1.0  
**Target:** PostgreSQL (Supabase-ready)  
**Last Updated:** 2026-03-30

---

## Overview

EuroUni requires a **temporal versioning strategy** so that every program update for a new academic year preserves historical data. The schema supports both manual JSON updates and automated scraping pipelines.

---

## Versioning Strategy

### Core Concept: Program ↔ ProgramVersion

- **`programs`** — the stable, canonical record for a real-world program (e.g., "Computer Science at STUBA"). It never changes after creation.
- **`program_versions`** — a snapshot for a specific academic year (e.g., "CS @ STUBA, AY 2025/26"). Every yearly update creates a **new version row**, preserving all prior data.

### How Yearly Updates Work

1. **Admin or scraper** triggers an update for a program for the new academic year (e.g., `2026/27`).
2. A **new row** is inserted into `program_versions` with `academic_year = '2026/27'`, `is_current = true`.
3. The previous version's `is_current` is set to `false` (or it just stays with its `effective_to` date).
4. All historical versions remain queryable for trend analysis, comparisons, and audit.
5. The **onboarding calculator** always queries `is_current = true` versions (or the latest effective version for a given date).

### Why This Approach?

| Approach | Pros | Cons |
|---|---|---|
| Effective date ranges | Native PostgreSQL temporal modeling | More complex queries |
| `is_current` flag | Simple, fast filtering | Needs care on transitions |
| Version-per-year (chosen) | Clean historical tracking, easy comparison queries | Slightly more rows, but negligible |

We use a **hybrid**: `is_current` boolean for the common case + `effective_from`/`effective_to` date range for precise temporal queries.

---

## DDL — Complete Schema

### 1. Reference / Lookup Tables

```sql
-- =============================================
-- Reference Tables
-- =============================================

CREATE TABLE countries (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(3) NOT NULL UNIQUE,           -- ISO 3166-1 alpha-3, e.g. 'SVK'
    name        VARCHAR(100) NOT NULL,                -- e.g. 'Slovakia'
    region      VARCHAR(50),                          -- e.g. 'Central Europe'
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE study_fields (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(100) NOT NULL UNIQUE,          -- e.g. 'computer-science'
    name        VARCHAR(100) NOT NULL,                 -- e.g. 'Computer Science'
    keywords    TEXT[],                                -- e.g. {'cs','computing','software','it'}
    parent_id   UUID REFERENCES study_fields(id),      -- hierarchical taxonomy
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Languages spoken/taught at programs
CREATE TABLE languages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(10) NOT NULL UNIQUE,           -- 'en', 'de', 'sk', 'pl', 'hu', 'cs', 'nl'
    name        VARCHAR(50) NOT NULL,                 -- 'English', 'German', 'Slovak'
    is_local    BOOLEAN NOT NULL DEFAULT false,        -- true for Slovak/Polish/Hungarian/etc.
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Supported degree types
CREATE TABLE degree_types (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(20) NOT NULL UNIQUE,           -- 'bachelor', 'master'
    name        VARCHAR(50) NOT NULL,                  -- 'Bachelor', 'Master'
    level       INTEGER NOT NULL,                       -- 6 (Bachelor), 7 (Master) — EQF level
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Program language instruction types (distinct from language itself)
CREATE TABLE instruction_types (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(20) NOT NULL UNIQUE,           -- 'english', 'local', 'both'
    name        VARCHAR(50) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- Universities
-- =============================================

CREATE TABLE universities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legacy_id       VARCHAR(50) UNIQUE,               -- e.g. 'stuba' — maps to existing mockData ids

    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    country_id      UUID NOT NULL REFERENCES countries(id),
    city            VARCHAR(100) NOT NULL,
    city_slug       VARCHAR(100) NOT NULL,

    -- Location
    latitude        DECIMAL(9,6) NOT NULL,
    longitude       DECIMAL(9,6) NOT NULL,

    -- Contact
    website         VARCHAR(255),
    logo_url        VARCHAR(500),

    -- Ranking (QS or equivalent — nullable, updated periodically)
    qs_rank         INTEGER,
    ranking_year    INTEGER,

    -- Metadata
    is_active       BOOLEAN NOT NULL DEFAULT true,
    deleted_at      TIMESTAMPTZ,                       -- soft delete

    created_by      UUID,                               -- references auth.users (Supabase)
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for distance queries (see Section 4)
CREATE INDEX idx_universities_coords ON universities (latitude, longitude);
CREATE INDEX idx_universities_country ON universities (country_id);
CREATE INDEX idx_universities_active  ON universities (is_active) WHERE is_active = true;

-- =============================================
-- Programs & Versions (Temporal)
-- =============================================

-- Stable program record — the "thing" that exists across years
CREATE TABLE programs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legacy_id       VARCHAR(50) UNIQUE,               -- e.g. 'stuba-cs'

    university_id   UUID NOT NULL REFERENCES universities(id),

    -- Canonical name (can be updated, not versioned separately)
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL,

    -- Taxonomies
    field_id        UUID NOT NULL REFERENCES study_fields(id),
    degree_type_id  UUID NOT NULL REFERENCES degree_types(id),
    instruction_type_id UUID NOT NULL REFERENCES instruction_types(id),

    -- The primary language of instruction
    primary_language_id UUID NOT NULL REFERENCES languages(id),

    -- Short description
    description     TEXT,

    -- Metadata
    is_active       BOOLEAN NOT NULL DEFAULT true,
    deleted_at      TIMESTAMPTZ,

    created_by      UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (university_id, slug)   -- one slug per university
);

CREATE INDEX idx_programs_university ON programs (university_id);
CREATE INDEX idx_programs_field     ON programs (field_id);
CREATE INDEX idx_programs_active     ON programs (is_active) WHERE is_active = true;

-- =============================================
-- Program Versions (Yearly Snapshots)
-- =============================================

CREATE TABLE program_versions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id      UUID NOT NULL REFERENCES programs(id),

    -- Academic year this version describes (e.g. '2025/26', '2026/27')
    academic_year   VARCHAR(9) NOT NULL,              -- format: 'YYYY/YY'

    -- Effective date range for temporal queries
    effective_from  DATE NOT NULL,
    effective_to    DATE,                             -- NULL = current/published

    -- Is this the currently active/published version?
    -- There should be exactly ONE current version per program at any time
    is_current      BOOLEAN NOT NULL DEFAULT false,

    -- Core academic data
    ects            INTEGER NOT NULL,                  -- total ECTS credits
    duration_months INTEGER NOT NULL,                  -- program duration in months

    -- Tuition (EUR, per year unless noted)
    tuition_eur     INTEGER NOT NULL DEFAULT 0,        -- 0 = free
    tuition_note    VARCHAR(255),                     -- e.g. 'per semester', 'EU students'

    -- Living cost estimate (monthly EUR)
    living_cost_eur INTEGER,

    -- Detailed description for this version
    description     TEXT,

    -- URL to official program page (for this version)
    official_url    VARCHAR(500),

    -- Data source
    data_source     VARCHAR(20) NOT NULL DEFAULT 'manual',
                                            -- 'manual' | 'scraper' | 'api'

    -- Scraping metadata (if applicable)
    scraped_at      TIMESTAMPTZ,
    scrape_url      VARCHAR(500),
    scrape_hash     VARCHAR(64),              -- SHA-256 of scraped content for change detection

    -- Metadata
    created_by      UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (program_id, academic_year)
);

CREATE INDEX idx_pv_program_current ON program_versions (program_id, is_current) WHERE is_current = true;
CREATE INDEX idx_pv_effective      ON program_versions (program_id, effective_from, effective_to);
CREATE INDEX idx_pv_academic_year ON program_versions (academic_year);

-- =============================================
-- Admission Criteria (Versioned)
-- =============================================

CREATE TABLE admission_criteria (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_version_id UUID NOT NULL REFERENCES program_versions(id) ON DELETE CASCADE,

    -- Requirement type
    requirement_type VARCHAR(50) NOT NULL,
        -- 'gpa_min' | 'language_cert' | 'entrance_exam' |
        -- 'subject_bonus' | 'portfolio' | 'interview' | 'other'

    -- The requirement itself
    label           VARCHAR(255) NOT NULL,           -- human-readable: 'Mathematics proficiency'
    criteria_json   JSONB NOT NULL DEFAULT '{}',
        -- e.g. {"value": "B2", "equivalents": ["IELTS 5.5", "TOEFL 72"]}
        -- e.g. {"min_gpa": 2.0, "scale": 4.0}
        -- e.g. {"exam": "Math & Physics", "min_score": 60}

    -- Is this a hard requirement (must have) or preferred?
    is_hard         BOOLEAN NOT NULL DEFAULT true,
    priority        INTEGER NOT NULL DEFAULT 0,       -- lower = more important

    created_by      UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admission_version ON admission_criteria (program_version_id);
CREATE INDEX idx_admission_type   ON admission_criteria (requirement_type);

-- =============================================
-- Tuition & Cost History (Versioned)
-- =============================================

-- Separate table for granular cost tracking and auditing
CREATE TABLE program_costs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_version_id  UUID NOT NULL REFERENCES program_versions(id) ON DELETE CASCADE,

    -- Cost category
    cost_category       VARCHAR(30) NOT NULL,
        -- 'tuition' | 'tuition_eu' | 'tuition_non_eu' | 'registration' |
        -- 'living_per_month' | 'living_per_year' | 'accommodation' | 'insurance'

    amount_eur           INTEGER NOT NULL,
    currency             VARCHAR(3) NOT NULL DEFAULT 'EUR',

    -- Effective period
    effective_from       DATE NOT NULL,
    effective_to         DATE,

    -- Notes
    note                 VARCHAR(255),

    created_by           UUID,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_costs_version ON program_costs (program_version_id);
CREATE INDEX idx_costs_category ON program_costs (cost_category);

-- =============================================
-- Program Language Variants
-- =============================================

-- A program version may be taught in multiple languages
CREATE TABLE program_version_languages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_version_id  UUID NOT NULL REFERENCES program_versions(id) ON DELETE CASCADE,
    language_id         UUID NOT NULL REFERENCES languages(id),

    -- Percentage of instruction in this language (must sum to 100 across the rowset)
    instruction_pct     INTEGER NOT NULL CHECK (instruction_pct >= 0 AND instruction_pct <= 100),

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (program_version_id, language_id)
);

-- =============================================
-- Student Profiles (for future match engine)
-- =============================================

CREATE TABLE students (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id    UUID NOT NULL UNIQUE,             -- Supabase auth.users.id

    -- Academic profile
    gpa             DECIMAL(5,2),                      -- 0.00 - 100.00
    math_level      INTEGER CHECK (math_level >= 0 AND math_level <= 100),
    science_level   INTEGER CHECK (science_level >= 0 AND science_level <= 100),

    -- Location
    home_city       VARCHAR(100),
    home_latitude   DECIMAL(9,6),
    home_longitude  DECIMAL(9,6),
    preferred_city_size INTEGER CHECK (preferred_city_size >= 0 AND preferred_city_size <= 100),
    distance_max_km INTEGER DEFAULT 500,

    -- Language
    english_level   INTEGER CHECK (english_level >= 0 AND english_level <= 100),
    willing_learn_local INTEGER CHECK (willing_learn_local >= 0 AND willing_learn_local <= 100),

    -- Budget (monthly EUR)
    monthly_budget  INTEGER DEFAULT 1000,

    -- Career
    career_focus    INTEGER CHECK (career_focus >= 0 AND career_focus <= 100),
    field_of_study_id UUID REFERENCES study_fields(id),

    -- Preferences
    preferred_countries  UUID[],
    preferred_degree_types UUID[],
    preferred_instruction_types UUID[],

    -- Onboarding completed?
    onboarding_complete BOOLEAN NOT NULL DEFAULT false,
    onboarding_completed_at TIMESTAMPTZ,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_students_auth   ON students (auth_user_id);
CREATE INDEX idx_students_field  ON students (field_of_study_id);

-- =============================================
-- Saved & Matched Programs
-- =============================================

CREATE TABLE saved_programs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES students(id),
    program_id      UUID NOT NULL REFERENCES programs(id),
    note            TEXT,
    saved_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (student_id, program_id)
);

-- Match results: output of the calculator for a student
CREATE TABLE program_matches (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES students(id),

    program_version_id UUID NOT NULL REFERENCES program_versions(id),
    university_id   UUID NOT NULL REFERENCES universities(id),

    -- The calculated score (0-100)
    score           DECIMAL(5,2) NOT NULL,

    -- Score breakdown
    breakdown_json  JSONB NOT NULL DEFAULT '{}',
        -- {"academic": 75, "location": 60, "language": 80, "budget": 90, "career": 70}

    -- Distance (km) if calculated
    distance_km     DECIMAL(10,2),

    -- Weights used for this calculation
    weights_json    JSONB NOT NULL DEFAULT '{}',
        -- {"academic": 0.25, "location": 0.15, "language": 0.20, "budget": 0.20, "career": 0.20}

    -- Match level label
    match_label     VARCHAR(30),                       -- 'Excellent Match' | 'Good Match' | etc.

    -- Which search/recalculation produced this?
    search_session_id UUID,                            -- for grouping recalculations

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_matches_student   ON program_matches (student_id);
CREATE INDEX idx_matches_version   ON program_matches (program_version_id);
CREATE INDEX idx_matches_score     ON program_matches (student_id, score DESC);
CREATE INDEX idx_matches_session   ON program_matches (student_id, search_session_id);

-- =============================================
-- Scoring Weights Configuration
-- =============================================

-- Global default weights (also stored in app config)
CREATE TABLE scoring_weight_configs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(50) NOT NULL DEFAULT 'default',
    description     TEXT,

    -- Weights (must sum to 1.0 — application layer should validate)
    academic        DECIMAL(4,3) NOT NULL DEFAULT 0.25,
    location        DECIMAL(4,3) NOT NULL DEFAULT 0.15,
    language        DECIMAL(4,3) NOT NULL DEFAULT 0.20,
    budget          DECIMAL(4,3) NOT NULL DEFAULT 0.20,
    career          DECIMAL(4,3) NOT NULL DEFAULT 0.20,

    -- If true, this is the active global config
    is_active       BOOLEAN NOT NULL DEFAULT false,

    -- Optional: per-student weight overrides
    student_id      UUID REFERENCES students(id),     -- NULL = global

    created_by      UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (name),
    UNIQUE (student_id)  -- one config per student if student_id is set
);

-- =============================================
-- Data Change Log (Audit Trail)
-- =============================================

CREATE TABLE data_change_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- What entity changed?
    entity_type      VARCHAR(50) NOT NULL,             -- 'program_version' | 'program_cost' | etc.
    entity_id        UUID NOT NULL,

    -- Who/why
    changed_by      UUID,
    change_source   VARCHAR(20) NOT NULL DEFAULT 'manual', -- 'manual' | 'scraper' | 'api'
    change_reason   TEXT,

    -- What changed (JSON diff)
    change_json     JSONB NOT NULL,                    -- {"op": "update", "field": "tuition_eur", "old": 0, "new": 500}

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_change_log_entity ON data_change_log (entity_type, entity_id);
CREATE INDEX idx_change_log_time   ON data_change_log (created_at DESC);

-- =============================================
-- Scraping Pipeline Metadata
-- =============================================

CREATE TABLE scrape_jobs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',
        -- 'pending' | 'running' | 'completed' | 'failed'

    scraper_name    VARCHAR(100) NOT NULL,
    target_url      VARCHAR(500),

    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    error_message   TEXT,

    -- Results summary
    programs_updated  INTEGER DEFAULT 0,
    programs_created  INTEGER DEFAULT 0,
    programs_failed   INTEGER DEFAULT 0,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE scrape_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scrape_job_id   UUID REFERENCES scrape_jobs(id),

    university_id   UUID REFERENCES universities(id),
    program_id      UUID REFERENCES programs(id),

    level           VARCHAR(10) NOT NULL,             -- 'info' | 'warn' | 'error'
    message         TEXT NOT NULL,
    details_json    JSONB,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scrape_logs_job  ON scrape_logs (scrape_job_id);
CREATE INDEX idx_scrape_logs_time  ON scrape_logs (created_at DESC);

-- =============================================
-- Trigger: Auto-update updated_at
-- =============================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trg_countries_updated_at          BEFORE UPDATE ON countries                  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_study_fields_updated_at       BEFORE UPDATE ON study_fields               FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_languages_updated_at          BEFORE UPDATE ON languages                  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_degree_types_updated_at        BEFORE UPDATE ON degree_types               FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_instruction_types_updated_at   BEFORE UPDATE ON instruction_types          FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_universities_updated_at        BEFORE UPDATE ON universities              FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_programs_updated_at            BEFORE UPDATE ON programs                  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_program_versions_updated_at    BEFORE UPDATE ON program_versions          FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_admission_criteria_updated_at  BEFORE UPDATE ON admission_criteria        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_program_costs_updated_at       BEFORE UPDATE ON program_costs              FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_students_updated_at            BEFORE UPDATE ON students                  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_scoring_weight_configs_updated_at BEFORE UPDATE ON scoring_weight_configs  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

---

## Indexes for Performance

### Distance Queries (Haversine / PostGIS)

```sql
-- Fast radius search using bounding box + approximate distance
-- For ~50 universities this is fine with seq scan; for 500+ consider PostGIS:

CREATE OR REPLACE FUNCTION distance_km(lat1 float, lon1 float, lat2 float, lon2 float)
RETURNS float AS $$
    SELECT 6371 * sqrt(
        power(radians($3 - $1), 2) +
        power(radians($4 - $2) * cos(radians(($1 + $3) / 2)), 2)
    );
$$ LANGUAGE SQL IMMUTABLE;

-- Example: Find all universities within 200km of Bratislava
-- Uses bounding box pre-filter for speed:
SELECT id, name, city,
       distance_km(48.1486, 17.1077, latitude, longitude) AS dist_km
FROM universities
WHERE is_active = true
  AND latitude  BETWEEN 48.1486 - 2.0 AND 48.1486 + 2.0   -- ~±2° = ~220km
  AND longitude BETWEEN 17.1077 - 3.0 AND 17.1077 + 3.0
HAVING distance_km(48.1486, 17.1077, latitude, longitude) <= 200
ORDER BY dist_km;
```

### Other Important Indexes

```sql
-- Fast current-version lookup for calculator
CREATE INDEX idx_pv_current ON program_versions (program_id, is_current)
    WHERE is_current = true;

-- Admission criteria lookup
CREATE INDEX idx_admission_version ON admission_criteria (program_version_id);

-- Student match lookup (top matches per student)
CREATE INDEX idx_matches_top ON program_matches (student_id, score DESC);

-- Soft-delete filter
CREATE INDEX idx_programs_active ON programs (is_active) WHERE is_active = true;
CREATE INDEX idx_universities_active ON universities (is_active) WHERE is_active = true;
```

---

## Row Level Security (RLS) Notes

Supabase auth integrates with PostgreSQL RLS. Below are the recommended policies:

### Students Table
```sql
-- Students can only see/edit their own profile
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own student profile"
    ON students FOR SELECT
    USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own student profile"
    ON students FOR UPDATE
    USING (auth.uid() = auth_user_id);
```

### Program Matches (Read-only for students)
```sql
-- Students can read their own matches
CREATE POLICY "Students can read own matches"
    ON program_matches FOR SELECT
    USING (auth.uid() = student_id);

-- Only service/admin can insert matches (calculator service account)
CREATE POLICY "Service can insert matches"
    ON program_matches FOR INSERT
    WITH CHECK (true);  -- service role check in application
```

### Saved Programs
```sql
-- Students can only see their own saved programs
CREATE POLICY "Students can manage own saved programs"
    ON saved_programs FOR ALL
    USING (auth.uid() = student_id);
```

### Universities & Programs (Public Read)
```sql
-- Everyone can read active programs and universities
CREATE POLICY "Public read active universities"
    ON universities FOR SELECT
    USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY "Public read current program versions"
    ON program_versions FOR SELECT
    USING (is_current = true);
```

### Scoring Config (Admin Only)
```sql
-- Only admin/service role can modify weights
CREATE POLICY "Admin can manage scoring configs"
    ON scoring_weight_configs FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');
```

---

## Onboarding Calculator Query Example

The onboarding calculator (`/app/onboarding/page.tsx`) takes a `StudentProfile` and returns ranked programs. Here is the equivalent SQL query for the **current** version of the calculator (simplified for clarity):

```sql
-- =============================================
-- Onboarding Calculator: Find matching programs
-- Parameters (from student profile):
--   p_gpa              = 75
--   p_math_level       = 70
--   p_science_level    = 65
--   p_home_lat         = 48.1486  (Bratislava)
--   p_home_lng         = 17.1077
--   p_distance_max_km  = 500
--   p_english_level    = 80
--   p_willing_local    = 50
--   p_monthly_budget   = 1000
--   p_career_focus     = 60
--   p_field_slug       = 'computer-science'
--   p_city_size_pref   = 70
--
-- Weights:
--   academic=0.25, location=0.15, language=0.20, budget=0.20, career=0.20
-- =============================================

WITH student_params AS (
    SELECT
        75.0                         AS p_gpa,
        70.0                         AS p_math_level,
        65.0                         AS p_science_level,
        48.1486                      AS p_home_lat,
        17.1077                      AS p_home_lng,
        500                          AS p_distance_max_km,
        80.0                         AS p_english_level,
        50.0                         AS p_willing_local,
        1000                         AS p_monthly_budget,
        60.0                         AS p_career_focus,
        'computer-science'            AS p_field_slug,
        70.0                         AS p_city_size_pref,
        0.25                         AS w_academic,
        0.15                         AS w_location,
        0.20                         AS w_language,
        0.20                         AS w_budget,
        0.20                         AS w_career
),

-- Get current program versions with university data
current_programs AS (
    SELECT
        pv.id                  AS program_version_id,
        p.id                   AS program_id,
        p.name                 AS program_name,
        u.id                   AS university_id,
        u.name                 AS university_name,
        u.city,
        u.country_id,
        c.name                 AS country_name,
        u.latitude,
        u.longitude,
        it.slug                AS instruction_type,
        l.code                 AS language_code,
        dt.slug                AS degree_type,
        sf.slug                AS field_slug,
        pv.ects,
        pv.duration_months,
        pv.tuition_eur,
        pv.living_cost_eur,
        pv.description,

        -- Distance from student home
        distance_km(
            sp.p_home_lat, sp.p_home_lng,
            u.latitude, u.longitude
        ) AS dist_km

    FROM student_params sp
    CROSS JOIN program_versions pv
    JOIN programs p          ON p.id = pv.program_id
    JOIN universities u      ON u.id = p.university_id
    JOIN countries c         ON c.id = u.country_id
    JOIN study_fields sf    ON sf.id = p.field_id
    JOIN degree_types dt    ON dt.id = p.degree_type_id
    JOIN instruction_types it ON it.id = p.instruction_type_id
    JOIN program_version_languages pvl ON pvl.program_version_id = pv.id
    JOIN languages l        ON l.id = pvl.language_id

    WHERE pv.is_current = true
      AND p.is_active = true
      AND u.is_active = true
      AND pvl.instruction_pct >= 50  -- primary language only
),

-- Score each program
scored_programs AS (
    SELECT
        cp.*,

        -- Academic score: average of gpa, math, science
        (cp.p_gpa + cp.p_math_level + cp.p_science_level) / 3.0 AS academic_score,

        -- Location score: based on city size preference
        CASE
            WHEN cp.city ILIKE '%metropolis%' OR cp.city IN (
                'Berlin','Munich','Vienna','Warsaw','Prague','Amsterdam',
                'Hamburg','Frankfurt','Budapest','Krakow','Wroclaw'
            )
            THEN 100 - LEAST(ABS(cp.p_city_size_pref - 95), 100)
            WHEN cp.city IN (
                'Brno','Graz','Linz','Innsbruck','Salzburg','Poznan',
                'Gdansk','Bremen','Cologne','Leipzig','Essen'
            )
            THEN 100 - LEAST(ABS(cp.p_city_size_pref - 55), 100)
            ELSE 100 - LEAST(ABS(cp.p_city_size_pref - 30), 100)
        END AS location_score,

        -- Language score
        CASE cp.instruction_type
            WHEN 'english' THEN cp.p_english_level
            WHEN 'local'   THEN cp.p_willing_local
            WHEN 'both'    THEN GREATEST(cp.p_english_level, cp.p_willing_local * 0.7)
            ELSE 50
        END AS language_score,

        -- Budget score
        CASE
            WHEN cp.tuition_eur = 0 THEN 100
            WHEN cp.tuition_eur / 12.0 <= cp.p_monthly_budget THEN 75
            ELSE GREATEST(0, (cp.p_monthly_budget * 12.0 / cp.tuition_eur) * 50)
        END AS budget_score,

        -- Career score: field match
        CASE
            WHEN cp.field_slug = cp.p_field_slug THEN 100
            WHEN cp.field_slug = 'engineering' AND cp.p_field_slug = 'computer-science' THEN 40
            WHEN cp.field_slug = 'business' AND cp.p_field_slug = 'computer-science' THEN 30
            ELSE 10
        END AS career_score,

        -- Ranking score (simplified — join to ranking table separately)
        50 AS ranking_score

    FROM current_programs cp
),

final_scores AS (
    SELECT
        sp.*,

        -- Apply weights
        (sp.academic_score  * sp.w_academic +
         sp.location_score  * sp.w_location +
         sp.language_score  * sp.w_language +
         sp.budget_score    * sp.w_budget +
         sp.career_score    * sp.w_career) AS total_score,

        -- Distance penalty (applied last, 15% weight)
        CASE
            WHEN sp.dist_km IS NULL THEN sp.total_score
            WHEN sp.dist_km > sp.p_distance_max_km THEN NULL  -- filter out
            ELSE sp.total_score * 0.85 +
                 (100 - sp.dist_km / sp.p_distance_max_km * 100) * 0.15
        END AS final_score

    FROM scored_programs sp
)

SELECT
    program_version_id,
    program_name,
    university_name,
    city,
    country_name,
    instruction_type  AS language,
    ects,
    duration_months,
    tuition_eur,
    living_cost_eur,
    dist_km,
    ROUND(academic_score, 1)  AS academic,
    ROUND(location_score, 1)  AS location,
    ROUND(language_score, 1)  AS language,
    ROUND(budget_score, 1)    AS budget,
    ROUND(career_score, 1)    AS career,
    ROUND(final_score, 1)    AS score,
    CASE
        WHEN final_score >= 80 THEN 'Excellent Match'
        WHEN final_score >= 60 THEN 'Good Match'
        WHEN final_score >= 40 THEN 'Moderate Match'
        ELSE 'Low Match'
    END AS match_label

FROM final_scores
WHERE final_score IS NOT NULL
ORDER BY score DESC
LIMIT 20;
```

### PostGIS Alternative (For Large-Scale Deployment)

If the university count grows beyond ~500, replace the bounding-box filter with PostGIS for proper geographic queries:

```sql
-- Requires PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geography column
ALTER TABLE universities ADD COLUMN geog geography(POINT, 4326);

-- Create spatial index
CREATE INDEX idx_universities_geog ON universities USING GIST (geog);

-- Then in queries:
SELECT id, name,
       ST_Distance(geog, ST_MakePoint(17.1077, 48.1486)::geography) / 1000 AS dist_km
FROM universities
WHERE ST_DWithin(
    geog,
    ST_MakePoint(17.1077, 48.1486)::geography,
    500000  -- 500km in meters
)
ORDER BY dist_km;
```

---

## Field Mapping: TypeScript Interfaces → PostgreSQL

| TypeScript Interface Field | PostgreSQL Table.Column |
|---|---|
| `University.id` | `universities.legacy_id` (or `universities.id`) |
| `University.name` | `universities.name` |
| `University.country` | `countries.name` |
| `University.city` | `universities.city` |
| `University.coordinates.lat` | `universities.latitude` |
| `University.coordinates.lng` | `universities.longitude` |
| `University.logo` | `universities.logo_url` |
| `University.website` | `universities.website` |
| `Program.id` | `programs.legacy_id` |
| `Program.universityId` | `programs.university_id → universities.id` |
| `Program.name` | `programs.name` |
| `Program.degree` | `degree_types.slug` ('bachelor'/'master') |
| `Program.language` | `instruction_types.slug` + `languages.code` |
| `Program.ects` | `program_versions.ects` |
| `Program.durationMonths` | `program_versions.duration_months` |
| `Program.tuitionEur` | `program_versions.tuition_eur` |
| `Program.description` | `program_versions.description` |
| `Program.entryRequirements` | `admission_criteria` (one row per requirement) |
| `Program.field` | `study_fields.slug` |
| `Program.lastUpdated` | `program_versions.created_at` |
| `StudentProfile.gpa` | `students.gpa` |
| `StudentProfile.mathLevel` | `students.math_level` |
| `StudentProfile.scienceLevel` | `students.science_level` |
| `StudentProfile.preferredCitySize` | `students.preferred_city_size` |
| `StudentProfile.distanceMax` | `students.distance_max_km` |
| `StudentProfile.homeLocation` | `students.home_latitude`, `students.home_longitude` |
| `StudentProfile.englishLevel` | `students.english_level` |
| `StudentProfile.willingToLearnLocal` | `students.willing_learn_local` |
| `StudentProfile.monthlyBudget` | `students.monthly_budget` |
| `StudentProfile.careerFocus` | `students.career_focus` |
| `WeightConfig` | `scoring_weight_configs` row |

---

## Migration Notes

1. **Seed data first**: Load `countries`, `languages`, `degree_types`, `instruction_types`, `study_fields` before anything else.
2. **Legacy IDs**: The `legacy_id` columns on `universities` and `programs` map directly to existing `mockData.ts` IDs (e.g., `'stuba'`, `'stuba-cs'`) — use these during the initial migration from mock data to preserve URLs.
3. **Initial version creation**: When migrating, create one `program_version` per program with `academic_year = '2025/26'` (or current year) and `is_current = true`.
4. **Scraping pipeline**: The `scrape_jobs` and `scrape_logs` tables are ready for the automated scraping pipeline to log its activity.
5. **Supabase auth**: Replace `UUID` references to `auth.users` with your Supabase `auth.users` table join once the auth system is configured.
