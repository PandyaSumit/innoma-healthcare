import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const navLinks = [
    {
      name: "Expertise",
      href: isHomePage ? "#specializations" : "/#specializations",
    },
    { name: "Find Therapist", href: "/therapists" },
    { name: "FAQ", href: isHomePage ? "#faq" : "/#faq" },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${
          isScrolled
            ? "bg-white border-b border-gray-100 shadow-sm"
            : "bg-white backdrop-blur-md border-b border-white/5"
        }`}
      >
        <nav className="mx-auto px-5 sm:px-6 md:px-12">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link
              to="/"
              className="text-xl sm:text-2xl font-bold tracking-tight text-brand-blue no-underline"
            >
              Innoma <span className="text-brand-orange">Healthcare</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-semibold transition-colors no-underline ${
                    isScrolled
                      ? "text-brand-blue-900 hover:text-brand-orange"
                      : "text-slate-700 hover:text-brand-blue-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-6">
              <button
                onClick={() => navigate("/login")}
                className={`text-sm font-semibold transition-colors bg-transparent border-none cursor-pointer ${
                  isScrolled
                    ? "text-brand-blue-900 hover:text-brand-orange"
                    : "text-slate-700 hover:text-brand-blue-900"
                }`}
              >
                Sign In
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-2.5 rounded-md text-sm font-bold bg-brand-blue text-white hover:bg-brand-blue/90 transition shadow-sm cursor-pointer border-none"
              >
                Book Free Session
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden p-2 bg-transparent border-none cursor-pointer ${
                isScrolled ? "text-brand-blue-900" : "text-slate-700"
              }`}
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
          </div>
        </nav>
      </header>

      {/* ================= MOBILE OVERLAY ================= */}
      <div
        className={`fixed inset-0 z-[110] bg-black/30 backdrop-blur-sm transition-opacity ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[280px] z-[120] bg-white shadow-xl transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <span className="text-sm font-bold text-brand-blue-900">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-transparent border-none cursor-pointer text-brand-blue-900 hover:text-brand-orange transition"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-semibold text-brand-blue-900 hover:text-brand-orange transition no-underline"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div className="mt-auto p-6 bg-gray-50 flex flex-col gap-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/login");
              }}
              className="w-full py-3 text-sm font-bold border border-brand-blue/20 rounded-md text-brand-blue-900 hover:bg-white transition cursor-pointer bg-transparent"
            >
              Sign In
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/signup");
              }}
              className="w-full py-3 rounded-md bg-brand-blue text-white text-sm font-bold hover:bg-brand-blue/90 transition shadow-md cursor-pointer border-none"
            >
              Book Free Session
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
