-- VIP Lounge module tables (PostgreSQL)
CREATE TABLE IF NOT EXISTS "vip_lounges" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "capacity" INTEGER NOT NULL DEFAULT 1,
  "amenities" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "hourly_rate" INTEGER NOT NULL DEFAULT 0,
  "image_url" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "location" TEXT NOT NULL,
  "available_days" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "time_slots" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "vip_bookings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "lounge_id" UUID REFERENCES "vip_lounges"("id") ON DELETE SET NULL,
  "user_id" UUID NOT NULL,
  "start_time" TIMESTAMPTZ NOT NULL,
  "end_time" TIMESTAMPTZ NOT NULL,
  "num_guests" INTEGER NOT NULL DEFAULT 1,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "total_amount" INTEGER NOT NULL DEFAULT 0,
  "special_requests" TEXT,
  "admin_notes" TEXT,
  "processed_by" UUID,
  "processed_at" TIMESTAMPTZ,
  "payment_method" TEXT NOT NULL DEFAULT 'on_site',
  "payment_status" TEXT NOT NULL DEFAULT 'pending',
  "qr_code_data" TEXT,
  "guest_first_name" TEXT,
  "guest_last_name" TEXT,
  "guest_function" TEXT,
  "guest_phone" TEXT,
  "guest_organization" TEXT,
  "guest_nationality" TEXT,
  "airline" TEXT,
  "flight_number" TEXT,
  "flight_origin" TEXT,
  "flight_arrival_time" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "vip_booking_history" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "booking_id" UUID NOT NULL REFERENCES "vip_bookings"("id") ON DELETE CASCADE,
  "action" TEXT NOT NULL,
  "old_status" TEXT,
  "new_status" TEXT,
  "notes" TEXT,
  "processed_by" UUID,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "vip_access_requests" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "function" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "organization" TEXT NOT NULL,
  "nationality" TEXT NOT NULL,
  "passport_type" TEXT NOT NULL,
  "passport_number" TEXT NOT NULL,
  "travel_purpose" TEXT,
  "companion_type" TEXT,
  "family_relation" TEXT,
  "family_members" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "delegation_members" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "airline" TEXT,
  "flight_number" TEXT,
  "flight_origin" TEXT,
  "flight_arrival_time" TIMESTAMPTZ,
  "start_time" TIMESTAMPTZ NOT NULL,
  "end_time" TIMESTAMPTZ NOT NULL,
  "special_requests" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "admin_notes" TEXT,
  "processed_by" UUID,
  "processed_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_vip_bookings_lounge_time"
  ON "vip_bookings" ("lounge_id", "start_time", "end_time");

CREATE INDEX IF NOT EXISTS "idx_vip_bookings_user_id"
  ON "vip_bookings" ("user_id");

CREATE INDEX IF NOT EXISTS "idx_vip_access_requests_user_id"
  ON "vip_access_requests" ("user_id");

CREATE INDEX IF NOT EXISTS "idx_vip_access_requests_status"
  ON "vip_access_requests" ("status");
