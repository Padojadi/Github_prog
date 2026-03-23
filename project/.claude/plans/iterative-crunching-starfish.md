# VIP Lounge Management and Booking App - Implementation Plan

## Overview
A comprehensive VIP Lounge management and booking application with user authentication, lounge inventory management, reservation system, and administrative dashboard.

## Tech Stack
- **Frontend**: Next.js 13 (App Router) + React + TypeScript
- **UI Components**: shadcn/ui (47 pre-configured components available)
- **Styling**: Tailwind CSS with dark mode support
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth (email/password)
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **Notifications**: Sonner toast system

## Database Schema

### 1. Users (Supabase Auth + Extended Profile)
- Uses Supabase `auth.users` table
- Extended `profiles` table:
  - `id` (uuid, FK to auth.users)
  - `email` (text)
  - `full_name` (text)
  - `role` (enum: 'admin', 'staff', 'guest')
  - `phone` (text, optional)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

### 2. Lounges
- `id` (uuid, primary key)
- `name` (text, unique)
- `description` (text)
- `capacity` (integer)
- `amenities` (jsonb - array of amenities)
- `hourly_rate` (decimal)
- `image_url` (text, optional)
- `status` (enum: 'active', 'maintenance', 'inactive')
- `location` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 3. Bookings
- `id` (uuid, primary key)
- `lounge_id` (uuid, FK to lounges)
- `user_id` (uuid, FK to auth.users)
- `start_time` (timestamptz)
- `end_time` (timestamptz)
- `num_guests` (integer)
- `status` (enum: 'pending', 'confirmed', 'cancelled', 'completed')
- `total_amount` (decimal)
- `special_requests` (text, optional)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 4. Amenities (Reference table)
- `id` (uuid, primary key)
- `name` (text)
- `icon` (text, lucide icon name)
- `description` (text)

## Core Features

### 1. Authentication System
- Email/password registration and login
- Role-based access control (admin, staff, guest)
- Protected routes for authenticated users
- Profile management

### 2. Lounge Management (Admin/Staff)
- Create, read, update, delete lounges
- Upload lounge images
- Manage amenities
- Set availability and pricing
- Mark lounges for maintenance

### 3. Booking System (All Users)
- Browse available lounges with filters
- View lounge details and amenities
- Check real-time availability
- Create new bookings with date/time picker
- View booking confirmation
- Cancel bookings (with restrictions)

### 4. Dashboard
- **Admin Dashboard**:
  - Overview statistics (total bookings, revenue, occupancy)
  - Recent bookings list
  - Lounge status overview
  - User management
- **Guest Dashboard**:
  - Upcoming bookings
  - Booking history
  - Quick book favorite lounges

### 5. Availability Calendar
- Visual calendar showing lounge availability
- Day/week/month views
- Click to book available slots
- Color-coded status indicators

## File Structure

```
/app
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx
├── (dashboard)/
│   ├── admin/
│   │   ├── page.tsx (admin dashboard)
│   │   ├── lounges/
│   │   │   ├── page.tsx (lounge list)
│   │   │   ├── new/page.tsx (create lounge)
│   │   │   └── [id]/
│   │   │       ├── page.tsx (lounge details)
│   │   │       └── edit/page.tsx (edit lounge)
│   │   ├── bookings/
│   │   │   ├── page.tsx (all bookings)
│   │   │   └── [id]/page.tsx (booking details)
│   │   └── users/page.tsx (user management)
│   ├── bookings/
│   │   ├── page.tsx (user's bookings)
│   │   ├── new/page.tsx (create booking)
│   │   └── [id]/page.tsx (booking details)
│   └── layout.tsx (dashboard layout with nav)
├── lounges/
│   ├── page.tsx (public lounge listing)
│   └── [id]/page.tsx (lounge details)
├── page.tsx (landing page)
└── layout.tsx (root layout)

/components
├── auth/
│   ├── login-form.tsx
│   ├── register-form.tsx
│   └── auth-provider.tsx
├── bookings/
│   ├── booking-form.tsx
│   ├── booking-card.tsx
│   └── booking-list.tsx
├── lounges/
│   ├── lounge-card.tsx
│   ├── lounge-form.tsx
│   ├── lounge-list.tsx
│   └── lounge-filters.tsx
├── dashboard/
│   ├── stats-card.tsx
│   └── recent-bookings.tsx
├── layout/
│   ├── header.tsx
│   └── nav.tsx
└── ui/ (existing 47 components)

/lib
├── supabase/
│   ├── client.ts (browser client)
│   └── server.ts (server client)
├── types/
│   ├── database.ts (Supabase types)
│   ├── booking.ts
│   └── lounge.ts
├── validations/
│   ├── booking-schema.ts
│   └── lounge-schema.ts
└── hooks/
    ├── use-auth.ts
    └── use-bookings.ts

/supabase/migrations
├── 001_create_profiles.sql
├── 002_create_lounges.sql
├── 003_create_bookings.sql
└── 004_create_amenities.sql
```

## Implementation Steps

### Phase 1: Database & Auth Setup
1. Create Supabase migrations for all tables with RLS policies
2. Set up Supabase client configuration
3. Create authentication components (login/register)
4. Implement role-based access control

### Phase 2: Core Features
1. Build lounge management interface (admin)
2. Create public lounge browsing
3. Implement booking system with availability checking
4. Add booking management (view, cancel)

### Phase 3: Dashboard & Polish
1. Create admin and user dashboards
2. Add statistics and charts
3. Implement responsive layouts
4. Add loading states and error handling

## Critical Files

**Database Migrations**: /supabase/migrations/*.sql
**Supabase Setup**: /lib/supabase/client.ts, server.ts
**Auth Components**: /components/auth/*.tsx
**Lounge Components**: /components/lounges/*.tsx
**Booking Components**: /components/bookings/*.tsx
**Dashboard Pages**: /app/(dashboard)/*
**Public Pages**: /app/lounges/*, /app/page.tsx
**Type Definitions**: /lib/types/*.ts
**Validation Schemas**: /lib/validations/*.ts

## Security & RLS Policies

1. All tables have RLS enabled
2. Users can only view/modify their own bookings
3. Admins/staff have elevated privileges
4. Zod validation on all forms
5. Middleware protection for sensitive routes
