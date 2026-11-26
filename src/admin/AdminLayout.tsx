import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  Inbox, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ShieldCheck
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { Button } from '../components/ui/Button';
import { siteConfig } from '../content/siteConfig';

export const AdminLayout: React.FC = () => {
  const { userEmail, logout } = useAdminAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Enquiries', path: '/admin/enquiries', icon: Inbox },
    { label: 'Staff Directory', path: '/admin/staff', icon: Users },
    { label: 'Notices & Circulars', path: '/admin/notices', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-surface-light flex flex-col font-sans text-ink">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-navy-dark text-white border-b-2 border-brand shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Brand Logo / Portal Label */}
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2.5 focus-ring-navy rounded py-1 pr-2">
              <div className="w-9 h-9 rounded bg-white flex items-center justify-center p-0.5 shadow-sm border border-navy-border shrink-0">
                <img
                  src="/images/Logos/College Logo.png"
                  alt="C.N.S. College Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <span className="font-extrabold text-sm sm:text-base text-white block leading-tight">
                  C.N.S. Admin
                </span>
                <span className="text-[10px] text-slate-300 font-mono block">
                  Kannauj Management Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Admin Sections">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors focus-ring-navy ${
                    isActive
                      ? 'bg-brand text-white'
                      : 'text-slate-300 hover:text-white hover:bg-navy-surface'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-navy-surface px-3 py-1.5 rounded border border-navy-border">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
              <span className="truncate max-w-[150px]">{userEmail || 'Admin'}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="hidden md:inline-flex text-slate-300 hover:text-white hover:bg-navy-surface focus-ring-navy"
              leftIcon={<LogOut className="w-4 h-4" aria-hidden="true" />}
            >
              Sign Out
            </Button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded text-slate-300 hover:text-white focus-ring-navy"
              aria-label="Toggle admin navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-navy-surface border-t border-navy-border px-4 py-3 space-y-1">
            <div className="pb-2 mb-2 border-b border-navy-border text-xs text-slate-300 flex items-center justify-between">
              <span>Signed in as:</span>
              <span className="font-semibold text-accent truncate max-w-[200px]">{userEmail}</span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-sm font-semibold ${
                    isActive
                      ? 'bg-brand text-white'
                      : 'text-slate-200 hover:bg-navy-dark hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-3 mt-2 border-t border-navy-border flex flex-col gap-2">
              <Link
                to="/"
                target="_blank"
                className="flex items-center justify-between text-xs text-slate-300 hover:text-white py-1"
              >
                <span>View Public College Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <Button
                variant="danger"
                size="sm"
                className="w-full mt-1"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Administrative Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Admin Footer */}
      <footer className="bg-surface border-t border-border-subtle py-4 px-6 text-center text-xs text-ink-light">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{siteConfig.collegeName} &bull; Administrative Console</span>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-brand hover:underline">
              Public Website &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
