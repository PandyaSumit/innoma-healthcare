import { api } from './axios';
import type { PatientProfile, PatientDashboard, UpdatePatientPayload } from '../types/patient';

export async function fetchPatientProfile(): Promise<PatientProfile> {
  const { data } = await api.get('/patients/me');
  return data.data;
}

export async function updatePatientProfile(
  payload: UpdatePatientPayload,
): Promise<PatientProfile> {
  const { data } = await api.patch('/patients/me', payload);
  return data.data;
}

export async function uploadPatientAvatar(file: File): Promise<{ avatarUrl: string }> {
  const form = new FormData();
  form.append('avatar', file);
  const { data } = await api.post('/patients/me/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function fetchPatientDashboard(): Promise<PatientDashboard> {
  const { data } = await api.get('/patients/me/dashboard');
  return data.data;
}
