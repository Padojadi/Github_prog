-- CreateEnum
CREATE TYPE "LoungeStatus" AS ENUM ('ACTIVE', 'MAINTENANCE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "LoungeBookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "LoungePaymentMethod" AS ENUM ('ONLINE', 'ON_SITE');

-- CreateEnum
CREATE TYPE "LoungePaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Lounge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "capacity" INTEGER NOT NULL,
    "amenities" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "hourlyRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "status" "LoungeStatus" NOT NULL DEFAULT 'ACTIVE',
    "location" TEXT NOT NULL,
    "loungeType" TEXT,
    "maxBookings" INTEGER,
    "availableDays" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "timeSlots" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lounge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoungeBooking" (
    "id" TEXT NOT NULL,
    "loungeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "numGuests" INTEGER NOT NULL,
    "status" "LoungeBookingStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "specialRequests" TEXT,
    "adminNotes" TEXT,
    "processedBy" TEXT,
    "processedAt" TIMESTAMP(3),
    "paymentMethod" "LoungePaymentMethod" NOT NULL DEFAULT 'ON_SITE',
    "paymentStatus" "LoungePaymentStatus" NOT NULL DEFAULT 'PENDING',
    "qrCodeData" TEXT,
    "guestFirstName" TEXT,
    "guestLastName" TEXT,
    "guestFunction" TEXT,
    "guestPhone" TEXT,
    "guestOrganization" TEXT,
    "guestNationality" TEXT,
    "airline" TEXT,
    "flightNumber" TEXT,
    "flightOrigin" TEXT,
    "flightArrivalTime" TIMESTAMP(3),
    "companions" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoungeBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoungeBookingHistory" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldStatus" "LoungeBookingStatus",
    "newStatus" "LoungeBookingStatus",
    "notes" TEXT,
    "processedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoungeBookingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LoungeBooking_loungeId_idx" ON "LoungeBooking"("loungeId");

-- CreateIndex
CREATE INDEX "LoungeBooking_userId_idx" ON "LoungeBooking"("userId");

-- CreateIndex
CREATE INDEX "LoungeBooking_status_idx" ON "LoungeBooking"("status");

-- CreateIndex
CREATE INDEX "LoungeBooking_startTime_endTime_idx" ON "LoungeBooking"("startTime", "endTime");

-- CreateIndex
CREATE INDEX "LoungeBookingHistory_bookingId_idx" ON "LoungeBookingHistory"("bookingId");

-- CreateIndex
CREATE INDEX "LoungeBookingHistory_createdAt_idx" ON "LoungeBookingHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "LoungeBooking" ADD CONSTRAINT "LoungeBooking_loungeId_fkey" FOREIGN KEY ("loungeId") REFERENCES "Lounge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoungeBookingHistory" ADD CONSTRAINT "LoungeBookingHistory_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "LoungeBooking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
