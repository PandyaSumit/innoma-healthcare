import { api } from "./axios";
import type { Therapist } from "../data/therapists";

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

export async function fetchTherapists(
  params: TherapistFilters = {},
): Promise<PaginatedTherapists> {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      q.set(key, String(value));
    }
  });
  const { data } = await api.get(`/therapists?${q}`);
  return {
    data: data.data,
    meta: data.meta,
  };
}

export async function fetchTherapistById(id: string): Promise<Therapist> {
  const { data } = await api.get(`/therapists/${id}`);
  return data.data;
}

export async function fetchTherapistMe(): Promise<Therapist> {
  const { data } = await api.get("/therapists/me/profile");
  return data.data;
}

export async function updateTherapistMe(
  payload: Partial<Therapist>,
): Promise<Therapist> {
  const { data } = await api.put("/therapists/me/profile", payload);
  return data.data;
}

export async function fetchTherapistDashboard(): Promise<any> {
  const { data } = await api.get("/therapists/me/dashboard");
  return data.data;
}

export async function uploadTherapistAvatar(
  file: File,
): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await api.post("/therapists/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function fetchMyAvailability(): Promise<any[]> {
  const { data } = await api.get(`/therapists/me/availability`);
  return data.data;
}

export async function updateMyAvailability(schedule: any[]): Promise<void> {
  await api.put("/therapists/me/availability", { schedule });
}

export async function fetchMypatientsProfile(id: any[]): Promise<void> {
  const { data } = await api.get(`/therapists/me/patients/${id}`);
  return data.data;
}
