import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  const navLinks = [
    { name: 'Expertise', href: isHomePage ? '#specializations' : '/#specializations' },
    { name: 'Specialists', href: isHomePage ? '#therapists' : '/#therapists' },
    { name: 'FAQ', href: isHomePage ? '#faq' : '/#faq' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out ${
          isScrolled 
            ? 'bg-white border-b border-gray-100 py-4 shadow-sm' 
            : 'bg-white/10 backdrop-blur-md py-6 border-b border-white/5'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2 group cursor-pointer no-underline">
                <span className={`text-2xl font-bold tracking-tight transition-colors ${isScrolled ? 'text-brand-blue-900' : 'text-slate-900'}`}>
                  Innoma <span className="text-brand-orange">Healthcare</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors no-underline ${
                    isScrolled 
                      ? 'text-brand-blue-900 hover:text-brand-orange' 
                      : 'text-slate-700 hover:text-brand-blue-900'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-6">
              <Link 
                to="/login"
                className={`text-sm font-semibold transition-colors cursor-pointer no-underline ${
                  isScrolled ? 'text-brand-blue-900 hover:text-brand-orange' : 'text-slate-700 hover:text-brand-blue-900'
                }`}
              >
                Sign In
              </Link>
              <button 
                onClick={() => navigate('/signup')}
                className={`inline-flex items-center justify-center px-6 py-2.5 rounded-md text-sm font-bold transition-all cursor-pointer border-none ${
                isScrolled 
                  ? 'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-sm' 
                  : 'bg-brand-blue text-white hover:bg-brand-blue-900'
              }`}>
                Book Free Session
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden p-2 transition-colors cursor-pointer bg-transparent border-none ${
                isScrolled ? 'text-brand-blue-900' : 'text-slate-700'
              }`}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[110] bg-brand-blue/20 backdrop-blur-sm transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-[280px] z-[120] bg-white shadow-xl transition-transform duration-300 ease-out flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <span className="text-sm font-bold text-brand-blue-900">Menu</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-brand-blue-900 hover:text-brand-orange transition-colors cursor-pointer bg-transparent border-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-semibold text-brand-blue-900 hover:text-brand-orange transition-colors no-underline"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="mt-auto p-6 bg-gray-50 flex flex-col gap-3">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/login');
              }}
              className="w-full py-3 text-sm font-bold text-brand-blue-900 border border-brand-blue/20 rounded-md hover:bg-white transition-colors bg-transparent cursor-pointer"
            >
              Sign In
            </button>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/signup');
              }}
              className="w-full py-3 rounded-md bg-brand-blue text-white text-sm font-bold hover:bg-brand-blue/90 transition-colors shadow-md border-none cursor-pointer"
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



