import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Pause, Play, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { fetchNotices as getNoticesData, subscribeNoticesChange } from '../../lib/dataStore';
import { Badge } from '../ui/Badge';

export interface Notice {
  id: string;
  title: string;
  category: string;
  published_at?: string;
  link_url?: string | null;
}

const fallbackNotices: Notice[] = [
  {
    id: 'fb-1',
    title: 'Admissions Open for Session 2026–2027 in ANM, GNM & B.Sc. Nursing. Apply at the campus desk.',
    category: 'Admissions',
    published_at: new Date().toISOString(),
  },
  {
    id: 'fb-2',
    title: 'Orientation Schedule & Document Verification for First Year Batches (Monday to Saturday, 9:30 AM – 4:30 PM).',
    category: 'Academic',
    published_at: new Date().toISOString(),
  },
  {
    id: 'fb-3',
    title: 'Clinical Rotations & Hospital Postings Guidelines for Nursing Students in Kannauj district.',
    category: 'Clinical',
    published_at: new Date().toISOString(),
  },
];

export const NoticeTicker: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>(fallbackNotices);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Check user prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      if (e.matches) {
        setIsPaused(true);
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Fetch from unified data store and subscribe to real-time changes
  useEffect(() => {
    let isMounted = true;

    async function loadTickerNotices() {
      try {
        const data = await getNoticesData(true);
        if (data && data.length > 0 && isMounted) {
          setNotices(data.slice(0, 5));
        }
      } catch (err) {
        console.warn('NoticeTicker fetch error:', err);
      }
    }

    loadTickerNotices();
    const unsubscribe = subscribeNoticesChange(() => {
      loadTickerNotices();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Auto rotate ticker every 5 seconds unless paused or reduced-motion
  useEffect(() => {
    if (isPaused || isReducedMotion || notices.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, isReducedMotion, notices.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + notices.length) % notices.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % notices.length);
  };

  const activeNotice = notices[currentIndex] || fallbackNotices[0];

  return (
    <div
      ref={tickerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (!isReducedMotion) setIsPaused(false);
      }}
      className="bg-navy-dark text-white border-b border-navy-border py-2 px-4 sm:px-6 lg:px-8 transition-colors"
      role="region"
      aria-label="Latest college announcements"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-accent-soft text-accent-ink border border-accent/40 uppercase tracking-wide">
            <Bell className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Latest</span>
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
            Announcements:
          </span>
        </div>

        {/* Center Active Notice Content with smooth transition */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-2 truncate text-xs sm:text-sm">
            <Badge variant="navy" size="sm" className="hidden md:inline-flex shrink-0">
              {activeNotice.category || 'General'}
            </Badge>

            <Link
              to="/notices"
              className="text-slate-100 hover:text-accent font-medium truncate underline-offset-2 hover:underline focus-ring-navy rounded px-1 transition-colors"
            >
              {activeNotice.title}
            </Link>

            {activeNotice.published_at && (
              <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-slate-400 shrink-0 ml-2">
                <Calendar className="w-3 h-3 text-slate-400" aria-hidden="true" />
                {new Date(activeNotice.published_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Accessibility & Navigation Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block mr-1">
            {currentIndex + 1}/{notices.length}
          </span>

          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous notice"
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-navy-surface focus-ring-navy"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Resume notice carousel' : 'Pause notice carousel'}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-navy-surface focus-ring-navy"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next notice"
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-navy-surface focus-ring-navy"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <Link
            to="/notices"
            className="text-xs font-semibold text-accent hover:text-white ml-2 underline focus-ring-navy rounded py-0.5 px-1"
          >
            View All
          </Link>
        </div>
      </div>
    </div>
  );
};
