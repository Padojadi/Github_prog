/*
  Warnings:

  - You are about to drop the column `paymentIntentId` on the `Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "paymentIntentId",
ADD COLUMN     "paydunyatoken" TEXT;
