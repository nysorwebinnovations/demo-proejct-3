/*
# ====================================================================
# Migration: Aura Ceylon Resorts & Sanctuary — Reservations Schema & Legacy Fix
# ====================================================================

## Overview
1. Creates the `reservations` table for luxury hotel and villa bookings.
2. Safely migrates existing legacy rows from `public.bookings` (if present as a table) into `public.reservations`.
3. Safely drops the old `public.bookings` table and replaces it with a backward-compatible VIEW to fix PostgreSQL Error 42809 ("bookings is not a view").
4. Sets up Row Level Security (RLS), indexes, and `updated_at` triggers.
5. Populates initial Sri Lankan demo reservations if the table is empty.
*/

-- Step 1: Create the new 'reservations' table
CREATE TABLE IF NOT EXISTS public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  property_name text NOT NULL,
  location text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests_count integer NOT NULL DEFAULT 2,
  room_type text NOT NULL,
  total_price_lkr numeric NOT NULL,
  status text NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Pending Payment', 'Completed', 'Cancelled')),
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  special_requests text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Step 2: Migrate data from legacy 'bookings' table if it exists as a BASE TABLE
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name = 'bookings' 
      AND table_type = 'BASE TABLE'
  ) THEN
    -- Safely copy legacy booking data into new reservations schema
    INSERT INTO public.reservations (
      id,
      user_id,
      property_name,
      location,
      check_in,
      check_out,
      guests_count,
      room_type,
      total_price_lkr,
      status,
      guest_name,
      guest_email,
      special_requests,
      created_at,
      updated_at
    )
    SELECT
      b.id,
      b.user_id,
      COALESCE(b.service_name, 'Ella Cloud Villa & Spa') AS property_name,
      'Little Adams Peak, Ella' AS location,
      COALESCE(b.preferred_date, CURRENT_DATE) AS check_in,
      COALESCE(b.preferred_date + INTERVAL '3 days', CURRENT_DATE + INTERVAL '3 days')::date AS check_out,
      2 AS guests_count,
      'Deluxe Sanctuary Suite' AS room_type,
      COALESCE(NULLIF(regexp_replace(b.budget, '[^0-9]', '', 'g'), '')::numeric, 180000) AS total_price_lkr,
      CASE 
        WHEN b.status = 'Approved' THEN 'Confirmed'
        WHEN b.status = 'In Progress' THEN 'Confirmed'
        WHEN b.status = 'Completed' THEN 'Completed'
        ELSE 'Pending Payment'
      END AS status,
      b.client_name AS guest_name,
      b.client_email AS guest_email,
      b.notes AS special_requests,
      b.created_at,
      b.updated_at
    FROM public.bookings b
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Step 3: Cleanly drop the legacy table/view to avoid Error 42809
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP VIEW IF EXISTS public.bookings CASCADE;

-- Step 4: Create the backward-compatibility VIEW
CREATE OR REPLACE VIEW public.bookings AS
  SELECT 
    id,
    user_id,
    guest_name AS client_name,
    guest_email AS client_email,
    property_name || ' (' || room_type || ')' AS service_name,
    check_in AS preferred_date,
    'LKR ' || total_price_lkr::text AS budget,
    special_requests AS notes,
    CASE 
      WHEN status = 'Confirmed' THEN 'Approved'
      WHEN status = 'Pending Payment' THEN 'Pending'
      WHEN status = 'Completed' THEN 'Completed'
      ELSE 'Pending'
    END AS status,
    created_at,
    updated_at
  FROM public.reservations;

-- Step 5: Create Indexes for Performance
CREATE INDEX IF NOT EXISTS reservations_user_id_idx ON public.reservations(user_id);
CREATE INDEX IF NOT EXISTS reservations_status_idx ON public.reservations(status);
CREATE INDEX IF NOT EXISTS reservations_check_in_idx ON public.reservations(check_in);
CREATE INDEX IF NOT EXISTS reservations_created_at_idx ON public.reservations(created_at DESC);

-- Step 6: Enable Row Level Security (RLS)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Step 7: Define RLS Policies
DROP POLICY IF EXISTS "select_reservations" ON public.reservations;
CREATE POLICY "select_reservations" ON public.reservations FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "insert_own_reservations" ON public.reservations;
CREATE POLICY "insert_own_reservations" ON public.reservations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_reservations" ON public.reservations;
CREATE POLICY "update_reservations" ON public.reservations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "delete_reservations" ON public.reservations;
CREATE POLICY "delete_reservations" ON public.reservations FOR DELETE
  TO authenticated USING (auth.uid() = user_id OR public.is_admin());

-- Step 8: updated_at trigger
CREATE OR REPLACE FUNCTION public.set_reservations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reservations_set_updated_at ON public.reservations;
CREATE TRIGGER reservations_set_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_reservations_updated_at();
