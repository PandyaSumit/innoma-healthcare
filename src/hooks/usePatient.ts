import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchPatientProfile,
  updatePatientProfile,
  uploadPatientAvatar,
  fetchPatientDashboard,
} from '../api/patient.api';
import type { UpdatePatientPayload } from '../types/patient';

export function usePatientProfile() {
  return useQuery({
    queryKey: ['patient', 'profile'],
    queryFn: fetchPatientProfile,
  });
}

export function usePatientDashboard() {
  return useQuery({
    queryKey: ['patient', 'dashboard'],
    queryFn: fetchPatientDashboard,
  });
}

export function useUpdatePatientProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePatientPayload) => updatePatientProfile(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['patient', 'profile'] });
      toast.success('Profile updated successfully.');
    },
    onError: (err: any) => {
      toast.error(err.message ?? 'Failed to update profile.');
    },
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadPatientAvatar(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['patient', 'profile'] });
      toast.success('Avatar updated.');
    },
    onError: (err: any) => {
      toast.error(err.message ?? 'Failed to upload avatar.');
    },
  });
}
