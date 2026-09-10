# Quick RLS Fix - Copy & Paste

## For project_images Table - Run in Supabase SQL Editor

```sql
-- Enable RLS
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- Drop conflicting policies
DROP POLICY IF EXISTS "Allow public read project_images" ON public.project_images;
DROP POLICY IF EXISTS "Allow public insert project_images" ON public.project_images;
DROP POLICY IF EXISTS "Allow public update project_images" ON public.project_images;
DROP POLICY IF EXISTS "Allow public delete project_images" ON public.project_images;

-- Create SELECT policy
CREATE POLICY "Allow public read project_images"
ON public.project_images
FOR SELECT
USING (true);

-- Create INSERT policy
CREATE POLICY "Allow public insert project_images"
ON public.project_images
FOR INSERT
WITH CHECK (true);

-- Create UPDATE policy
CREATE POLICY "Allow public update project_images"
ON public.project_images
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Create DELETE policy
CREATE POLICY "Allow public delete project_images"
ON public.project_images
FOR DELETE
USING (true);

-- Verify policies created
SELECT policyname, permissive, roles, qual
FROM pg_policies
WHERE tablename = 'project_images';
```

## For Storage Bucket - Use Dashboard

1. Go to **Storage > Buckets > project-images > Policies**
2. If bucket doesn't exist, create it:
   - Click **+ New Bucket**
   - Name: `project-images`
   - Make it Public
3. Add these policies:

### Policy 1: Allow Upload
```
Template: For public access
Operation: INSERT
Target role: public
WITH CHECK: true
```

### Policy 2: Allow Read
```
Operation: SELECT
Target role: public
WITH CHECK: true
```

### Policy 3: Allow Delete (Optional)
```
Operation: DELETE
Target role: public
USING: true
```

## Test It

1. Start dev server: `npm run dev`
2. Navigate to project details page
3. Click "تعديل المشروع" button
4. Click "اضغط لتحميل صورة جديدة"
5. Select and upload an image
6. Image should appear in gallery ✅

If successful:
- No error messages
- Image displays in 3-column grid
- Can delete/set as main
- Page doesn't crash
