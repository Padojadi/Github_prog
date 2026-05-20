export type RegistrationWorkflowStatus =
	| "PENDING"
	| "MUTATION_VALIDATED"
	| "PERMIT_ISSUED"
	| "WITHDRAWN"
	| "CORRECTION_REQUIRED"
	| "REJECTED";

export type RegistrationWorkflowAction =
	| "VALIDATE_MUTATION"
	| "ISSUE_PERMIT"
	| "WITHDRAW"
	| "REQUEST_CORRECTION"
	| "REJECT"
	| "RESUBMIT";

export type RegistrationWorkflowRecord = {
	id: string;
	reference: string;
	applicantName: string;
	identityNumber: string;
	vehicleInfo: string;
	documentsCount: number;
	status: RegistrationWorkflowStatus;
	statusReason: string | null;
	submittedAt: string;
	submittedBy: {
		id: string;
		name: string;
		role: string;
	};
	mutationValidatedAt: string | null;
	mutationValidatedBy: string | null;
	permitIssuedAt: string | null;
	permitIssuedBy: string | null;
	withdrawnAt: string | null;
	withdrawnBy: string | null;
	updatedAt: string;
};

export type RegistrationCreateRequestPayload = {
	applicantName: string;
	identityNumber: string;
	vehicleInfo: string;
	documentsCount: number;
};
