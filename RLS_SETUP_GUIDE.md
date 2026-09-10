# Supabase RLS Setup Guide - Project Images

## Problem
Uploading project images fails with: `"new row violates row-level security policy"`

This happens because Row Level Security (RLS) policies are not configured to allow INSERT/UPDATE/DELETE operations on the `project_images` table.

## Solution Overview
We'll enable RLS policies to allow public/anonymous users to perform these operations, with role-based access control handled client-side via localStorage.

---

## Step 1: Run SQL in Supabase SQL Editor

### 1.1 Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **+ New Query**

### 1.2 Copy and Run the SQL
Copy the entire SQL from `SUPABASE_RLS_SETUP.sql` and paste it into the SQL editor.

**The SQL does the following:**
- Enables RLS on `project_images` table
- Drops any conflicting existing policies
- Creates 4 new policies:
  - **SELECT** - Allow public to view all images
  - **INSERT** - Allow public to upload new images
  - **UPDATE** - Allow public to update image metadata (is_main flag)
  - **DELETE** - Allow public to delete images

### 1.3 Execute
Click **Run** or press `Ctrl+Enter`

You should see a success message for each policy creation.

---

## Step 2: Configure Storage Bucket Policies

### 2.1 Navigate to Storage Bucket
1. Click **Storage** in the Supabase left sidebar
2. Click **Buckets**
3. Click **project-images** bucket

### 2.2 Go to Policies Tab
1. Click the **Policies** tab
2. Click **+ New Policy** or **Create policy from template**

### 2.3 Create Upload Policy
**Create a new policy with these settings:**

- **Template:** "For public access" (or create custom)
- **Policy Name:** `Allow public upload project images`
- **Operation:** SELECT
- **Target role:** public (or select based on your needs)
- **Policy expression:** Leave as default (true)

**Click "Review"** then **"Save policy"**

### 2.4 Create Read Policy
**Create another policy:**

- **Policy Name:** `Allow public read project images`
- **Operation:** SELECT
- **Target role:** public
- **Policy expression:** Leave as default (true)

### 2.5 Create Delete Policy (Optional but recommended)
**Create another policy:**

- **Policy Name:** `Allow public delete project images`
- **Operation:** DELETE
- **Target role:** public
- **Policy expression:** Leave as default (true)

---

## Step 3: Verify Setup

### 3.1 Check Database Policies
In SQL Editor, run this query to verify:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, qual
FROM pg_policies
WHERE tablename = 'project_images'
ORDER BY policyname;
```

You should see 4 policies:
- `Allow public delete project_images`
- `Allow public insert project_images`
- `Allow public read project_images`
- `Allow public update project_images`

### 3.2 Check Storage Policies
In the Supabase dashboard:
1. Go to **Storage > Buckets > project-images > Policies**
2. You should see the policies you created

---

## Step 4: Test the Upload Feature

### 4.1 Start Dev Server
```bash
npm run dev
```

### 4.2 Test Image Upload
1. Navigate to a project details page
2. Click "تعديل المشروع" (Edit Project button)
3. In the modal, click "اضغط لتحميل صورة جديدة" (Click to upload image)
4. Select an image file
5. The image should upload successfully and appear in the gallery

### 4.3 Verify Success
- Image appears in the gallery grid
- No error message appears
- Star icon appears if it's the main image
- You can delete and set main image

---

## How RLS Works in This Setup

| Operation | Before RLS | With RLS (This Setup) |
|-----------|-----------|----------------------|
| SELECT (view) | ✅ Allowed | ✅ Allowed (everyone) |
| INSERT (upload) | ✅ Allowed | ✅ Allowed (with policy) |
| UPDATE (modify) | ✅ Allowed | ✅ Allowed (with policy) |
| DELETE (remove) | ✅ Allowed | ✅ Allowed (with policy) |

---

## Security Considerations

### Current Setup (Anonymous Access)
- ✅ RLS is enabled and working
- ✅ Policies allow the necessary operations
- ✅ Client-side role checking (isEmployee) prevents guests from seeing the edit button
- ⚠️ Anyone with access to the app can technically perform these operations

### Future Improvement (Recommended)
For production environments, consider implementing:

1. **Supabase Auth Integration**
   - Replace localStorage-based roles with Supabase Auth users
   - Create RLS policies that check `auth.uid()` and user roles

2. **Role-Based Policies**
   ```sql
   -- Example for future implementation:
   CREATE POLICY "Allow employees to update images"
   ON public.project_images
   FOR UPDATE
   USING (
     auth.uid() IS NOT NULL AND 
     (auth.jwt() ->> 'user_role' = 'employee')
   )
   WITH CHECK (true);
   ```

3. **Audit Logging**
   - Track who uploads/deletes images
   - Store user IDs in the database

---

## Troubleshooting

### Issue: "Still getting RLS policy error after applying SQL"

**Solution:**
1. Verify RLS is enabled on the table: Run `ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;`
2. Check if policies were created: Run the verification query from Step 3.1
3. Refresh your browser and clear cache
4. Restart dev server: `npm run dev`

### Issue: "Storage bucket upload still fails"

**Solution:**
1. Make sure the bucket name is exactly `project-images` (with hyphen, not underscore)
2. Verify storage policies are created in the dashboard
3. Check that bucket is not set to private - it should be public or have public read access

### Issue: "Storage bucket doesn't exist"

**Solution:**
1. Go to Storage in Supabase dashboard
2. Click **+ New Bucket**
3. Name it: `project-images`
4. Set to Public
5. Create
6. Then add the storage policies from Step 2

---

## Files Reference

- **SQL Script:** `SUPABASE_RLS_SETUP.sql` - Contains all SQL to run
- **Image Upload Function:** `src/lib/supabase.ts` - `uploadProjectImage()`
- **Edit Modal Component:** `src/components/EditProjectModal.tsx` - Image upload UI
- **Project Images Table:** `project_images` - Schema with columns: id, project_id, image_url, image_name, is_main

---

## Next Steps

After confirming the image upload works:
1. Test editing other project fields to ensure no RLS conflicts
2. Test on multiple projects to verify consistency
3. Test deleting images to verify DELETE policy works
4. Consider implementing Supabase Auth for better security in production
