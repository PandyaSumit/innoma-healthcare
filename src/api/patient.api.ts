import { api } from './axios';
import type { PatientProfile, PatientDashboard, UpdatePatientPayload } from '../types/patient';

export async function fetchPatientProfile(): Promise<PatientProfile> {
  const { data } = await api.get('/patient/profile');
  return data.data;
}

export async function updatePatientProfile(
  payload: UpdatePatientPayload,
): Promise<PatientProfile> {
  const { data } = await api.patch('/patient/profile', payload);
  return data.data;
}

export async function uploadPatientAvatar(file: File): Promise<{ avatarUrl: string }> {
  const form = new FormData();
  form.append('avatar', file);
  const { data } = await api.post('/patient/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function fetchPatientDashboard(): Promise<PatientDashboard> {
  const { data } = await api.get('/patient/dashboard');
  return data.data;
}
