export type VisaWorkflowStatus =
	| "PENDING"
	| "ACCEPTED"
	| "EMITTED"
	| "WITHDRAWN"
	| "REJECTED"
	| "RETURNED";

export type VisaWorkflowAction =
	| "ACCEPT"
	| "REJECT"
	| "RETURN"
	| "EMIT"
	| "WITHDRAW"
	| "RESUBMIT";

export type VisaWorkflowRecord = {
	id: string;
	reference: string;
	applicantFirstName: string;
	applicantLastName: string;
	birthDate: string;
	nationality: string;
	passportNumber: string;
	visaType: string;
	documentsCount: number;
	status: VisaWorkflowStatus;
	statusReason: string | null;
	submittedAt: string;
	submittedBy: {
		id: string;
		name: string;
		role: string;
	};
	acceptedAt: string | null;
	acceptedBy: string | null;
	issuedAt: string | null;
	issuedBy: string | null;
	notifiedAt: string | null;
	withdrawnAt: string | null;
	withdrawnBy: string | null;
	updatedAt: string;
};

export type VisaCreateRequestPayload = {
	applicantFirstName: string;
	applicantLastName: string;
	birthDate: string;
	nationality: string;
	passportNumber: string;
	visaType: string;
	documentsCount: number;
};
