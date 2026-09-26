export interface EnquiryFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  travelDate?: string;
  numberOfGuests?: number;
  source?: string;
  tourId?: string;
  destination?: string;
  budgetBand?: string;
}

export type EnquiryStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "BOOKED" | "CLOSED_LOST";