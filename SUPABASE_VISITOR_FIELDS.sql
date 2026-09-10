-- Add visitor-focused fields to projects without deleting existing columns/data.
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS visitor_description TEXT,
  ADD COLUMN IF NOT EXISTS visitor_description_en TEXT,
  ADD COLUMN IF NOT EXISTS main_features TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS main_features_en TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS services TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS services_en TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS project_importance TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS project_importance_en TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS official_url TEXT,
  ADD COLUMN IF NOT EXISTS booking_url TEXT,
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS name_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS features_en TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS importance_en TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS services_en_legacy TEXT[] DEFAULT '{}';

-- Optional compatibility for current app naming.
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS project_name TEXT;

-- Keep existing records intact; no DELETE or UPDATE of current rows.
-- If you want the new fields to be visible to public visitors, leave read access open.

-- Example data migration pattern for future use (not executed automatically):
-- UPDATE public.projects
-- SET visitor_description = description,
--     main_features = ARRAY[ 'خدمة مميزة', 'موقع مناسب' ],
--     services = ARRAY[ 'إقامة', 'مطاعم' ],
--     project_importance = ARRAY[ 'يخدم الزوار' ],
--     official_url = 'https://example.com',
--     booking_url = 'https://booking.com',
--     name_en = name,
--     description_en = description,
--     features_en = ARRAY[ 'Premium service', 'Convenient location' ],
--     services_en = ARRAY[ 'Accommodation', 'Dining' ],
--     importance_en = ARRAY[ 'Supports visitors' ]
-- WHERE visitor_description IS NULL;

-- Ensure public read policy for projects remains available.
-- If not present, run:
-- ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Allow public read projects" ON public.projects;
-- CREATE POLICY "Allow public read projects"
-- ON public.projects FOR SELECT
-- USING (true);

-- If you want employee/admin write access, keep the existing project update policies or add:
-- CREATE POLICY "Allow employee admin write projects"
-- ON public.projects
-- FOR INSERT WITH CHECK (
--   EXISTS (
--     SELECT 1 FROM public.profiles p
--     WHERE p.id = auth.uid() AND p.role IN ('employee', 'admin')
--   )
-- );
