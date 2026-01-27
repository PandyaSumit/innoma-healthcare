import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPatient = user?.role === "patient";

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    ...(isPatient
      ? [
          {
            name: "Find Therapist",
            path: "/find-therapist",
            icon: (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            ),
          },
        ]
      : []),
    {
      name: isPatient ? "My Sessions" : "Appointments",
      path: "/appointments",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: "Profile",
      path: "/profile",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      name: "Settings",
      path: "/settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      name: "Support",
      path: "/support",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("innoma_user");
    navigate("/login");
    onClose();
  };

  const handleNavClick = () => {
    // Close sidebar on mobile when navigating
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out flex flex-col ${
          isOpen
            ? "translate-x-0 w-64 lg:w-64" // Mobile: Open, Desktop: Expanded
            : "-translate-x-full w-64 lg:translate-x-0 lg:w-20" // Mobile: Closed, Desktop: Collapsed
        }`}
      >
        {/* Logo Section */}
        <div
          className={`h-14 sm:h-16 flex items-center border-b border-gray-100 ${isOpen ? "px-4 sm:px-6 justify-between" : "lg:justify-center px-4 justify-between"}`}
        >
          <Link
            to="/"
            className="no-underline flex items-center gap-2"
            onClick={handleNavClick}
          >
            <span
              className={`text-xl font-bold tracking-tight text-brand-blue whitespace-nowrap overflow-hidden transition-all duration-300 ${!isOpen ? "lg:w-0 lg:opacity-0" : "w-auto"}`}
            >
              Innoma
            </span>
            <span className="text-xl font-bold tracking-tight text-brand-orange">
              HC
            </span>
          </Link>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive =
              item.path === "/find-therapist"
                ? ["/find-therapist", "/therapists", "/book", "/checkout", "/confirmation"].some(
                    (p) => location.pathname.startsWith(p)
                  )
                : location.pathname === item.path;
            return (
            <Link
              key={item.name}
              to={item.path}
              onClick={handleNavClick}
              title={!isOpen ? item.name : undefined}
              className={`flex items-center px-3 py-3 rounded-lg no-underline ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              } ${!isOpen ? "lg:justify-center " : "gap-3"}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span
                className={`text-sm whitespace-nowrap transition-all duration-300 ${!isOpen ? "lg:w-0 lg:opacity-0 lg:overflow-hidden" : ""}`}
              >
                {item.name}
              </span>
            </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            title={!isOpen ? "Sign Out" : undefined}
            className={`flex items-center  w-full px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all bg-transparent border-none cursor-pointer text-left ${!isOpen ? "lg:justify-center" : "gap-3"}`}
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
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span
              className={`text-sm font-semibold whitespace-nowrap transition-all duration-300 ${!isOpen ? "lg:w-0 lg:opacity-0 lg:overflow-hidden" : ""}`}
            >
              Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
