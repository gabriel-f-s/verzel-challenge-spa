import { api } from './api';

export interface EventData {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  location: string;
  date: string;
  type: string;
  capacity: number;
  price: number;
  externalSource?: string;
  externalApiId?: string;
}

export interface ImportEventPayload {
  externalId: string;
  source: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  type?: string;
}

export async function fetchEvents(): Promise<EventData[]> {
  const response = await api.get('/events');
  return response.data;
}

export async function importEvent(
  payload: ImportEventPayload,
): Promise<EventData> {
  const response = await api.post('/events/import', payload);
  return response.data;
}

export async function deleteEvent(id: string): Promise<void> {
  await api.delete(`/events/${id}`);
}
