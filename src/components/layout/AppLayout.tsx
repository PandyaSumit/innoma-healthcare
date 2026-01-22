import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { name: 'Appointments', path: '/appointments', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { name: 'Find Therapists', path: '/therapists', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
    { name: 'Profile', path: '/profile', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { name: 'Settings', path: '/settings', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { name: 'Support', path: '/support', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
  ];

  return (
    <div className="flex h-screen bg-healthcare-surface overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-healthcare-border transition-all duration-300 ease-in-out flex flex-col z-30`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <Link to="/" className="no-underline">
              <span className="text-xl font-bold tracking-tight text-brand-blue">
                Innoma <span className="text-brand-orange">HC</span>
              </span>
            </Link>
          ) : (
            <span className="text-xl font-bold text-brand-blue mx-auto">I</span>
          )}
        </div>

        <nav className="flex-grow px-3 mt-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center p-3 rounded-lg no-underline transition-colors ${
                location.pathname === item.path
                  ? 'bg-brand-blue/5 text-brand-blue'
                  : 'text-healthcare-text-muted hover:bg-healthcare-surface hover:text-healthcare-text'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="ml-3 font-semibold text-sm">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-healthcare-border">
          <button
            onClick={() => {
              localStorage.removeItem('innoma_user');
              navigate('/login');
            }}
            className="flex items-center w-full p-3 text-healthcare-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors bg-transparent border-none cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isSidebarOpen && <span className="ml-3 font-semibold text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-healthcare-border flex items-center justify-between px-8 z-20">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-healthcare-text-muted hover:text-healthcare-text transition-colors bg-brand-blue/5 rounded-md border-none cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button 
            onClick={() => navigate('/profile')}
            className={`flex items-center gap-4 hover:bg-healthcare-surface px-4 py-1 rounded-[10px] transition-all border-none bg-transparent cursor-pointer ${location.pathname === '/profile' ? 'bg-healthcare-surface ring-2 ring-brand-blue/20' : ''}`}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-healthcare-text m-0">User name</p>
              <p className="text-xs text-healthcare-text-muted m-0">Patient Account</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20">
              <span className="text-brand-blue font-bold">SP</span>
            </div>
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-grow overflow-auto p-8 flex flex-col">
          <div className="mx-auto flex-grow w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
