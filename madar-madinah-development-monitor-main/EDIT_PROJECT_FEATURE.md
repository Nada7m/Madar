# Edit Project Feature - Implementation Guide

## Overview
This document describes the project editing functionality that has been added to the Madar platform. The feature allows authorized employees to edit existing project data through a user-friendly modal interface.

## Components Implemented

### 1. **EditProjectModal Component** (`src/components/EditProjectModal.tsx`)

A comprehensive modal dialog component for editing project information with the following features:

#### Features:
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **RTL Layout**: Fully compatible with Arabic right-to-left text direction
- **Form Validation**: Validates all inputs before submission
- **Real-time Feedback**: Shows success/error messages
- **Loading State**: Disables inputs and shows "جاري التحديث..." during save

#### Editable Fields:
1. **Project Name** (`project_name`) - Required
2. **Description** (`description`) - Required, textarea
3. **Project Type/Category** (`category`) - Dropdown, required
4. **Status** (`status`) - Dropdown (مكتمل, قيد التنفيذ, مخطط), required
5. **Completion Percentage** (`progress`) - Slider (0-100%), required
6. **Start Date** (`start_date`) - Text input (e.g., "2024م")
7. **End Date** (`end_date`) - Text input (e.g., "2026م")
8. **Responsible Entity** (`owner_entity`) - Text input, required
9. **Executing Entity** (`executor_entity`) - Text input (optional)
10. **Area Value** (`area_value`) - Text input
11. **Area Unit** (`area_unit`) - Dropdown (م², كم², هكتار)
12. **Location Latitude** (`latitude`) - Decimal number
13. **Location Longitude** (`longitude`) - Decimal number

#### Component Props:
```typescript
interface EditProjectModalProps {
  project: Project;           // Current project data
  isOpen: boolean;           // Modal visibility state
  onClose: () => void;       // Callback to close modal
  onSuccess: () => void;     // Callback after successful save
}
```

### 2. **Database Function** (`src/lib/supabase.ts`)

Added `updateProject()` function for backend operations:

```typescript
export async function updateProject(
  projectId: string,
  updates: {
    project_name?: string;
    category?: string;
    description?: string;
    progress?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
    duration_years?: number;
    owner_entity?: string;
    executor_entity?: string;
    area_value?: string;
    area_unit?: string;
    latitude?: number;
    longitude?: number;
  },
): Promise<void>
```

**Features:**
- Direct update to Supabase `projects` table
- No duplicate project creation
- Single, atomic update operation
- Error handling for network/database issues

### 3. **Project Details Page** (`src/routes/projects.$id.tsx`)

Enhanced with edit functionality:

#### Changes:
- Added "تعديل المشروع" button in header (visible only for employees)
- Integrated `EditProjectModal` component
- Added modal state management
- Automatic page refresh on successful update

#### Edit Button:
- Only visible to users with `isEmployee()` = true
- Positioned in project header next to export button
- Uses primary green color to indicate interactive element
- Icon: Pencil (edit icon)

## Usage Flow

### For Employees:

1. **Navigate to Project Details**
   - Click on any project from map, list, or statistics pages

2. **Click "تعديل المشروع" Button**
   - Button appears only if user is logged in as employee
   - Located in project header area

3. **Edit Form Opens**
   - Modal slides up from bottom (mobile) or appears centered (desktop)
   - Current project data pre-fills all form fields
   - User can edit any field

4. **Modify Project Data**
   - Update project name, description, status, etc.
   - Adjust completion percentage with slider
   - Update coordinates if location changed

5. **Save Changes**
   - Click "حفظ التغييرات" button
   - Form validates all required fields
   - Shows error message if validation fails

6. **Confirmation**
   - Success message displays: "تم تحديث المشروع بنجاح!"
   - Page automatically refreshes (1.5 second delay)
   - All changes reflect in real-time across app

### For Other Users:

- No "تعديل المشروع" button appears
- Cannot access edit functionality
- Can only view project information

## Validation Rules

### Required Fields:
- Project Name (must not be empty)
- Description (must not be empty)
- Project Category (must select one)
- Project Status (must select one)
- Responsible Entity (must not be empty)

### Optional Fields:
- All other fields are optional

### Numeric Validation:
- Progress: 0-100 (inclusive)
- Latitude: Valid decimal number
- Longitude: Valid decimal number

### Error Handling:
- Shows specific Arabic error messages for each validation failure
- Prevents form submission if validation fails
- Displays Supabase errors in user-friendly format

## Technical Implementation Details

### State Management:
- Uses React `useState` hooks for form data and modal state
- Local component state for form validation and error handling
- No external state management library required

### Database Integration:
- Uses Supabase JavaScript client
- Direct table updates with proper column mapping
- Handles status/category code conversion (Arabic ↔ database codes)

### UI/UX Features:
- Smooth animations using CSS transitions
- Loading state with disabled inputs
- Success/error toast notifications
- RTL-aware modal layout
- Mobile-first responsive design

