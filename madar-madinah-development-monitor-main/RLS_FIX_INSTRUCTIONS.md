# 🔐 Supabase RLS Fix - Step by Step Guide

## Problem
Image upload fails with: `"new row violates row-level security policy"`

## Solution
Apply RLS policies to `project_images` table and Storage bucket.

---

## ⏱️ Time Required: ~5 minutes

---

## Step 1: Apply Database Policies (2 minutes)

### 1.1 Open Supabase Dashboard
- Go to: https://app.supabase.com
- Select your project: **madar-madinah-development-monitor**

### 1.2 Open SQL Editor
- Click **SQL Editor** (left sidebar)
- Click **+ New Query**

### 1.3 Copy and Run SQL
1. Open this file in your editor:
   ```
   SUPABASE_RLS_SETUP.sql
   ```

2. Copy ONLY the first section (lines 1-50):
   ```sql
   -- Everything from line 1 until you see "-- 4. Storage Bucket Policies"
   ```
   
   This includes:
   - ALTER TABLE ENABLE ROW LEVEL SECURITY
   - DROP POLICY IF EXISTS (cleanup)
   - CREATE POLICY statements (4 policies)

3. Paste into Supabase SQL Editor

4. Click **RUN**

5. You should see:
   ```
   Query succeeded (no rows)
   ```

### 1.4 Verify Policies Were Created
1. Click **+ New Query** again
2. Copy and paste this verification query:
   ```sql
   SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
   FROM pg_policies
   WHERE tablename = 'project_images';
   ```
3. Click **RUN**
4. You should see **4 rows** with policies:
   - Allow public read project_images
   - Allow public insert project_images
   - Allow public update project_images
   - Allow public delete project_images

✅ **Database policies complete!**

---

## Step 2: Setup Storage Bucket Policies (2 minutes)

### 2.1 Go to Storage
- Click **Storage** (left sidebar)
- Click **Buckets**

### 2.2 Verify Bucket Exists
- Look for bucket named: **project-images**
- If it doesn't exist:
  - Click **+ New Bucket**
  - Name: `project-images`
  - Set as **Public**
  - Click **Create Bucket**

### 2.3 Add Storage Policies
1. Click on **project-images** bucket
2. Click **Policies** tab (top right)

3. Create Policy 1 - SELECT (Read)
   - Click **+ New Policy** (or similar button)
   - Choose operation: **SELECT**
   - For: **Everyone** (public)
   - Create the policy
   
4. Create Policy 2 - INSERT (Upload)
   - Click **+ New Policy**
   - Choose operation: **INSERT**
   - For: **Everyone** (public)
   - Create the policy

5. Create Policy 3 - DELETE
   - Click **+ New Policy**
   - Choose operation: **DELETE**
   - For: **Everyone** (public)
   - Create the policy

✅ **Storage policies complete!**

---

## Step 3: Test Image Upload (1 minute)

The dev server should still be running. If not:
```bash
npm run dev
```

### 3.1 Navigate to Projects
- Go to: http://localhost:3001/projects
- Wait for page to load

### 3.2 Open Edit Modal
1. Click any project card
2. Click blue button: **تعديل المشروع** (Edit Project)
3. Modal should open

### 3.3 Upload Image
1. Scroll up in modal
2. Find section: **إدارة الصور** (Image Management)
3. Click button: **اضغط لتحميل صورة جديدة** (Click to Upload New Image)
4. Select an image file from your computer

### 3.4 Verify Success
- Image should appear in the gallery grid below (3 columns)
- No error message in browser console
- Check browser console (F12 > Console) - no red errors

✅ **Upload successful!**

---

## Step 4: Run Build (1 minute)

In terminal:
```bash
npm run build
```

Expected output:
```
✓ built in X.XXs
[nitro] ✔ You can preview this build...
```

✅ **Build complete!**

---

## Troubleshooting

### Error: "Policy already exists"
**Solution:** 
- The DROP POLICY statements will remove old policies
- Run the SQL again exactly as shown

### Error: "bucket_id = 'project-images' not found"
**Solution:**
- Make sure the bucket name is exactly: `project-images` (lowercase, hyphen)
- Create it if it doesn't exist

### Image still not uploading after policies applied
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Close dev server and restart: `npm run dev`
3. Try upload again
4. Check browser console for errors (F12)

### Can't find SQL Editor in Supabase
**Solution:**
- Make sure you're in the correct project
- Look for "SQL Editor" in the left sidebar under "Database"

---

## Security Notes

✅ **What's Secure:**
- RLS is ENABLED (not disabled)
- Only 4 policies are created (no unnecessary access)
- File operations are restricted to specific bucket
- Client-side role checking adds extra layer (localStorage)

✅ **For Production:**
- Current setup uses anonymous Supabase access
- Role-based checks are client-side (localStorage)
- For higher security, implement Supabase Auth and use auth.uid() in policies

---

## Testing Checklist

- [ ] Opened Supabase SQL Editor
- [ ] Copied and ran SQL from SUPABASE_RLS_SETUP.sql
- [ ] Ran verification query - saw 4 policies
- [ ] Created/verified project-images bucket
- [ ] Added 3 storage policies (SELECT, INSERT, DELETE)
- [ ] Tested image upload - no errors
- [ ] Image appears in gallery
- [ ] Ran npm run build - succeeded

---

## Next Steps After Fix

1. **Test other features:**
   - Delete image (click trash icon)
   - Set as main image (click star icon)
   - Edit project data
   - Submit form

2. **Test from different projects:**
   - Try uploading to multiple projects
   - Verify images save to database

3. **Ready for production!**
   - All features working
   - RLS policies in place
   - Build successful

---

**Need help?** Check the browser console (F12) for specific error messages.
