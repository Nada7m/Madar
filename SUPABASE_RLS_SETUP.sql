-- Supabase RLS Policies for projects + project_images
-- Goal:
-- 1) Keep reads public.
-- 2) Restrict all write/update/delete to authenticated users whose profile is active
--    and role is employee or admin.

-- =====================================================
-- 1. Enable RLS
-- =====================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. Drop old policies (safe re-run)
-- =====================================================
DROP POLICY IF EXISTS "Allow public read projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public update projects" ON public.projects;
DROP POLICY IF EXISTS "Allow employee admin update projects" ON public.projects;

DROP POLICY IF EXISTS "Allow public read project_images" ON public.project_images;
DROP POLICY IF EXISTS "Allow public insert project_images" ON public.project_images;
DROP POLICY IF EXISTS "Allow public update project_images" ON public.project_images;
DROP POLICY IF EXISTS "Allow public delete project_images" ON public.project_images;
DROP POLICY IF EXISTS "Allow employee admin write project_images" ON public.project_images;

-- =====================================================
-- 3. Shared profile check helper (inline EXISTS expression)
-- =====================================================
-- NOTE: auth.uid() must match profiles.id
-- Required profile columns: id, role, is_active

-- =====================================================
-- 4. Projects policies
-- =====================================================
CREATE POLICY "Allow public read projects"
ON public.projects
FOR SELECT
USING (true);

CREATE POLICY "Allow employee admin update projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (
	EXISTS (
		SELECT 1
		FROM public.profiles p
		WHERE p.id = auth.uid()
			AND p.is_active = true
			AND p.role IN ('employee', 'admin')
	)
)
WITH CHECK (
	EXISTS (
		SELECT 1
		FROM public.profiles p
		WHERE p.id = auth.uid()
			AND p.is_active = true
			AND p.role IN ('employee', 'admin')
	)
);

-- =====================================================
-- 5. Project images policies
-- =====================================================
CREATE POLICY "Allow public read project_images"
ON public.project_images
FOR SELECT
USING (true);

CREATE POLICY "Allow employee admin write project_images"
ON public.project_images
FOR INSERT
TO authenticated
WITH CHECK (
	EXISTS (
		SELECT 1
		FROM public.profiles p
		WHERE p.id = auth.uid()
			AND p.is_active = true
			AND p.role IN ('employee', 'admin')
	)
);

CREATE POLICY "Allow employee admin update project_images"
ON public.project_images
FOR UPDATE
TO authenticated
USING (
	EXISTS (
		SELECT 1
		FROM public.profiles p
		WHERE p.id = auth.uid()
			AND p.is_active = true
			AND p.role IN ('employee', 'admin')
	)
)
WITH CHECK (
	EXISTS (
		SELECT 1
		FROM public.profiles p
		WHERE p.id = auth.uid()
			AND p.is_active = true
			AND p.role IN ('employee', 'admin')
	)
);

CREATE POLICY "Allow employee admin delete project_images"
ON public.project_images
FOR DELETE
TO authenticated
USING (
	EXISTS (
		SELECT 1
		FROM public.profiles p
		WHERE p.id = auth.uid()
			AND p.is_active = true
			AND p.role IN ('employee', 'admin')
	)
);

-- =====================================================
-- 6. Storage bucket policies (project-images)
-- =====================================================
-- Keep reads public if needed for gallery display.
-- Restrict uploads/deletes to authenticated users only.

-- Example (run in SQL editor if you manage storage policies with SQL):
-- CREATE POLICY "Allow public read project images"
-- ON storage.objects
-- FOR SELECT
-- TO public
-- USING (bucket_id = 'project-images');

-- CREATE POLICY "Allow authenticated upload project images"
-- ON storage.objects
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'project-images');

-- CREATE POLICY "Allow authenticated delete project images"
-- ON storage.objects
-- FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'project-images');

-- =====================================================
-- 7. Verify policies
-- =====================================================
-- SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('projects', 'project_images')
-- ORDER BY tablename, policyname;
