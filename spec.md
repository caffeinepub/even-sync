# Even Sync

## Current State
The app has a dashboard with Events, Venues, Vendors, Bookings, Reports, and Settings pages. There is no profile management feature.

## Requested Changes (Diff)

### Add
- Profile page where users can view and edit their name, email, phone, company, and bio
- Profile avatar with initials display
- "Profile" navigation item in the sidebar

### Modify
- App.tsx to include the Profile page route
- Layout to add Profile nav item

### Remove
- Nothing

## Implementation Plan
1. Create a Profile page component with a form to view/edit user profile fields (name, email, phone, company, bio)
2. Store profile data in localStorage for persistence
3. Add Profile to the Page type and navigation in Layout
4. Wire Profile page in App.tsx
