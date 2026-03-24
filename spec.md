# Even Sync

## Current State
The app has a Vendors page (admin-side) with a table and add/edit/delete dialogs. There is no public-facing vendor self-registration form. The workflow Step 1 (vendor self-registration portal) is listed as a missing feature.

## Requested Changes (Diff)

### Add
- New `VendorRegistration` page: a multi-field registration form for vendors to submit their details
- Fields: company name, contact person, email, phone, business category, company description, trade license number, website (optional)
- Form validation, success confirmation state
- New nav entry in sidebar: "Vendor Registration" with a ClipboardList icon
- New page type in Layout and App routing

### Modify
- `App.tsx`: add `vendor-registration` case and import
- `Layout.tsx`: add nav item and page title for `vendor-registration`

### Remove
- Nothing

## Implementation Plan
1. Create `src/frontend/src/pages/VendorRegistration.tsx` with the full registration form
2. Update `Layout.tsx` to add nav item and page title
3. Update `App.tsx` to import and route the new page
