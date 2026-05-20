export type ExonerationWorkflowStatus =
	| "PENDING"
	| "DPCT_VERIFIED"
	| "CUSTOMS_VALIDATED"
	| "EMITTED"
	| "TRANSFERRED"
	| "REJECTED"
	| "RETURNED";

export type ExonerationWorkflowAction =
	| "VERIFY_DPCT"
	| "VALIDATE_CUSTOMS"
	| "EMIT"
	| "TRANSFER"
	| "REJECT"
	| "RETURN"
	| "RESUBMIT";

export type ExonerationWorkflowRecord = {
	id: string;
	reference: string;
	dossierNumber: string;
	requestType: string;
	subject: string;
	documentsCount: number;
	status: ExonerationWorkflowStatus;
	statusReason: string | null;
	submittedAt: string;
	submittedBy: {
		id: string;
		name: string;
		role: string;
	};
	dpctVerifiedAt: string | null;
	dpctVerifiedBy: string | null;
	customsValidatedAt: string | null;
	customsValidatedBy: string | null;
	emittedAt: string | null;
	emittedBy: string | null;
	transferredAt: string | null;
	transferredBy: string | null;
	updatedAt: string;
};

export type ExonerationCreateRequestPayload = {
	dossierNumber: string;
	requestType: string;
	subject: string;
	documentsCount: number;
};
