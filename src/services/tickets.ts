import { api } from './api';

export type TicketStatus = 'RESERVED' | 'PAID' | 'VALIDATED' | 'CANCELLED';
export type ValidationStatus = 'VALID' | 'ALREADY_USED' | 'INVALID' | 'WRONG_EVENT';

export interface TicketData {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventImageUrl?: string;
  price: number;
  seatNumber?: string;
  status: TicketStatus;
  shareToken: string;
  qrCodeData: string;
  createdAt: string;
  validatedAt?: string;
}

export interface PurchaseTicketPayload {
  eventId: string;
  seatNumber?: string;
  simulatePaymentSuccess: boolean;
}

export interface ValidateTicketPayload {
  eventId: string;
  qrCodeData: string;
}

export interface ValidationResponse {
  status: ValidationStatus;
  message: string;
  ticket: {
    id: string;
    eventTitle?: string;
    seatNumber?: string;
    validatedAt?: string;
  } | null;
}

export async function purchaseTicket(data: PurchaseTicketPayload): Promise<TicketData> {
  const response = await api.post<TicketData>('/tickets/purchase', data);
  return response.data;
}

export async function getMyTickets(): Promise<TicketData[]> {
  const response = await api.get<TicketData[]>('/tickets/my-tickets');
  return response.data;
}

export async function getOccupiedSeats(eventId: string): Promise<string[]> {
  const response = await api.get<string[]>(`/tickets/event/${eventId}/occupied-seats`);
  return response.data;
}

export async function getSharedTicket(token: string): Promise<TicketData> {
  const response = await api.get<TicketData>(`/tickets/share/${token}`);
  return response.data;
}

export async function validateTicket(data: ValidateTicketPayload): Promise<ValidationResponse> {
  const response = await api.post<ValidationResponse>('/tickets/validate', data);
  return response.data;
}
