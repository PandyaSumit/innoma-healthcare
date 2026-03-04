import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FullPageSpinner } from '../ui/Spinner';

interface RoleGuardProps {
  allowedRoles: ('patient' | 'therapist' | 'admin')[];
}

/** Renders children only if user.role is in allowedRoles; otherwise → /unauthorized */
export default function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <FullPageSpinner />;
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}
