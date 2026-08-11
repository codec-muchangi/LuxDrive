-- ============================================================
-- LUXDRIVE — Migration 002: Core Tables (profiles, locations, cars)
-- Run AFTER 001_enums.sql
-- ============================================================

-- ── profiles ──────────────────────────────────────────────────
-- Extends Supabase auth.users with LUXDRIVE application data.
-- 1-to-1 relationship: one profile per auth user.
CREATE TABLE IF NOT EXISTS public.profiles (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name                   TEXT NOT NULL,
  phone                       TEXT,
  avatar_url                  TEXT,
  role                        user_role NOT NULL DEFAULT 'CUSTOMER',
  account_status              account_status NOT NULL DEFAULT 'ACTIVE',
  terms_accepted_at           TIMESTAMPTZ,
  privacy_policy_accepted_at  TIMESTAMPTZ,
  terms_version               TEXT,
  privacy_version             TEXT,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'LUXDRIVE user profiles — extends auth.users';
COMMENT ON COLUMN public.profiles.user_id IS 'References Supabase auth.users.id';
COMMENT ON COLUMN public.profiles.role IS 'Application role: CUSTOMER or ADMIN';

-- ── locations ─────────────────────────────────────────────────
-- Pickup and return locations for vehicles.
CREATE TABLE IF NOT EXISTS public.locations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  address             TEXT NOT NULL,
  city                TEXT NOT NULL,
  county              TEXT,
  country             TEXT NOT NULL DEFAULT 'Kenya',
  latitude            NUMERIC(10, 7),
  longitude           NUMERIC(10, 7),
  phone               TEXT,
  operating_hours     JSONB,
  delivery_available  BOOLEAN NOT NULL DEFAULT FALSE,
  delivery_fee        NUMERIC(12, 2) DEFAULT 0,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.locations IS 'Vehicle pickup and delivery locations';

-- ── cars ──────────────────────────────────────────────────────
-- The main vehicle inventory table.
CREATE TABLE IF NOT EXISTS public.cars (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand                 TEXT NOT NULL,
  model                 TEXT NOT NULL,
  year                  INTEGER NOT NULL CHECK (year >= 1990 AND year <= 2030),
  category              car_category NOT NULL,
  description           TEXT,
  daily_rate            NUMERIC(12, 2) NOT NULL CHECK (daily_rate >= 0),
  chauffeur_daily_rate  NUMERIC(12, 2) CHECK (chauffeur_daily_rate >= 0),
  security_deposit      NUMERIC(12, 2) NOT NULL CHECK (security_deposit >= 0),
  transmission          transmission_type NOT NULL,
  fuel_type             fuel_type NOT NULL,
  engine                TEXT,
  horsepower            INTEGER CHECK (horsepower > 0),
  seats                 INTEGER NOT NULL CHECK (seats > 0),
  doors                 INTEGER CHECK (doors > 0),
  drive_type            TEXT,   -- AWD, RWD, FWD
  color                 TEXT,
  mileage               INTEGER CHECK (mileage >= 0),
  license_plate         TEXT UNIQUE,
  location_id           UUID REFERENCES public.locations(id),
  status                vehicle_status NOT NULL DEFAULT 'AVAILABLE',
  featured              BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.cars IS 'Luxury vehicle inventory';
COMMENT ON COLUMN public.cars.daily_rate IS 'Self-drive daily rental rate in KES';
COMMENT ON COLUMN public.cars.chauffeur_daily_rate IS 'Chauffeur service daily rate in KES';
COMMENT ON COLUMN public.cars.security_deposit IS 'Refundable security deposit in KES';

-- ── car_images ────────────────────────────────────────────────
-- Stores metadata for vehicle images.
-- Actual image files are stored in Supabase Storage.
CREATE TABLE IF NOT EXISTS public.car_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id        UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  storage_path  TEXT NOT NULL,
  public_url    TEXT,
  alt_text      TEXT,
  image_type    image_type NOT NULL DEFAULT 'EXTERIOR',
  is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.car_images IS 'Vehicle image metadata — files stored in Supabase Storage';

SELECT 'Migration 002 complete: profiles, locations, cars, car_images created' AS result;
