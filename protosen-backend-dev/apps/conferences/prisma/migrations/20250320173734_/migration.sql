/*
  Warnings:

  - The values [CLOSED] on the enum `SubscriptionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "ConferenceStatus" ADD VALUE 'CLOSED';

-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionStatus_new" AS ENUM ('PROCESSING', 'REJECTED', 'PENDING_PAYMENT', 'PAID', 'CANCELLED', 'REFUNDED');
ALTER TABLE "Participant" ALTER COLUMN "subscriptionStatus" DROP DEFAULT;
ALTER TABLE "Participant" ALTER COLUMN "subscriptionStatus" TYPE "SubscriptionStatus_new" USING ("subscriptionStatus"::text::"SubscriptionStatus_new");
ALTER TABLE "SubscriptionStatusHistory" ALTER COLUMN "status" TYPE "SubscriptionStatus_new" USING ("status"::text::"SubscriptionStatus_new");
ALTER TYPE "SubscriptionStatus" RENAME TO "SubscriptionStatus_old";
ALTER TYPE "SubscriptionStatus_new" RENAME TO "SubscriptionStatus";
DROP TYPE "SubscriptionStatus_old";
ALTER TABLE "Participant" ALTER COLUMN "subscriptionStatus" SET DEFAULT 'PROCESSING';
COMMIT;
