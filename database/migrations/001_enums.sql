-- ============================================================
-- LUXDRIVE — Migration 001: Enumerations
-- Run this FIRST in your Supabase SQL Editor
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── User Role ─────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Account Status ────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE account_status AS ENUM ('ACTIVE', 'SUSPENDED', 'DISABLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Vehicle Status ────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE vehicle_status AS ENUM (
    'AVAILABLE', 'RESERVED', 'RENTED', 'MAINTENANCE', 'UNAVAILABLE'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Booking Status ────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM (
    'PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED',
    'CANCELLED', 'REJECTED', 'EXPIRED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Payment Status ────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'PENDING', 'PROCESSING', 'SUCCESSFUL', 'FAILED',
    'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Payment Method ────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM (
    'MPESA', 'CARD', 'BANK_TRANSFER', 'CASH', 'OTHER'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Rental Type ───────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE rental_type AS ENUM ('SELF_DRIVE', 'CHAUFFEUR');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Car Category ──────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE car_category AS ENUM (
    'SEDAN', 'SUV', 'COUPE', 'CONVERTIBLE',
    'SPORTS_CAR', 'LUXURY_SEDAN', 'ELECTRIC'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Transmission Type ─────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE transmission_type AS ENUM ('AUTOMATIC', 'MANUAL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Fuel Type ─────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE fuel_type AS ENUM ('PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Image Type ────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE image_type AS ENUM (
    'EXTERIOR', 'INTERIOR', 'DASHBOARD', 'ENGINE', 'WHEEL', 'OTHER'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Pricing Type (for services) ───────────────────────────────
DO $$ BEGIN
  CREATE TYPE pricing_type AS ENUM ('PER_DAY', 'PER_BOOKING', 'FIXED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Inspection Type ───────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE inspection_type AS ENUM ('PRE_RENTAL', 'POST_RENTAL', 'MAINTENANCE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Review Status ─────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE review_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'HIDDEN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

SELECT 'Migration 001 complete: All enums created' AS result;
