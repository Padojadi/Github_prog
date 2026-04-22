export type VisaWorkflowStatus =
  | "SUBMITTED"
  | "AUTO_VERIFIED"
  | "VALIDATED"
  | "REJECTED"
  | "NOTIFIED"
  | "ISSUED"
  | "WITHDRAWN";

export type VisaValidationDecision = "APPROVE" | "REJECT";

export type VisaStatusHistory = {
  id: string;
  visaRequestId: string;
  status: VisaWorkflowStatus;
  changedBy: string;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type VisaRequest = {
  id: string;
  dossierNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  visaType: string;
  documents: string;
  currentStatus: VisaWorkflowStatus;
  validationDecision: VisaValidationDecision | null;
  automaticScore: number | null;
  dpiAnalysis: string | null;
  rejectionReason: string | null;
  visaNumber: string | null;
  notificationSentAt: string | null;
  issuedAt: string | null;
  withdrawnAt: string | null;
  collectorName: string | null;
  collectorIdentityDocument: string | null;
  collectorSignature: string | null;
  withdrawalDate: string | null;
  createdBy: string;
  validatedBy: string | null;
  emittedBy: string | null;
  withdrawnBy: string | null;
  createdAt: string;
  updatedAt: string;
  histories?: VisaStatusHistory[];
};

export type VisaListResponse = {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: VisaRequest[];
};

export type VisaKpiSummary = {
  total: number;
  submitted: number;
  autoVerified: number;
  validated: number;
  rejected: number;
  notified: number;
  issued: number;
  withdrawn: number;
  rejectionRate: number;
  deliveryRate: number;
  avgProcessingHours: number;
};

export type VisaSearchParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: VisaWorkflowStatus;
  decision?: VisaValidationDecision;
  dossierNumber?: string;
  visaNumber?: string;
};

export type CreateVisaRequestPayload = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  visaType: string;
  documents: string;
};

export type ValidateVisaPayload = {
  dossierNumber: string;
  automaticScore?: number;
  dpiAnalysis: string;
  decision: VisaValidationDecision;
  rejectionReason?: string;
};

export type IssueVisaPayload = {
  dossierNumber: string;
  visaNumber?: string;
  issuedAt?: string;
  notes?: string;
};

export type WithdrawVisaPayload = {
  visaNumber: string;
  collectorName: string;
  collectorIdentityDocument: string;
  collectorSignature: string;
  withdrawalDate: string;
};

export type UpdateVisaRequestPayload = Partial<CreateVisaRequestPayload> & {
  automaticScore?: number;
  dpiAnalysis?: string;
  rejectionReason?: string;
};

export const getVisaStatusLabel = (status: VisaWorkflowStatus) => {
  const labels: Record<VisaWorkflowStatus, string> = {
    SUBMITTED: "Soumise",
    AUTO_VERIFIED: "Verifiee auto",
    VALIDATED: "Validee",
    REJECTED: "Rejetee",
    NOTIFIED: "Notifiee",
    ISSUED: "Emise",
    WITHDRAWN: "Retiree",
  };
  return labels[status];
};

export const getVisaStatusBadgeClass = (status: VisaWorkflowStatus) => {
  if (status === "WITHDRAWN") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (status === "ISSUED") {
    return "bg-sky-100 text-sky-700";
  }
  if (status === "VALIDATED" || status === "NOTIFIED") {
    return "bg-blue-100 text-blue-700";
  }
  if (status === "REJECTED") {
    return "bg-red-100 text-red-700";
  }
  if (status === "AUTO_VERIFIED") {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-slate-100 text-slate-700";
};
