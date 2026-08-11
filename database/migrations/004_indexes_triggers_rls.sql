-- ============================================================
-- LUXDRIVE — Migration 004: Indexes, Triggers & RLS
-- Run AFTER 003_transactional_tables.sql
-- ============================================================

-- ── Auto-update updated_at trigger function ───────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all mutable tables
CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER cars_updated_at
  BEFORE UPDATE ON public.cars
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── Auto-create profile on new auth user ─────────────────────
-- This trigger fires when a new user registers via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role, account_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'LUXDRIVE Customer'),
    'CUSTOMER',
    'ACTIVE'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Indexes ───────────────────────────────────────────────────

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id     ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role         ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status       ON public.profiles(account_status);

-- cars
CREATE INDEX IF NOT EXISTS idx_cars_status           ON public.cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_brand            ON public.cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_category         ON public.cars(category);
CREATE INDEX IF NOT EXISTS idx_cars_location_id      ON public.cars(location_id);
CREATE INDEX IF NOT EXISTS idx_cars_featured         ON public.cars(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_cars_daily_rate       ON public.cars(daily_rate);

-- car_images
CREATE INDEX IF NOT EXISTS idx_car_images_car_id     ON public.car_images(car_id);
CREATE INDEX IF NOT EXISTS idx_car_images_primary    ON public.car_images(car_id, is_primary) WHERE is_primary = TRUE;

-- bookings
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id      ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id           ON public.bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status           ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status   ON public.bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_date      ON public.bookings(pickup_date);
CREATE INDEX IF NOT EXISTS idx_bookings_return_date      ON public.bookings(return_date);
CREATE INDEX IF NOT EXISTS idx_bookings_reference        ON public.bookings(booking_reference);
-- Composite: availability lookups (most common query)
CREATE INDEX IF NOT EXISTS idx_bookings_availability
  ON public.bookings(car_id, status, pickup_date, return_date);

-- payments
CREATE INDEX IF NOT EXISTS idx_payments_booking_id       ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id      ON public.payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_status           ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_provider_txn     ON public.payments(provider_transaction_id);

-- favorites
CREATE INDEX IF NOT EXISTS idx_favorites_customer_id     ON public.favorites(customer_id);
CREATE INDEX IF NOT EXISTS idx_favorites_car_id          ON public.favorites(car_id);

-- reviews
CREATE INDEX IF NOT EXISTS idx_reviews_car_id            ON public.reviews(car_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id       ON public.reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status            ON public.reviews(status);

-- ── Row Level Security ────────────────────────────────────────
-- Enable RLS on all sensitive tables
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews           ENABLE ROW LEVEL SECURITY;

-- Public tables (read-only for all, write via FastAPI only)
ALTER TABLE public.locations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_images        ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies: cars (public read) ─────────────────────────
CREATE POLICY "Cars are publicly readable"
  ON public.cars FOR SELECT
  USING (TRUE);

CREATE POLICY "Car images are publicly readable"
  ON public.car_images FOR SELECT
  USING (TRUE);

CREATE POLICY "Locations are publicly readable"
  ON public.locations FOR SELECT
  USING (is_active = TRUE);

-- ── RLS Policies: profiles ─────────────────────────────────
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── RLS Policies: bookings ────────────────────────────────────
CREATE POLICY "Customers can read own bookings"
  ON public.bookings FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (
    customer_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- ── RLS Policies: payments ────────────────────────────────────
CREATE POLICY "Customers can read own payments"
  ON public.payments FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- ── RLS Policies: favorites ───────────────────────────────────
CREATE POLICY "Customers can manage own favorites"
  ON public.favorites FOR ALL
  USING (
    customer_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- ── RLS Policies: reviews ─────────────────────────────────────
CREATE POLICY "Approved reviews are publicly readable"
  ON public.reviews FOR SELECT
  USING (status = 'APPROVED');

CREATE POLICY "Customers can read own reviews"
  ON public.reviews FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create reviews for completed bookings"
  ON public.reviews FOR INSERT
  WITH CHECK (
    customer_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
    AND
    booking_id IN (
      SELECT id FROM public.bookings
      WHERE status = 'COMPLETED'
      AND customer_id IN (
        SELECT id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  );

SELECT 'Migration 004 complete: Indexes, triggers, and RLS policies applied' AS result;
