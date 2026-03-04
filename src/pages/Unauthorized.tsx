import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Unauthorized() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const home = user?.role === 'admin'
    ? '/admin'
    : user
    ? '/dashboard'
    : '/login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-healthcare-surface/30 p-6">
      <div className="w-full max-w-md text-center animate-fade-in">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-healthcare-text mb-3">Access Denied</h1>
        <p className="text-healthcare-text-muted mb-8">
          You don't have permission to view this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl border border-healthcare-neutral/20 text-healthcare-text font-bold hover:bg-healthcare-surface transition-all cursor-pointer bg-white"
          >
            Go Back
          </button>
          <Link
            to={home}
            className="px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:opacity-90 transition-all no-underline"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
