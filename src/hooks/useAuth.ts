import { useAuth } from '../context/AuthContext';

export { useAuth };

export function useRole() {
  return useAuth().user?.role ?? null;
}

export function useIsPatient() {
  return useAuth().user?.role === 'patient';
}

export function useIsTherapist() {
  return useAuth().user?.role === 'therapist';
}

export function useIsAdmin() {
  return useAuth().user?.role === 'admin';
}
