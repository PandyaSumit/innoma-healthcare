import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FullPageSpinner } from '../ui/Spinner';

const roleHome: Record<string, string> = {
  patient: '/dashboard',
  therapist: '/dashboard',
  admin: '/admin',
};

/**
 * Routes accessible only when NOT logged in (login, signup).
 * Authenticated users are redirected to their role-based home.
 */
export default function PublicOnlyRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <FullPageSpinner />;
  if (user) {
    const home = roleHome[user.role] ?? '/dashboard';
    return <Navigate to={home} replace />;
  }
  return <Outlet />;
}
