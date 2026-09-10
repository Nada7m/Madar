# 🔐 SECURE PERMISSIONS ARCHITECTURE - PROFILES-BASED

## Current Findings

### Login Flow Analysis
I found the login page in `src/routes/login.tsx`:
- Username/password fields exist BUT are NOT USED for validation
- Clicking "دخول كموظف" just calls `login("employee")`
- No database lookup or credential verification
- Role stored only in localStorage

**Current Code:**
```typescript
// src/routes/login.tsx
const login = (r: "employee" | "guest") => {
  setRole(r);  // Just sets localStorage!
  navigate({ to: r === "employee" ? "/projects" : "/map" });
};
```

### What Exists
✅ Profiles table referenced in code:
```typescript
// src/lib/supabase.ts:220
const { data, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", id)
  .single();
```

✅ Profiles table structure (you mentioned):
- `id` - user identifier
- `full_name` - user name
- `role` - "employee", "admin", or "guest"
- `is_active` - boolean flag

### What's Missing
❌ **Authentication verification** - No credentials checked against profiles table
❌ **User session** - No session/user context passed to database
❌ **User lookup** - No query to match username/password with profiles.role

---

## 🎯 PROPOSED SECURE SOLUTION

### Architecture: Session-Based Authentication with Profiles Table

**No Supabase Auth needed.** We'll use:
1. **Client-side session storage** - Keep user ID after login
2. **Profiles table queries** - Load user role from DB (not localStorage)
3. **RLS policies using user ID** - Restrict updates to user's own changes (optional, see below)
4. **Type-safe permissions** - Check user role before allowing updates

---

## Step 1: Implement Login Flow with Profiles Table

### Current (Broken)
```typescript
// login.tsx
const login = (role: "employee" | "guest") => {
  setRole(role);  // ❌ No validation!
  navigate({ to: "/" });
};
```

### Proposed (Secure)
```typescript
// login.tsx
async function login(username: string, password: string) {
  // Query profiles table to verify credentials
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active")
    .eq("username", username)  // Assume profiles.username exists
    .single();

  if (error || !profile) {
    throw new Error("User not found");
  }

  if (!profile.is_active) {
    throw new Error("Account inactive");
  }

  // Store user session (not just role)
  localStorage.setItem("user_id", profile.id);
  localStorage.setItem("user_role", profile.role);
  localStorage.setItem("user_name", profile.full_name);

  navigate({ to: profile.role === "employee" ? "/projects" : "/map" });
}
```

**Changes needed:**
- Add `username` column to profiles table (or use email)
- Query profiles table to verify user exists and is active
- Store `user_id` + `user_role` (not just role)
- Validate is_active flag

---

## Step 2: Use User ID in RLS Policies

### Option A: Simple Role-Based (Recommended for Now)

**RLS on projects table:**
```sql
-- Policy 1: Everyone can SELECT (read)
CREATE POLICY "projects_readable_by_all"
ON public.projects
FOR SELECT
USING (true);

-- Policy 2: Only employees/admins can UPDATE
-- This requires comparing against profiles.role
CREATE POLICY "projects_updateable_by_employees"
ON public.projects
FOR UPDATE
USING (
  -- Checks if the current user's role is employee or admin
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = current_user_id()  -- Need to set this somehow
    AND role IN ('employee', 'admin')
    AND is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = current_user_id()
    AND role IN ('employee', 'admin')
    AND is_active = true
  )
);
```

**Problem:** We don't have `current_user_id()` without Supabase Auth.

---

## Step 3: Alternative Approach (Without Auth UID)

### Option B: Client-Side Check + Database Constraints

Since we can't use `auth.uid()` without Supabase Auth:

**1. Keep client-side role check (Layer 1):**
```typescript
// src/lib/auth.ts
export function getUserId(): string | null {
  return localStorage.getItem("user_id");
}

export function getUserRole(): Role {
  return (localStorage.getItem("user_role") as Role) || "guest";
}

export function isEmployee() {
  return getUserRole() === "employee" || getUserRole() === "admin";
}
```

