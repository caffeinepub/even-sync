# Even Sync

## Current State
Empty project scaffold. Backend actor is empty, frontend has no UI.

## Requested Changes (Diff)

### Add
- Event management: create, view, update, delete events with name, date, venue, status
- Venue management: add and list venues with name, location, capacity
- Vendor management: add and list vendors with name, category, contact info
- Booking tracking: link vendors/venues to events, track booking status
- Dashboard overview: upcoming events count, total venues, total vendors

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Generate Motoko backend with events, venues, vendors, and bookings CRUD
2. Build frontend dashboard with sidebar navigation, overview stats, and management pages for events/venues/vendors
