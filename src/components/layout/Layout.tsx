import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-ink font-sans">
      {/* Skip to main content link for keyboard and screen-reader accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-brand focus:text-white focus:font-bold focus:rounded-md focus:shadow-xl focus:ring-2 focus:ring-accent"
      >
        Skip to main content
      </a>

      {/* Sticky Header with Navigation & Announcements */}
      <Header />

      {/* Main Content Landmark */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>

      {/* Accessible Navy Footer */}
      <Footer />
    </div>
  );
};
