# Action Plan: Fix Supabase RLS & Test Image Upload

## What's Been Done ✅
- [x] Identified the RLS policy issue
- [x] Created complete SQL fix script (SUPABASE_RLS_SETUP.sql)
- [x] Created detailed setup guide (RLS_SETUP_GUIDE.md)
- [x] Created quick reference (RLS_QUICK_FIX.md)
- [x] Verified code is ready (no code changes needed)

## What You Need To Do (5-10 minutes)

### ⏱️ Time Breakdown
- SQL Setup: 2 minutes
- Storage Setup: 3 minutes
- Testing: 2 minutes
- **Total: ~7 minutes**

---

## 🚀 Quick Start

### Phase 1: Run SQL (2 minutes)
**Location:** Supabase Dashboard → SQL Editor

1. Open: https://app.supabase.com
2. Select your project
3. Click: **SQL Editor** → **+ New Query**
4. Copy everything from: **SUPABASE_RLS_SETUP.sql**
5. Paste into editor
6. Click: **RUN**
7. ✅ You should see: `CREATE POLICY` (4 times)

### Phase 2: Setup Storage Bucket (3 minutes)
**Location:** Supabase Dashboard → Storage → Buckets

1. Click: **Storage** → **Buckets**
2. **Check:** Does "project-images" bucket exist?
   - Yes? → Continue to Step 3
   - No? → Create it:
     - Click: **+ New Bucket**
     - Name: `project-images`
     - Type: Public
     - Click: **Create**

3. Click on: **project-images** bucket
4. Click: **Policies** tab
5. Click: **+ New Policy** (or pick template)
6. Select: **For public access** (or create from scratch)
7. Set: Operation = **SELECT**
8. Click: **Review** → **Save**

### Phase 3: Test Upload (2 minutes)
**Location:** Your app in browser

```bash
# Terminal 1: Make sure dev server is running
npm run dev
# Should show: ➜  Local:   http://localhost:3001/
```

**Then in browser:**

1. Go to: `http://localhost:3001/projects`
2. Click on any project card (goes to details page)
3. Look for button: **تعديل المشروع** (Edit Project)
4. Click the button
5. Modal appears with edit form
6. Scroll to top of form
7. You'll see: **إدارة الصور** (Image Management)
8. Click: **اضغط لتحميل صورة جديدة** (Click to upload image)
9. Select image file from your computer
10. Image uploads and appears in gallery ✅

**Expected Result:**
- ✅ Image appears in 3-column gallery
- ✅ No error messages
- ✅ Star icon on image (main image)
- ✅ Can click delete button on hover
- ✅ Can click star button to change main

---

## ✅ Success Criteria

| Check | Expected | Your Result |
|-------|----------|------------|
| SQL runs without errors | 4 policies created | ☐ |
| Storage bucket exists | "project-images" visible | ☐ |
| Upload button visible | "اضغط لتحميل صورة جديدة" | ☐ |
| Image uploads | File chosen, upload starts | ☐ |
| Image appears | Shows in gallery grid | ☐ |
| No errors | Console clean, no errors | ☐ |
| Can delete | Hover shows trash icon | ☐ |
| Can set main | Hover shows star icon | ☐ |

---

## 🆘 If Something Goes Wrong

### SQL Fails
**Error:** "syntax error" or "policy already exists"
- **Fix:** Run the DROP POLICY lines first, then CREATE lines
- Try running line by line instead of all at once

### Storage Bucket Not Found
**Error:** "bucket not found" or 404
- **Fix:** Create the bucket manually first
- Make sure name is exactly: `project-images` (with hyphen)

### Upload Still Fails
**Error:** "row violates row-level security policy" (same as before)
- **Fix:** 
  - Verify policies were created: Run verification query
  - Clear browser cache
  - Restart dev server: `npm run dev`
  - Try in incognito/private window

### Image Uploads But Doesn't Show
**Error:** Upload succeeds but image missing
- **Fix:**
  - Refresh page
  - Check browser console for errors
  - Check Supabase dashboard for the uploaded file

---

## 📋 Checklist Before Testing

- [ ] You have access to Supabase dashboard
- [ ] You know your Supabase project URL
- [ ] You have a test image file (JPG, PNG, WebP)
- [ ] Dev server can be started: `npm run dev`
- [ ] Browser can access: `http://localhost:3001`

---

## 📚 Documentation Files

| File | Purpose | When to Use |
|------|---------|-------------|
| **SUPABASE_RLS_SETUP.sql** | Complete SQL script | Run in SQL Editor |
| **RLS_SETUP_GUIDE.md** | Step-by-step guide | Detailed reference |
| **RLS_QUICK_FIX.md** | Quick reference | Fast setup |
| **RLS_IMPLEMENTATION_SUMMARY.md** | Complete overview | Understanding the fix |
| **ACTION_PLAN.md** | This file | Step-by-step checklist |

---

## 🔐 What Changed

### Database Level
- ✅ RLS policies added to `project_images` table
- ✅ 4 policies: SELECT, INSERT, UPDATE, DELETE
- ✅ All set to allow public/anonymous access
- ✅ No database schema changes

### Storage Level
- ✅ Policies added to `project-images` bucket
- ✅ Allow public upload/read/delete
- ✅ Bucket access configured

### Application Code
- ❌ NO CHANGES (code already ready!)
- ✅ Just needed RLS policies to work

---

## 🎯 After Successful Test

1. **Verify:** All checks pass ✅
2. **Commit:** If using git:
   ```bash
   git add SUPABASE_RLS_SETUP.sql RLS_*.md
   git commit -m "Add Supabase RLS policies for project images"
   ```
3. **Document:** Note the RLS setup in your project README
4. **Future:** Consider Supabase Auth for production

---

## 🚨 Important Notes

⚠️ **RLS is Enabled for Security**
- These policies allow public access because app uses anonymous auth
- Recommendation: Migrate to Supabase Auth for production
- Client-side role checks (localStorage) prevent UI access to non-employees

⚠️ **No Database Schema Changes**
- RLS policies are configuration only
- No tables added/modified/deleted
- Existing data unaffected

⚠️ **Test Before Production**
- Upload a few test images
- Verify they appear on project detail page
- Check map still works with new images
- Check statistics page updates

---

## 📞 Need Help?

1. **SQL Error?** → Check SUPABASE_RLS_SETUP.sql syntax
2. **Storage Issue?** → Verify bucket name: `project-images`
3. **Still Blocked?** → Clear cache, restart dev server
4. **Policy Query?** → Run verification query in SQL Editor

---

**Ready to fix?** Start with Phase 1 above! ⏳
