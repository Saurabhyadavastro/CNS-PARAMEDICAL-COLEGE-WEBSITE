import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Download, 
  ExternalLink, 
  AlertCircle,
  RefreshCw,
  Bell
} from 'lucide-react';
import { fetchNotices as getNoticesData, subscribeNoticesChange, NoticeItem } from '../lib/dataStore';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/common/Skeleton';
import { SEO } from '../components/common/SEO';

export const Notices: React.FC = () => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const loadNotices = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getNoticesData(true); // active notices
      setNotices(data);
    } catch (err: any) {
      console.warn('Error fetching notices from store:', err);
      setErrorMessage('Could not load live notices. Displaying institutional bulletin notices.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
    const unsubscribe = subscribeNoticesChange(() => {
      loadNotices();
    });
    return unsubscribe;
  }, []);

  const categories = ['All', 'Admissions', 'Examination', 'Academic', 'General'];

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || n.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col">
      <SEO
        title="Notice Board & Circulars"
        description="Official circulars, admission notifications, academic schedules, and exam updates from C.N.S. Paramedical and Nursing College, Kannauj."
      />

      {/* Header */}
      <div className="bg-navy-dark text-white py-12 md:py-16 border-b-4 border-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="accent" size="sm" className="mb-3">
              Official Bulletin
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Notice Board & Circulars
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Official academic notifications, admission schedules, examination guidelines, and administrative circulars for students and applicants.
            </p>
          </div>
        </div>
      </div>

      <Section
        id="notices-list"
        badge="Announcements"
        title="Institutional Circulars"
        bgVariant="surface"
      >
        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-8 p-4 rounded-lg bg-status-warning-soft border border-status-warning/30 flex items-start justify-between gap-3 text-ink text-xs sm:text-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-status-warning shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-ink">{errorMessage}</p>
                <p className="text-xs text-ink-muted">To publish live notices, insert rows into the <code className="font-mono bg-surface px-1 py-0.5 rounded">notices</code> table in Supabase.</p>
              </div>
            </div>
            <button
              onClick={loadNotices}
              className="inline-flex items-center gap-1 font-bold text-brand hover:underline shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Notice categories">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors focus-ring ${
                  selectedCategory === cat
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-surface-light text-ink hover:bg-surface-muted border border-border-subtle'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72">
            <Input
              id="notice-search"
              name="notice-search"
              label="Filter Circulars"
              placeholder="Search by keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-1.5"
            />
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-4" aria-label="Loading notices">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-5 rounded-lg border border-border-subtle bg-surface shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton variant="text" className="h-4 w-24" />
                  <Skeleton variant="text" className="h-4 w-28" />
                </div>
                <Skeleton variant="text" className="h-6 w-3/4" />
                <Skeleton variant="text" className="h-4 w-full" />
                <Skeleton variant="text" className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredNotices.length === 0 && (
          <div className="p-12 text-center bg-surface-light rounded-xl border border-border-subtle max-w-lg mx-auto">
            <Bell className="w-12 h-12 text-ink-light mx-auto mb-3" aria-hidden="true" />
            <h3 className="text-lg font-bold text-ink mb-1">No Notices Found</h3>
            <p className="text-xs sm:text-sm text-ink-muted mb-6 leading-relaxed">
              No official announcements match your filter. Check back soon or visit the administrative desk in Samdhan.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Active Notices List (Newest First) */}
        {!isLoading && filteredNotices.length > 0 && (
          <div className="space-y-4">
            {filteredNotices.map((notice) => {
              const isAdmission = notice.category.toLowerCase() === 'admissions';
              return (
                <Card
                  key={notice.id}
                  variant="default"
                  padding="md"
                  className={`transition-all hover:border-brand/40 ${
                    isAdmission ? 'border-l-4 border-l-accent' : 'border-l-4 border-l-brand'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={isAdmission ? 'accent' : 'brand'}
                        size="sm"
                      >
                        {notice.category}
                      </Badge>
                      
                      <span className="text-xs text-ink-light flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
                        {new Date(notice.published_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-ink-light bg-surface-muted px-2 py-0.5 rounded">
                      Official Circular
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-ink mb-2">
                    {notice.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mb-4">
                    {notice.description}
                  </p>

                  <div className="pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-ink-light">
                      Office of the Registrar · C.N.S. Paramedical & Nursing College
                    </span>

                    {notice.link_url ? (
                      <a
                        href={notice.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-brand hover:text-brand-dark focus-ring rounded py-1 px-2"
                      >
                        <span>Open Document Link</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => alert(`Notice circular "${notice.title}" is officially on file at the administrative desk.`)}
                        className="inline-flex items-center gap-1 font-bold text-brand hover:text-brand-dark focus-ring rounded py-1 px-2"
                      >
                        <Download className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Download Physical Copy Info</span>
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Section>
    </div>
  );
};
