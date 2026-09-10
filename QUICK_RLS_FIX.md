# 🚀 COPY-PASTE QUICK FIX

## Just Follow These 3 Steps (5 minutes total)

---

## Step 1: Run Database SQL (2 min)

**Go to:** https://app.supabase.com → Your Project → SQL Editor → **+ New Query**

**Copy this entire block and paste into the SQL Editor:**

```sql
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read project_images" ON public.project_images;
DROP POLICY IF EXISTS "Allow public insert project_images" ON public.project_images;
DROP POLICY IF EXISTS "Allow public update project_images" ON public.project_images;
DROP POLICY IF EXISTS "Allow public delete project_images" ON public.project_images;

CREATE POLICY "Allow public read project_images"
ON public.project_images
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert project_images"
ON public.project_images
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update project_images"
ON public.project_images
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete project_images"
ON public.project_images
FOR DELETE
USING (true);
```

**Click:** RUN

**You should see:** ✅ `Query succeeded (no rows)`

---

## Step 2: Create Storage Bucket Policies (2 min)

**Go to:** Storage → Buckets

### If bucket doesn't exist:
1. Click **+ New Bucket**
2. Name: `project-images`
3. Check: **Public bucket**
4. Click: **Create Bucket**

### Add Policies to project-images:
1. Click bucket: **project-images**
2. Go to: **Policies** tab
3. Create each policy:

**Policy 1:**
- Operation: **SELECT**
- For: **Everyone**
- Click: **Create Policy**

**Policy 2:**
- Operation: **INSERT**
- For: **Everyone**
- Click: **Create Policy**

**Policy 3:**
- Operation: **DELETE**
- For: **Everyone**
- Click: **Create Policy**

---

## Step 3: Test Upload (1 min)

```bash
npm run dev
```

1. Go to: http://localhost:3001/projects
2. Click a project card
3. Click: **تعديل المشروع** (Edit Project)
4. Scroll up → **إدارة الصور**
5. Click: **اضغط لتحميل صورة جديدة**
6. Select image file

**✅ Success if:**
- Image appears in gallery
- No error message
- No red errors in console (F12)

---

## Step 4: Build (1 min)

```bash
npm run build
```

Expected: ✅ `built in X.XXs`

---

## 🎉 Done!

That's it! Image upload should now work perfectly.

---

## If Something Goes Wrong

**Image still says "RLS policy" error?**
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server
- Try upload again

**Can't find SQL Editor?**
- Make sure you're logged into Supabase
- Project should be selected
- Look in left sidebar

**Bucket doesn't exist?**
- Create it manually: Storage → + New Bucket
- Name: exactly `project-images` (lowercase with hyphen)

---

**Questions?** Check browser console (F12) for error details.
