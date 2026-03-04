import { api } from './axios';
import type { Therapist } from '../data/therapists'; // Reusing the type for now, or we can define a more specific one if needed

export interface TherapistFilters {
  q?: string;
  specialization?: string;
  language?: string;
  feeMin?: number;
  feeMax?: number;
  minRating?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedTherapists {
  data: Therapist[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
  };
}

export async function fetchTherapists(params: TherapistFilters = {}): Promise<PaginatedTherapists> {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      q.set(key, String(value));
    }
  });
  const { data } = await api.get(`/therapists?${q}`);
  return data;
}

export async function fetchTherapistById(id: string): Promise<Therapist> {
  const { data } = await api.get(`/therapists/${id}`);
  return data.data;
}

export async function fetchTherapistMe(): Promise<Therapist> {
  const { data } = await api.get('/therapists/me');
  return data.data;
}

export async function updateTherapistMe(payload: Partial<Therapist>): Promise<Therapist> {
  const { data } = await api.put('/therapists/me', payload);
  return data.data;
}

export async function fetchTherapistDashboard(): Promise<any> {
  const { data } = await api.get('/therapists/me/dashboard');
  return data.data;
}
