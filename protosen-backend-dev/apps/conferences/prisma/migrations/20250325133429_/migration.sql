/*
  Warnings:

  - A unique constraint covering the columns `[paydunyatoken]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Participant_paydunyatoken_key" ON "Participant"("paydunyatoken");
