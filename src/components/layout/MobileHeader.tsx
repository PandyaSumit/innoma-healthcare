import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader = ({ onMenuClick }: MobileHeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const displayName = user?.profile?.name || 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const roleLabel = user?.role === 'therapist' ? 'Therapist' : 'Patient';

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 lg:px-6 z-30">
      {/* Left: Menu Button + Logo (Mobile) */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo visible on mobile only */}
        <Link to="/" className="lg:hidden no-underline">
          <span className="text-base sm:text-lg font-bold tracking-tight text-brand-blue">
            Innoma <span className="text-brand-orange">HC</span>
          </span>
        </Link>

        {/* Desktop: Just a toggle button */}
        <button
          onClick={onMenuClick}
          className="hidden lg:block p-2 text-gray-600 hover:text-gray-900 hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Right: Profile Button */}
      <button
        onClick={() => navigate('/profile')}
        className={`flex items-center gap-2 sm:gap-3 hover:bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all border-none bg-transparent cursor-pointer ${
          location.pathname === '/profile' ? 'bg-blue-50 ring-2 ring-blue-100' : ''
        }`}
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-900 m-0 truncate max-w-[140px]">{displayName}</p>
          <p className="text-xs text-gray-500 m-0">{roleLabel}</p>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
          <span className="text-blue-600 font-bold text-xs sm:text-sm">{initials}</span>
        </div>
      </button>
    </header>
  );
};

export default MobileHeader;