### Performance:
- Form validation is synchronous (instant feedback)
- API call only happens on valid form submission
- Page reload refreshes data from database
- No unnecessary re-renders

## Status and Category Mapping

### Status Values:
```
Database          Display (Arabic)
"completed"      ↔ "مكتمل"
"in_progress"    ↔ "قيد التنفيذ"
"planned"        ↔ "مخطط"
```

### Category Values:
- صحي (Health)
- تجاري (Commercial)
- نقل و مواصلات (Transport & Logistics)
- تراثي و سياحي (Heritage & Tourism)
- تعليم (Education)
- ترفيهي (Entertainment)
- ترفيهي و أنسنة (Entertainment & Humanization)
- محمية (Protected Area)
- استثماري (Investment)
- سكني استثماري (Residential Investment)
- فندقي (Hotel)
- بنية تحتية (Infrastructure)

## Permission System

### Employee Access:
- Function: `isEmployee()` from `src/lib/auth.ts`
- Checks: `localStorage.getItem('madar_role') === 'employee'`
- Feature: Full edit access to all project fields

### Guest/Other Access:
- Function: `isEmployee()` returns false
- Feature: No edit button shown
- Behavior: View-only access to project information

## Error Scenarios

### Handled Errors:
1. **Validation Errors**
   - Empty required fields → "field مطلوب"
   - Invalid progress → "نسبة الإنجاز يجب أن تكون بين 0 و 100"
   - Invalid coordinates → "field يجب أن يكون رقماً صحيحاً"

2. **Network/Database Errors**
   - Connection issues → "حدث خطأ أثناء تحديث المشروع"
   - Supabase errors → Displays error message from API

3. **Recovery**
   - User can close modal and retry
   - Form data is preserved during error
   - No partial updates occur

## Testing Checklist

- [x] Form appears only for employees
- [x] All fields populate correctly from existing project data
- [x] Validation works for required fields
- [x] Progress slider updates value display
- [x] Status/category dropdowns work correctly
- [x] Coordinates accept decimal numbers
- [x] Submit button triggers API call
- [x] Success message appears after save
- [x] Page refreshes with new data
- [x] Modal closes on success
- [x] Error messages display correctly
- [x] RTL layout renders properly
- [x] Responsive design works on mobile/tablet/desktop

## Integration with Other Features

### Map Page (`src/routes/map.tsx`)
- Edit button changes project data
- Map markers refresh after update
- Clicking marker navigates to updated project

### Projects List (`src/routes/projects.index.tsx`)
- Project cards show updated information
- Status colors update immediately
- Category labels reflect changes

### Statistics Page (`src/routes/statistics.tsx`)
- Statistics recalculate after project update
- Charts and graphs refresh automatically

### Reports Page (`src/routes/reports.tsx`)
- PDF/Excel exports include updated project data
- QR codes map to updated coordinates

## Future Enhancements

1. **Image Management**
   - Add/remove project images in edit form
   - Upload images from device or URL

2. **Batch Editing**
   - Edit multiple projects at once
   - Apply changes to selected projects

3. **Edit History**
   - Track project modifications
   - Show who edited what and when
   - Ability to revert to previous versions

4. **Draft Saving**
   - Auto-save form progress
   - Resume editing if interrupted

5. **Advanced Validation**
   - Date range validation
   - Duplicate name detection
   - Coordinate bounds checking

## Files Modified

1. **src/components/EditProjectModal.tsx** (NEW)
   - 280+ lines of React/TypeScript code
   - Complete form with validation

2. **src/lib/supabase.ts**
   - Added `updateProject()` function
   - 30+ lines of code

3. **src/routes/projects.$id.tsx**
   - Added imports for edit modal and auth
   - Added state management for modal
   - Added edit button to header
   - Integrated modal component
   - ~150 lines modified

## Styling and Design

### Color Scheme:
- **Primary (Green)**: `#3f7358` - Edit button
- **Gold**: `#c9a961` - Accent colors
- **Borders**: `border-input` - Form borders
- **Backgrounds**: `bg-background` - Modal background

### Typography:
- **Title**: Bold, large (project name)
- **Labels**: Medium, muted foreground
- **Inputs**: Regular, foreground text
- **Buttons**: Semibold, white text on colored background

### Spacing:
- **Padding**: Consistent 6px-20px depending on element
- **Gaps**: 3-4px between form elements
- **Margins**: Standard Tailwind spacing

### Responsive Breakpoints:
- **Mobile**: Full width, bottom sheet modal
- **Tablet**: Max width 2xl, centered
- **Desktop**: Max width 2xl, centered with shadow

## Support and Documentation

For questions or issues with the edit feature:
1. Check form validation errors
2. Verify employee role is set
3. Check browser console for network errors
4. Verify Supabase connection
5. Ensure database schema has all required columns

---

**Implementation Date**: July 28, 2026  
**Developer**: Copilot  
**Status**: Production Ready
