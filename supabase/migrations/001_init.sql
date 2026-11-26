-- ==============================================================================
-- C.N.S. Paramedical and Nursing College - Supabase Initial Schema & RLS
-- Migration: 001_init.sql
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TABLES
-- ------------------------------------------------------------------------------

-- Staff Directory
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    department TEXT NOT NULL,
    qualification TEXT NOT NULL,
    photo_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT staff_name_len CHECK (char_length(name) BETWEEN 2 AND 100),
    CONSTRAINT staff_designation_len CHECK (char_length(designation) BETWEEN 2 AND 100),
    CONSTRAINT staff_department_len CHECK (char_length(department) BETWEEN 2 AND 100),
    CONSTRAINT staff_qualification_len CHECK (char_length(qualification) BETWEEN 2 AND 150)
);

-- Academic & Administrative Notices
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    link_url TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    is_active BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    CONSTRAINT notices_title_len CHECK (char_length(title) BETWEEN 5 AND 255),
    CONSTRAINT notices_description_len CHECK (char_length(description) BETWEEN 5 AND 5000),
    CONSTRAINT notices_category_len CHECK (char_length(category) BETWEEN 2 AND 50)
);

-- Student Enquiries & Admission Leads
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    course TEXT NOT NULL,
    last_qualification TEXT NOT NULL,
    percentage NUMERIC(5, 2),
    city TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Constraints & Validation Rules
    CONSTRAINT enquiries_course_check CHECK (course IN ('ANM', 'GNM', 'B.Sc. Nursing', 'Other')),
    CONSTRAINT enquiries_status_check CHECK (status IN ('new', 'in_progress', 'resolved')),
    CONSTRAINT enquiries_phone_format CHECK (phone ~ '^[6-9][0-9]{9}$'), -- 10-digit Indian mobile number
    CONSTRAINT enquiries_name_len CHECK (char_length(name) BETWEEN 2 AND 100),
    CONSTRAINT enquiries_email_format CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT enquiries_last_qual_len CHECK (char_length(last_qualification) BETWEEN 2 AND 150),
    CONSTRAINT enquiries_percentage_range CHECK (percentage IS NULL OR (percentage >= 0 AND percentage <= 100)),
    CONSTRAINT enquiries_city_len CHECK (city IS NULL OR char_length(city) BETWEEN 2 AND 100),
    CONSTRAINT enquiries_message_len CHECK (message IS NULL OR char_length(message) <= 2000),
    CONSTRAINT enquiries_admin_notes_len CHECK (admin_notes IS NULL OR char_length(admin_notes) <= 5000)
);

-- Admin Users Registry (References auth.users)
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 2. HELPER FUNCTION: is_admin()
-- Checks if currently authenticated user UID exists in admin_users table
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.admin_users
        WHERE user_id = auth.uid()
    );
END;
$$;

-- Grant execution to public and authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS across all tables
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- STAFF POLICIES
DROP POLICY IF EXISTS "Allow anon and public to read staff" ON public.staff;
CREATE POLICY "Allow anon and public to read staff"
    ON public.staff
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow admins full access to staff" ON public.staff;
CREATE POLICY "Allow admins full access to staff"
    ON public.staff
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- NOTICES POLICIES
DROP POLICY IF EXISTS "Allow public to read active notices" ON public.notices;
CREATE POLICY "Allow public to read active notices"
    ON public.notices
    FOR SELECT
    TO anon, authenticated
    USING (
        is_active = true 
        AND (expires_at IS NULL OR expires_at > now())
    );

DROP POLICY IF EXISTS "Allow admins full access to notices" ON public.notices;
CREATE POLICY "Allow admins full access to notices"
    ON public.notices
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ENQUIRIES POLICIES
-- Anon and authenticated users can ONLY insert enquiries. Cannot SELECT, UPDATE, or DELETE.
DROP POLICY IF EXISTS "Allow anon and users to insert enquiries" ON public.enquiries;
CREATE POLICY "Allow anon and users to insert enquiries"
    ON public.enquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Only admins can read, update status, add notes, or delete enquiries
DROP POLICY IF EXISTS "Allow admins full access to enquiries" ON public.enquiries;
CREATE POLICY "Allow admins full access to enquiries"
    ON public.enquiries
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ADMIN_USERS POLICIES
DROP POLICY IF EXISTS "Allow admins full access to admin_users" ON public.admin_users;
CREATE POLICY "Allow admins full access to admin_users"
    ON public.admin_users
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. STORAGE CONFIGURATION: staff-photos BUCKET
-- Public read, 2 MB size limit, image mime-types only, admin-only write/delete
-- ------------------------------------------------------------------------------

-- Ensure storage bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'staff-photos',
    'staff-photos',
    true,
    2097152, -- 2 MB in bytes (2 * 1024 * 1024)
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 2097152,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public can view staff photos" ON storage.objects;
CREATE POLICY "Public can view staff photos"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'staff-photos');

DROP POLICY IF EXISTS "Admins can upload staff photos" ON storage.objects;
CREATE POLICY "Admins can upload staff photos"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'staff-photos'
        AND public.is_admin()
    );

DROP POLICY IF EXISTS "Admins can update staff photos" ON storage.objects;
CREATE POLICY "Admins can update staff photos"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'staff-photos'
        AND public.is_admin()
    )
    WITH CHECK (
        bucket_id = 'staff-photos'
        AND public.is_admin()
    );

DROP POLICY IF EXISTS "Admins can delete staff photos" ON storage.objects;
CREATE POLICY "Admins can delete staff photos"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'staff-photos'
        AND public.is_admin()
    );
