-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "conferenceParticipantTypeId" TEXT,
ADD COLUMN     "customFunction" TEXT,
ADD COLUMN     "functionId" TEXT,
ADD COLUMN     "supportOptionId" TEXT;

-- CreateTable
CREATE TABLE "FunctionModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FunctionModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportOption" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "SupportOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantType" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "ParticipantType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConferenceParticipantType" (
    "id" TEXT NOT NULL,
    "conferenceId" TEXT NOT NULL,
    "participantTypeId" TEXT NOT NULL,
    "requiresValidation" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConferenceParticipantType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FunctionModel_name_key" ON "FunctionModel"("name");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_functionId_fkey" FOREIGN KEY ("functionId") REFERENCES "FunctionModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_supportOptionId_fkey" FOREIGN KEY ("supportOptionId") REFERENCES "SupportOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_conferenceParticipantTypeId_fkey" FOREIGN KEY ("conferenceParticipantTypeId") REFERENCES "ConferenceParticipantType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConferenceParticipantType" ADD CONSTRAINT "ConferenceParticipantType_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConferenceParticipantType" ADD CONSTRAINT "ConferenceParticipantType_participantTypeId_fkey" FOREIGN KEY ("participantTypeId") REFERENCES "ParticipantType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
