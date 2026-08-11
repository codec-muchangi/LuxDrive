-- ============================================================
-- LUXDRIVE — Migration 003: Transactional Tables
-- bookings, payments, favorites, reviews
-- Run AFTER 002_core_tables.sql
-- ============================================================

-- ── bookings ──────────────────────────────────────────────────
-- Central transaction table. Price fields are SNAPSHOTS at booking time.
CREATE TABLE IF NOT EXISTS public.bookings (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference       TEXT NOT NULL UNIQUE,
  customer_id             UUID NOT NULL REFERENCES public.profiles(id),
  car_id                  UUID NOT NULL REFERENCES public.cars(id),
  pickup_location_id      UUID NOT NULL REFERENCES public.locations(id),
  return_location_id      UUID NOT NULL REFERENCES public.locations(id),
  pickup_date             TIMESTAMPTZ NOT NULL,
  return_date             TIMESTAMPTZ NOT NULL,
  rental_type             rental_type NOT NULL DEFAULT 'SELF_DRIVE',
  rental_days             INTEGER NOT NULL CHECK (rental_days > 0),

  -- Price snapshots (stored at booking time, never recalculated from current prices)
  daily_rate_snapshot     NUMERIC(12, 2) NOT NULL CHECK (daily_rate_snapshot >= 0),
  rental_subtotal         NUMERIC(12, 2) NOT NULL CHECK (rental_subtotal >= 0),
  services_total          NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (services_total >= 0),
  delivery_fee            NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  discount_amount         NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  tax_amount              NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount            NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  security_deposit        NUMERIC(12, 2) NOT NULL CHECK (security_deposit >= 0),
  currency                CHAR(3) NOT NULL DEFAULT 'KES',

  -- Status
  status                  booking_status NOT NULL DEFAULT 'PENDING',
  payment_status          payment_status NOT NULL DEFAULT 'PENDING',

  -- Optional fields
  delivery_address        TEXT,
  customer_notes          TEXT,
  admin_notes             TEXT,
  cancellation_reason     TEXT,

  -- Lifecycle timestamps
  confirmed_at            TIMESTAMPTZ,
  cancelled_at            TIMESTAMPTZ,
  completed_at            TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT bookings_dates_valid CHECK (return_date > pickup_date)
);

COMMENT ON TABLE public.bookings IS 'Customer vehicle bookings — all prices are point-in-time snapshots';
COMMENT ON COLUMN public.bookings.booking_reference IS 'Human-readable reference e.g. LD-2026-001024';
COMMENT ON COLUMN public.bookings.daily_rate_snapshot IS 'Rate at time of booking — protected from future price changes';

-- ── payments ──────────────────────────────────────────────────
-- Payment transaction records. Never deleted.
CREATE TABLE IF NOT EXISTS public.payments (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id               UUID NOT NULL REFERENCES public.bookings(id),
  customer_id              UUID NOT NULL REFERENCES public.profiles(id),
  payment_reference        TEXT NOT NULL UNIQUE,
  provider                 TEXT NOT NULL,               -- mpesa, stripe, etc.
  provider_transaction_id  TEXT UNIQUE,                 -- provider's reference
  payment_method           payment_method NOT NULL,
  amount                   NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  currency                 CHAR(3) NOT NULL DEFAULT 'KES',
  status                   payment_status NOT NULL DEFAULT 'PENDING',
  failure_reason           TEXT,
  metadata                 JSONB,                       -- provider-specific data
  initiated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at             TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.payments IS 'Payment transaction records — never deleted, financial history';

-- ── favorites ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  car_id      UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (customer_id, car_id)    -- Prevent duplicate favorites
);

COMMENT ON TABLE public.favorites IS 'Customer saved/favorited vehicles';

-- ── reviews ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID NOT NULL REFERENCES public.profiles(id),
  car_id        UUID NOT NULL REFERENCES public.cars(id),
  booking_id    UUID NOT NULL UNIQUE REFERENCES public.bookings(id), -- 1 review per booking
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment       TEXT,
  status        review_status NOT NULL DEFAULT 'PENDING',
  moderated_by  UUID REFERENCES public.profiles(id),
  moderated_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.reviews IS 'Customer vehicle reviews — only for completed bookings';

SELECT 'Migration 003 complete: bookings, payments, favorites, reviews created' AS result;
