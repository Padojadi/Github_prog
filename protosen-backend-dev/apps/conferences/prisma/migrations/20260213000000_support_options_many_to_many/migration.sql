-- CreateTable
CREATE TABLE "ParticipantSupportOption" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "supportOptionId" TEXT NOT NULL,

    CONSTRAINT "ParticipantSupportOption_pkey" PRIMARY KEY ("id")
);

-- Migrate existing data
INSERT INTO "ParticipantSupportOption" ("id", "participantId", "supportOptionId")
SELECT gen_random_uuid(), "id", "supportOptionId"
FROM "Participant"
WHERE "supportOptionId" IS NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantSupportOption_participantId_supportOptionId_key" ON "ParticipantSupportOption"("participantId", "supportOptionId");

-- AddForeignKey
ALTER TABLE "ParticipantSupportOption" ADD CONSTRAINT "ParticipantSupportOption_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantSupportOption" ADD CONSTRAINT "ParticipantSupportOption_supportOptionId_fkey" FOREIGN KEY ("supportOptionId") REFERENCES "SupportOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT IF EXISTS "Participant_supportOptionId_fkey";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "supportOptionId";