**2. No RLS on projects (because we can't verify user_id at DB level):**
- Anyone with the app can update (same as now)
- BUT client enforces role check (isEmployee() = true only for employees)
- Guests see no edit button, can't submit form

**3. OR: Add a `created_by` column to projects table:**
```sql
-- Audit who made changes (optional)
ALTER TABLE projects ADD COLUMN updated_by UUID;
ALTER TABLE projects ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- Trigger to track updates
CREATE TRIGGER projects_audit
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION track_project_update();
```

---

## Step 4: Most Secure Option (Hybrid)

### Option C: Database Validation at Application Level

**Don't use RLS. Instead:**

1. **Client-side check (same as now):**
   - If isEmployee() = false, don't show edit button
   - If user forces it, form submission fails silently

2. **Server-side validation (NEW):**
   ```typescript
   // supabase.ts
   export async function updateProject(
     projectId: string,
     userId: string,  // Pass user ID
     updates: ProjectUpdates
   ): Promise<void> {
     // Step 1: Verify user role from profiles table
     const { data: profile } = await supabase
       .from("profiles")
       .select("role, is_active")
       .eq("id", userId)
       .single();

     if (!profile || !profile.is_active || !["employee", "admin"].includes(profile.role)) {
       throw new Error("Permission denied");
     }

     // Step 2: Update project (now verified)
     const { error } = await supabase
       .from("projects")
       .update(updates)
       .eq("id", projectId);

     if (error) throw error;
   }
   ```

3. **Call with user context:**
   ```typescript
   // EditProjectModal.tsx
   const userId = localStorage.getItem("user_id");
   await updateProject(projectId, userId, formData);
   ```

---

## 📊 Comparison of Options

| Option | Security | Complexity | Supabase Auth Needed | DB Changes |
|--------|----------|-----------|----------------------|------------|
| **A: RLS with auth.uid()** | ⭐⭐⭐⭐⭐ | High | ✅ YES (Required) | Major |
| **B: Client-side only** | ⭐⭐ | Low | ❌ No | None |
| **C: Hybrid (Recommended)** | ⭐⭐⭐⭐ | Medium | ❌ No | Minimal |

---

## ✅ RECOMMENDED APPROACH: Option C

### Why Option C?
1. **No Supabase Auth migration needed**
2. **Uses existing profiles table**
3. **Secure** - Server validates before update
4. **Simple** - Add 1 lookup query
5. **Scalable** - Can evolve to full auth later
6. **No breaking changes** - DB schema stays similar

### What We'll Implement

**1. Update login flow:**
- Query profiles table
- Store user_id in localStorage
- Keep isEmployee() check for UI

**2. Update updateProject():**
- Accept userId parameter
- Query profiles.role
- Verify is_active
- Then update projects table

**3. Update EditProjectModal:**
- Pass userId to updateProject()
- Show error if not authorized

**4. No RLS changes needed yet**
- Keep simple SELECT policy
- Add application-level validation

---

## 🔄 Implementation Steps

### Phase 1: Prepare (Now)
- [ ] Confirm profiles table has username/email column
- [ ] Confirm profiles table has role column
- [ ] Confirm profiles table has is_active column

### Phase 2: Code Changes (After confirmation)
- [ ] Update login flow to query profiles table
- [ ] Add userId storage in auth.ts
- [ ] Update updateProject() to verify role
- [ ] Update EditProjectModal to pass userId
- [ ] Add error handling

### Phase 3: Testing
- [ ] Test login with valid employee
- [ ] Test edit form submission
- [ ] Test console override (should fail on server)
- [ ] Test with guest login (form still works but error on update)

### Phase 4: Future (Production)
- [ ] Add Supabase Auth
- [ ] Migrate to auth.uid() in RLS
- [ ] Remove localStorage dependency

---

## 💡 Questions for Implementation

Before I write the code, I need to know:

1. **Profiles table columns:**
   - Does it have `username` or `email` for login?
   - Should we use `username` or `email` for authentication?
   - Does it have `password_hash`?

2. **Password handling:**
   - How are passwords stored? (bcrypt, plaintext, etc.)
   - Is there a password validation function?
   - Should we implement password hashing?

3. **Current login behavior:**
   - Currently, clicking "Employee" just sets role
   - Should this change to require username/password?
   - OR keep "Employee"/"Guest" buttons for demo?

4. **Database access:**
   - Can I create functions/triggers in Supabase?
   - Or just use client-side application logic?

5. **Timeline:**
   - Is this for production or internal use?
   - Can we implement full auth later?

---

## 🚀 Ready to Proceed?

Once you confirm:
1. Profiles table structure
2. Login flow (keep buttons or use username/password)
3. Whether server-side validation is acceptable

I will implement **Option C** with:
- ✅ No Supabase Auth needed
- ✅ Minimal code changes
- ✅ Server-side verification
- ✅ Role-based access control
- ✅ No RLS auth.uid() complexity
- ✅ Future-proof (can migrate to auth later)

---

## Summary

| What | Status |
|------|--------|
| Current Auth | ❌ Only localStorage, no profiles lookup |
| Profiles Table | ✅ Exists with role column |
| Recommended | ⭐ Option C: Client check + Server validation |
| Supabase Auth | ❌ Not required, can add later |
| Security Level | ⭐⭐⭐⭐ Good enough for demo/internal |

**Awaiting your confirmation on:**
1. Profiles table structure
2. Desired login flow
3. Server validation approach

Then implementation will take ~30 minutes and require ~10 lines of code changes.
