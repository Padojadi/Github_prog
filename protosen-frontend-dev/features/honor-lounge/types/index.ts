export type LoungeStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE";
export type LoungeBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";
export type LoungePaymentMethod = "ONLINE" | "ON_SITE";
export type LoungePaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export type LoungeTimeSlot = {
  start: string;
  end: string;
};

export type Lounge = {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  amenities: string[];
  hourlyRate: number;
  imageUrl: string | null;
  status: LoungeStatus;
  location: string;
  loungeType: string | null;
  maxBookings: number | null;
  availableDays: string[];
  timeSlots: LoungeTimeSlot[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type LoungeBookingHistory = {
  id: string;
  bookingId: string;
  action: string;
  oldStatus: LoungeBookingStatus | null;
  newStatus: LoungeBookingStatus | null;
  notes: string | null;
  processedBy: string | null;
  createdAt: string;
};

export type LoungeBooking = {
  id: string;
  loungeId: string;
  userId: string;
  startTime: string;
  endTime: string;
  numGuests: number;
  status: LoungeBookingStatus;
  totalAmount: number;
  specialRequests: string | null;
  adminNotes: string | null;
  processedBy: string | null;
  processedAt: string | null;
  paymentMethod: LoungePaymentMethod;
  paymentStatus: LoungePaymentStatus;
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
  companions: Record<string, unknown>[];
  createdAt: string;
  updatedAt: string;
  lounge?: Lounge;
  histories?: LoungeBookingHistory[];
};

export type LoungeListResponse = {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: Lounge[];
};

export type LoungeBookingListResponse = {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: LoungeBooking[];
};

export const getLoungeStatusLabel = (status: LoungeStatus) => {
  if (status === "ACTIVE") {
    return "Actif";
  }
  if (status === "MAINTENANCE") {
    return "Maintenance";
  }
  return "Inactif";
};

