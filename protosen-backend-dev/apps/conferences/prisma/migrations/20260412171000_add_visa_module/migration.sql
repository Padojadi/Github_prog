-- CreateEnum
CREATE TYPE "VisaWorkflowStatus" AS ENUM (
    'SUBMITTED',
    'AUTO_VERIFIED',
    'VALIDATED',
    'REJECTED',
    'NOTIFIED',
    'ISSUED',
    'WITHDRAWN'
);

-- CreateEnum
CREATE TYPE "VisaValidationDecision" AS ENUM ('APPROVE', 'REJECT');

-- CreateTable
CREATE TABLE "VisaRequest" (
    "id" TEXT NOT NULL,
    "dossierNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "visaType" TEXT NOT NULL,
    "documents" TEXT NOT NULL,
    "currentStatus" "VisaWorkflowStatus" NOT NULL DEFAULT 'SUBMITTED',
    "validationDecision" "VisaValidationDecision",
    "automaticScore" DOUBLE PRECISION,
    "dpiAnalysis" TEXT,
    "rejectionReason" TEXT,
    "visaNumber" TEXT,
    "notificationSentAt" TIMESTAMP(3),
    "issuedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "collectorName" TEXT,
    "collectorIdentityDocument" TEXT,
    "collectorSignature" TEXT,
    "withdrawalDate" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "validatedBy" TEXT,
    "emittedBy" TEXT,
    "withdrawnBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisaRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaStatusHistory" (
    "id" TEXT NOT NULL,
    "visaRequestId" TEXT NOT NULL,
    "status" "VisaWorkflowStatus" NOT NULL,
    "changedBy" TEXT NOT NULL,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisaStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisaRequest_dossierNumber_key" ON "VisaRequest"("dossierNumber");

-- CreateIndex
CREATE UNIQUE INDEX "VisaRequest_visaNumber_key" ON "VisaRequest"("visaNumber");

-- CreateIndex
CREATE INDEX "VisaRequest_currentStatus_idx" ON "VisaRequest"("currentStatus");

-- CreateIndex
CREATE INDEX "VisaRequest_createdBy_idx" ON "VisaRequest"("createdBy");

-- CreateIndex
CREATE INDEX "VisaRequest_passportNumber_idx" ON "VisaRequest"("passportNumber");

-- CreateIndex
CREATE INDEX "VisaRequest_visaNumber_idx" ON "VisaRequest"("visaNumber");

-- CreateIndex
CREATE INDEX "VisaStatusHistory_visaRequestId_idx" ON "VisaStatusHistory"("visaRequestId");

-- CreateIndex
CREATE INDEX "VisaStatusHistory_status_idx" ON "VisaStatusHistory"("status");

-- CreateIndex
CREATE INDEX "VisaStatusHistory_createdAt_idx" ON "VisaStatusHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "VisaStatusHistory" ADD CONSTRAINT "VisaStatusHistory_visaRequestId_fkey"
FOREIGN KEY ("visaRequestId") REFERENCES "VisaRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
