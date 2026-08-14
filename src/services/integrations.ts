import { api } from './api';

export interface ExternalEvent {
  externalId: string;
  source: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  location: string;
  type: string;
  capacity: number;
  price: number;
}

export async function searchTMDB(query: string): Promise<ExternalEvent[]> {
  const response = await api.get('/integrations/search', {
    params: { query, source: 'TMDB' },
  });
  return response.data;
}
