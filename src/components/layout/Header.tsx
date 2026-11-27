import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Phone, 
  Mail,
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
      {/* Top Bar: Emergency info, Address & Timings (Navy Dark) - Desktop & Tablet (hidden on mobile) */}
      <div className="hidden md:block bg-navy-dark text-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-navy-border/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href={siteConfig.contact.mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              title="Open campus location on Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
              <span>Samdhan, Kannauj, UP (209735)</span>
            </a>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
              <span>{siteConfig.contact.hours.days}: {siteConfig.contact.hours.timing}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <a
              href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
              <span className="hidden xl:inline text-slate-400">Helpline:</span>
              <span className="text-white font-semibold">{siteConfig.contact.phone}</span>
            </a>
            <span className="text-navy-border hidden lg:inline">|</span>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="hidden lg:inline-flex items-center gap-1.5 hover:text-white transition-colors"
              title="Official Email"
            >
              <Mail className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
              <span className="text-white font-medium">{siteConfig.contact.email}</span>
            </a>
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
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & College Identity */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 focus-ring rounded-md py-1 pr-2 group min-w-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-surface flex items-center justify-center p-0.5 shadow-sm border border-border-subtle group-hover:border-brand/40 transition-colors shrink-0">
              <img
                src="/images/Logos/College Logo.png"
                alt="C.N.S. Paramedical & Nursing College Official Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left min-w-0">
              <div className="text-sm sm:text-base md:text-lg font-extrabold text-navy leading-tight group-hover:text-brand transition-colors truncate">
                {siteConfig.collegeName}
              </div>
              <div className="text-[11px] sm:text-xs text-ink-muted truncate">
                Est. {siteConfig.establishedYear} · Samdhan, Kannauj
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

          {/* Action CTAs Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="accent"
              size="md"
              onClick={() => openEnquiryModal()}
              rightIcon={<FileText className="w-4 h-4" aria-hidden="true" />}
            >
              Apply Now
            </Button>
          </div>

          {/* Mobile Menu Button & Quick Apply */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="accent"
              size="sm"
              onClick={() => openEnquiryModal()}
              className="text-xs px-2.5 py-1.5"
            >
              Apply
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-ink hover:text-brand hover:bg-surface-light border border-border-subtle focus-ring transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close main navigation menu' : 'Open main navigation menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Notice Banner Ticker */}
      <div className="bg-surface-light border-t border-border-subtle py-1.5 px-3 sm:px-4 text-xs overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1 font-bold text-accent-ink bg-accent-soft px-2 py-0.5 rounded border border-accent/30 shrink-0 text-2xs sm:text-xs">
            <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
            <span>ADMISSIONS</span>
          </span>
          <p className="text-ink text-xs truncate flex-1 min-w-0">
            Admissions Open for Session 2026–27 in ANM, GNM & B.Sc. Nursing. Inquire at campus office Mon–Sat.
          </p>
          <Link
            to="/notices"
            className="text-brand hover:text-brand-dark font-semibold text-xs ml-auto shrink-0 underline focus-ring hidden sm:inline-block"
          >
            All Notices &rarr;
          </Link>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-navy-dark/70 backdrop-blur-sm transition-opacity" 
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 w-full max-w-[320px] sm:max-w-sm bg-surface shadow-2xl p-5 sm:p-6 overflow-y-auto text-left flex flex-col justify-between transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded bg-surface flex items-center justify-center p-0.5 border border-border-subtle shrink-0 shadow-xs">
                    <img
                      src="/images/Logos/College Logo.png"
                      alt="C.N.S. College Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-extrabold text-navy text-sm sm:text-base leading-tight block">
                      C.N.S. College
                    </span>
                    <span className="text-[11px] text-ink-muted block">
                      Samdhan, Kannauj
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-md text-ink-muted hover:text-navy hover:bg-surface-muted focus-ring transition-colors"
                  aria-label="Close navigation drawer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Main Navigation */}
              <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile Navigation">
                <div className="text-2xs uppercase font-bold tracking-wider text-ink-light px-3 py-1">
                  Menu
                </div>
                {navLinks.map((item) => (
                  <div key={item.label}>
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-2.5 px-3 rounded-md text-sm sm:text-base font-semibold transition-colors ${
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
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block py-1.5 px-2 text-xs sm:text-sm rounded transition-colors ${
                              location.pathname === sub.path 
                                ? 'text-brand font-bold bg-brand-faint/50' 
                                : 'text-ink-muted hover:text-brand'
                            }`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Primary Action Button */}
              <div className="pt-4 mt-2">
                <Button
                  variant="accent"
                  size="md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openEnquiryModal();
                  }}
                  className="w-full shadow-md"
                  rightIcon={<FileText className="w-4 h-4" aria-hidden="true" />}
                >
                  Apply for Admission (2026–27)
                </Button>
              </div>

              {/* Utility Bar Elements (Migrated to Mobile Sidebar) */}
              <div className="mt-5 pt-4 border-t border-border-subtle">
                <div className="text-2xs uppercase font-bold tracking-wider text-ink-light mb-2.5 px-1 flex items-center justify-between">
                  <span>Helpdesk & Utilities</span>
                  <span className="text-3xs bg-brand-faint text-brand px-1.5 py-0.5 rounded font-mono">Quick Access</span>
                </div>
                
                <div className="bg-surface-light rounded-xl p-3.5 border border-border-subtle space-y-3 text-xs shadow-xs">
                  {/* Phone Helpline with click-to-call */}
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center gap-3 text-ink hover:text-brand transition-colors group p-1 -m-1 rounded-md"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-white transition-colors">
                      <Phone className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-2xs text-ink-muted block">Admission Helpline (Call / WhatsApp)</span>
                      <span className="font-bold text-ink group-hover:text-brand text-xs sm:text-sm">{siteConfig.contact.phone}</span>
                    </div>
                  </a>

                  {/* Official Email */}
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="flex items-center gap-3 text-ink hover:text-brand transition-colors group p-1 -m-1 rounded-md pt-2 border-t border-border-subtle/60"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                      <Mail className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-2xs text-ink-muted block">Official Email</span>
                      <span className="font-bold text-ink group-hover:text-brand text-xs sm:text-sm break-all">{siteConfig.contact.email}</span>
                    </div>
                  </a>

                  {/* Office Timings */}
                  <div className="flex items-center gap-3 text-ink-muted pt-2 border-t border-border-subtle/60">
                    <div className="w-8 h-8 rounded-full bg-accent/10 text-accent shrink-0 flex items-center justify-center">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-2xs text-ink-muted block">Counseling Hours</span>
                      <span className="font-medium text-ink text-xs">{siteConfig.contact.hours.days}: {siteConfig.contact.hours.timing}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <a
                    href={siteConfig.contact.mapDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-ink-muted pt-2 border-t border-border-subtle/60 hover:text-brand transition-colors group"
                    title="Open campus location on Google Maps"
                  >
                    <div className="w-8 h-8 rounded-full bg-navy/10 text-navy group-hover:bg-brand/10 group-hover:text-brand shrink-0 flex items-center justify-center mt-0.5 transition-colors">
                      <MapPin className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-2xs text-ink-muted block group-hover:text-brand">Campus Location (Open in Maps)</span>
                      <span className="text-ink text-xs leading-snug group-hover:text-brand">Lakhaiyamau, Gursahaiganj Road, Samdhan, Kannauj (209735)</span>
                    </div>
                  </a>

                  {/* Announcements Link */}
                  <div className="pt-2 border-t border-border-subtle">
                    <Link
                      to="/notices"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between text-brand hover:text-brand-dark font-semibold py-1.5 group"
                    >
                      <span className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                        <span>Official Notices & Announcements</span>
                      </span>
                      <span className="group-hover:translate-x-0.5 transition-transform font-bold">&rarr;</span>
                    </Link>
                  </div>

                  {/* Admin Login Link */}
                  <div className="pt-1.5 border-t border-border-subtle/60">
                    <Link
                      to="/admin/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between text-ink-muted hover:text-ink font-medium py-1.5 group"
                    >
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-ink-light shrink-0" aria-hidden="true" />
                        <span>Staff & Administrator Portal</span>
                      </span>
                      <span className="text-ink-light group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Note in Drawer */}
            <div className="pt-4 text-center text-2xs text-ink-light">
              &copy; {new Date().getFullYear()} C.N.S. Paramedical & Nursing College
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
