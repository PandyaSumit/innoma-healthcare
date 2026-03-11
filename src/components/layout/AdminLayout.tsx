import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

function NavIcon({ d }: { d: string }) {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d={d}
      />
    </svg>
  );
}

const NAV: NavItem[] = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: (
      <NavIcon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    ),
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: (
      <NavIcon d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    ),
  },
  {
    to: "/admin/therapists",
    label: "Therapists",
    icon: (
      <NavIcon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    ),
  },
  {
    to: "/admin/finance",
    label: "Finance",
    icon: (
      <NavIcon d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    to: "/admin/articles",
    label: "Articles",
    icon: (
      <NavIcon d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    ),
  },
  {
    to: "/admin/faqs",
    label: "FAQs",
    icon: (
      <NavIcon d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    to: "/admin/support",
    label: "Support",
    icon: (
      <NavIcon d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    ),
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="px-6 h-18 flex items-center border-b border-gray-100">
        <Link
          to="/admin"
          onClick={onClose}
          className="no-underline flex items-center gap-2"
        >
          <span className="text-xl font-bold tracking-tight text-brand-blue">
            Innoma <span className="text-brand-orange">Admin</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-all no-underline ${
                isActive
                  ? "bg-blue-50 text-brand-blue shadow-sm shadow-blue-100/50"
                  : "text-healthcare-text-muted hover:bg-healthcare-surface hover:text-healthcare-text"
              }`
            }
          >
            <span className="flex-shrink-0">{icon}</span>
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info + Logout */}
      <div className="p-4 border-t border-gray-100 bg-healthcare-surface/30">
        <div className="flex items-center gap-3 px-3 py-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center flex-shrink-0 font-bold shadow-临床 shadow-blue-200">
            {user?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-healthcare-text truncate">
              {user?.name}
            </p>
            <p className="text-xs text-healthcare-text-muted truncate opacity-75">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-healthcare-text-muted hover:bg-red-50 hover:text-red-600 transition-all border-none cursor-pointer bg-transparent"
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen  bg-healthcare-surface overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-68 border-r border-gray-200 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 bg-white flex flex-col shadow-2xl transition-transform duration-300">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-xl text-healthcare-text hover:bg-healthcare-surface transition-colors border-none cursor-pointer bg-transparent"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="text-lg font-bold text-brand-blue">
            Innoma <span className="text-brand-orange">Admin</span>
          </span>
          <div className="w-10" />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 sm:p-8 lg:p-10">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
