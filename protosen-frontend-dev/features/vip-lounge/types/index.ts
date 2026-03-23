export type VipLoungeStatus = "active" | "maintenance" | "inactive";
export type VipBookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type VipAccessRequestStatus = "pending" | "approved" | "rejected";

export type VipTimeSlot = {
	start: string;
	end: string;
};

export type VipLounge = {
	id: string;
	name: string;
	description: string | null;
	capacity: number;
	amenities: string[];
	hourlyRate: number;
	imageUrl: string | null;
	status: VipLoungeStatus;
	location: string;
	availableDays: string[];
	timeSlots: VipTimeSlot[];
	createdAt: string;
	updatedAt: string;
};

export type VipBooking = {
	id: string;
	loungeId: string | null;
	userId: string;
	startTime: string;
	endTime: string;
	numGuests: number;
	status: VipBookingStatus;
	totalAmount: number;
	specialRequests: string | null;
	adminNotes: string | null;
	processedBy: string | null;
	processedAt: string | null;
	paymentMethod: "online" | "on_site";
	paymentStatus: "pending" | "completed" | "failed";
	qrCodeData: string | null;
	guestFirstName: string | null;
	guestLastName: string | null;
	guestFunction: string | null;
	guestPhone: string | null;
	guestOrganization: string | null;
	guestNationality: string | null;
	airline: string | null;
	flightNumber: string | null;
	flightOrigin: string | null;
	flightArrivalTime: string | null;
	createdAt: string;
	updatedAt: string;
	lounge: {
		id: string;
		name: string;
		location: string;
		status: VipLoungeStatus;
	} | null;
};

export type VipAccessRequest = {
	id: string;
	userId: string;
	firstName: string;
	lastName: string;
	function: string;
	phone: string;
	organization: string;
	nationality: string;
	passportType: string;
	passportNumber: string;
	travelPurpose: string | null;
	companionType: "Famille" | "Délégation" | "Autres" | "Aucun" | null;
	familyRelation: string | null;
	familyMembers: Record<string, unknown>[];
	delegationMembers: Record<string, unknown>[];
	airline: string | null;
	flightNumber: string | null;
	flightOrigin: string | null;
	flightArrivalTime: string | null;
	startTime: string;
	endTime: string;
	specialRequests: string | null;
	status: VipAccessRequestStatus;
	adminNotes: string | null;
	processedBy: string | null;
	processedAt: string | null;
	createdAt: string;
	updatedAt: string;
};

export type CreateVipBookingPayload = {
	loungeId: string;
	startTime: string;
	endTime: string;
	numGuests: number;
	specialRequests?: string;
	paymentMethod?: "online" | "on_site";
};

export type CreateVipAccessRequestPayload = {
	firstName: string;
	lastName: string;
	function: string;
	phone: string;
	organization: string;
	nationality: string;
	passportType: string;
	passportNumber: string;
	travelPurpose?: string;
	companionType?: "Famille" | "Délégation" | "Autres" | "Aucun";
	familyRelation?: string;
	familyMembers?: Record<string, unknown>[];
	delegationMembers?: Record<string, unknown>[];
	airline?: string;
	flightNumber?: string;
	flightOrigin?: string;
	flightArrivalTime?: string;
	startTime: string;
	endTime: string;
	specialRequests?: string;
};

export type CreateVipLoungeInput = {
	name: string;
	description?: string;
	capacity: number;
	hourlyRate: number;
	location: string;
	status?: VipLoungeStatus;
	amenities?: string[];
	availableDays?: string[];
	timeSlots?: VipTimeSlot[];
	imageUrl?: string;
};

export type UpdateVipLoungeInput = Partial<CreateVipLoungeInput>;

export type UpdateVipBookingStatusInput = {
	status: VipBookingStatus;
	adminNotes?: string;
};

export type UpdateVipAccessRequestStatusInput = {
	status: VipAccessRequestStatus;
	adminNotes?: string;
};
