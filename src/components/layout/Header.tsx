import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Phone, 
  Clock, 
  MapPin, 
  Menu, 
  X, 
  ChevronDown, 
  AlertCircle,
  FileText,
  Lock
} from 'lucide-react';
import { siteConfig } from '../../content/siteConfig';
import { Button } from '../ui/Button';
import { useEnquiryModal } from '../../context/EnquiryModalContext';

export const Header: React.FC = () => {
  const { openEnquiryModal } = useEnquiryModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const location = useLocation();

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setCoursesDropdownOpen(false);
  }, [location.pathname]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setCoursesDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    {
      label: 'Courses',
      path: '/courses',
      children: [
        { label: 'All Courses Overview', path: '/courses' },
        { label: 'ANM (Nursing Diploma)', path: '/courses/anm' },
        { label: 'GNM (General Nursing)', path: '/courses/gnm' },
        { label: 'B.Sc. Nursing (Degree)', path: '/courses/bsc-nursing' },
      ],
    },
    { label: 'Faculty', path: '/faculty' },
    { label: 'Campus Gallery', path: '/gallery' },
    { label: 'Notices', path: '/notices' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-border-subtle">
      {/* Top Bar: Emergency info, Address & Timings (Navy Dark) */}
      <div className="bg-navy-dark text-white text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
              <span>Samdhan, Kannauj, UP (209735)</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
              <span>{siteConfig.contact.hours.days}: {siteConfig.contact.hours.timing}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
              <span>Admission Desk:</span>
              <span className="text-white font-medium">{siteConfig.contact.phone}</span>
            </span>
            <span className="text-navy-border">|</span>
            <Link
              to="/notices"
              className="hover:text-accent focus-ring text-slate-300 hover:underline"
              aria-label="View recent official announcements"
            >
              Announcements
            </Link>
            <span className="text-navy-border">|</span>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 hover:text-accent focus-ring text-slate-300 hover:underline transition-colors"
              aria-label="Administrative Portal Login"
            >
              <Lock className="w-3 h-3 text-accent shrink-0" aria-hidden="true" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & College Identity */}
          <Link
            to="/"
            className="flex items-center gap-3 focus-ring rounded-md py-1 pr-2 group"
          >
            <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center p-0.5 shadow-sm border border-border-subtle group-hover:border-brand/40 transition-colors shrink-0">
              <img
                src="/images/Logos/College Logo.png"
                alt="C.N.S. Paramedical & Nursing College Official Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <div className="text-base sm:text-lg font-extrabold text-navy-dark leading-tight group-hover:text-brand transition-colors">
                {siteConfig.collegeName}
              </div>
              <div className="text-xs text-ink-muted">
                Est. {siteConfig.establishedYear} · Lakhaiyamau, Gursahaiganj Rd, Samdhan
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navLinks.map((item) => {
              if (item.children) {
                return (
                  <div key={item.label} className="relative group">
                    <button
                      type="button"
                      onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                      onBlur={(e) => {
                        if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) {
                          setCoursesDropdownOpen(false);
                        }
                      }}
                      aria-expanded={coursesDropdownOpen}
                      aria-haspopup="true"
                      className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors focus-ring ${
                        location.pathname.startsWith('/courses')
                          ? 'text-brand bg-brand-faint'
                          : 'text-ink hover:text-brand hover:bg-surface-light'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute left-0 mt-1 w-64 rounded-md shadow-dropdown bg-surface border border-border-subtle py-2 z-50 transition-all ${
                        coursesDropdownOpen
                          ? 'opacity-100 visible'
                          : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
                      }`}
                      role="menu"
                    >
                      {item.children.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          role="menuitem"
                          className={`block px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors hover:bg-surface-light hover:text-brand focus-ring ${
                            location.pathname === subItem.path ? 'text-brand bg-brand-faint font-bold' : 'text-ink'
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors focus-ring ${
                    isActive
                      ? 'text-brand bg-brand-faint'
                      : 'text-ink hover:text-brand hover:bg-surface-light'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => openEnquiryModal()}
              rightIcon={<FileText className="w-4 h-4" aria-hidden="true" />}
            >
              Apply Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => openEnquiryModal()}
            >
              Apply
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-ink hover:text-brand hover:bg-surface-light focus-ring"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close main navigation menu' : 'Open main navigation menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Notice Banner Ticker */}
      <div className="bg-surface-light border-t border-border-subtle py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="inline-flex items-center gap-1 font-bold text-accent-ink bg-accent-soft px-2 py-0.5 rounded border border-accent/30 shrink-0">
            <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>ADMISSIONS</span>
          </span>
          <p className="text-ink text-xs truncate">
            Admissions Open for Session 2026–27 in ANM, GNM & B.Sc. Nursing. Inquire at campus office Mon–Sat.
          </p>
          <Link
            to="/notices"
            className="text-brand hover:text-brand-dark font-semibold text-xs ml-auto shrink-0 underline focus-ring"
          >
            All Notices &rarr;
          </Link>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-navy-dark/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-surface shadow-xl p-6 overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-surface flex items-center justify-center p-0.5 border border-border-subtle shrink-0">
                  <img
                    src="/images/Logos/College Logo.png"
                    alt="C.N.S. College Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-bold text-navy-dark text-sm sm:text-base leading-tight">
                  C.N.S. College
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-ink-muted hover:text-ink focus-ring"
                aria-label="Close navigation drawer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile Navigation">
              {navLinks.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.path}
                    className={`block py-3 px-3 rounded-md text-base font-semibold ${
                      location.pathname === item.path
                        ? 'text-brand bg-brand-faint'
                        : 'text-ink hover:bg-surface-light hover:text-brand'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 border-l-2 border-brand/20 ml-3 my-1 flex flex-col gap-1">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className="block py-2 px-2 text-sm text-ink-muted hover:text-brand"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 mt-2 border-t border-border-subtle flex flex-col gap-2">
                <Link to="/contact" className="w-full">
                  <Button variant="primary" size="md" className="w-full">
                    Online Admission Inquiry
                  </Button>
                </Link>
                <Link to="/admin" className="w-full">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-ink-muted">
                    Staff & Admin Portal
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
