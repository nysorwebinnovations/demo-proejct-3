/*
# Lead Management & Service Booking — initial schema

## Overview
Creates the data model for a lead management / service booking application:
clients sign in, submit service requests (bookings), and track their status
in real time. An admin role can see and update every booking in the system.

## New Tables

### profiles
- `id` (uuid, primary key) — mirrors `auth.users.id`; one row per user.
- `email` (text, not null) — denormalized for fast display.
- `full_name` (text, nullable) — display name.
- `role` (text, not null, default 'client') — 'client' or 'admin'.
- `created_at` (timestamptz, default now()).

### bookings
- `id` (uuid, primary key).
- `user_id` (uuid, not null, default `auth.uid()`) — owner of the booking.
- `client_name` (text, not null) — name submitted on the request form.
- `client_email` (text, not null) — email submitted on the request form.
- `service_name` (text, not null) — selected service type.
- `preferred_date` (date, nullable) — requested date.
- `budget` (text, nullable) — selected budget range.
- `notes` (text, nullable) — free-text notes.
- `status` (text, not null, default 'Pending') — Pending / Approved / In Progress / Completed.
- `created_at` (timestamptz, default now()).
- `updated_at` (timestamptz, default now()).

## Functions

- `handle_new_user()` — trigger fired on INSERT into `auth.users`; creates a
  matching `profiles` row with role 'client' and the signup email.
- `is_admin()` — returns boolean; true if the current user's profile role is
  'admin'. Used by RLS policies so admins can manage all bookings.
- `set_updated_at()` — trigger that refreshes `bookings.updated_at` on UPDATE.

## Security

- RLS enabled on both `profiles` and `bookings`.
- `profiles`: users read/update only their own profile. No inserts via the
  client (profiles are created by the `handle_new_user` trigger).
- `bookings`:
  - SELECT — a user sees their own bookings OR any booking if they are an admin.
  - INSERT — an authenticated user can insert a booking for themselves
    (`user_id` defaults to `auth.uid()` so the client insert omits it).
  - UPDATE — the owner can update their own booking; an admin can update any.
  - DELETE — the owner can delete their own booking; an admin can delete any.
- `is_admin()` is `SECURITY DEFINER` so it can read any profile row to resolve
  the role; it only returns a boolean and exposes no data.

## Notes

1. Email confirmation stays OFF (Supabase default for this project).
2. To make a user an admin, set `profiles.role = 'admin'` for that user.
3. All policies use `auth.uid()` (never `current_user`).
*/

-- =========================================================
-- profiles
-- =========================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- =========================================================
-- bookings
-- =========================================================
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_email text NOT NULL,
  service_name text NOT NULL,
  preferred_date date,
  budget text,
  notes text,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'In Progress', 'Completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);
CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings(created_at DESC);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Admin helper: SECURITY DEFINER so it can read any profile to resolve role.
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

DROP POLICY IF EXISTS "select_bookings" ON bookings;
CREATE POLICY "select_bookings" ON bookings FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "insert_own_bookings" ON bookings;
CREATE POLICY "insert_own_bookings" ON bookings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_bookings" ON bookings;
CREATE POLICY "update_bookings" ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "delete_bookings" ON bookings;
CREATE POLICY "delete_bookings" ON bookings FOR DELETE
  TO authenticated USING (auth.uid() = user_id OR public.is_admin());

-- =========================================================
-- updated_at trigger for bookings
-- =========================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_set_updated_at ON bookings;
CREATE TRIGGER bookings_set_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- Auto-create profile on signup
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();