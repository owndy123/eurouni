# EuroUni

European university discovery platform — helping high school graduates find their perfect program.

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS 4** + shadcn/ui
- **Supabase** (PostgreSQL) — 434 programs in DB
- **Framer Motion** for animations
- **Leaflet** for distance maps

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, stats, university preview |
| `/programs` | Browse & filter all 306 programs |
| `/universities` | 62 universities across 7 countries |
| `/onboarding` | 5-step student matching wizard |
| `/about` | About the project |
| `/admin` | Data management (password: `admin123` or env var) |

## Data

- `data/programs.json` — 306 programs (JSON source of truth)
- Supabase — 434 programs synced from JSON + scrapers

## Countries Covered

Austria · Czech Republic · Germany · Hungary · Netherlands · Poland · Slovakia

## Scripts

```bash
npm run dev          # Development
npm run build        # Production build
node scripts/sync-supabase.js  # Sync programs → Supabase
node scripts/run-etl.js        # Run country scrapers
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://akaquwmabalzuazewheu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # For sync scripts
NEXT_PUBLIC_ADMIN_PASSWORD=...  # Admin panel access
```
