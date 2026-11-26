import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  RefreshCw, 
  AlertCircle, 
  ShieldCheck 
} from 'lucide-react';
import { fetchStaff as getStaffData, subscribeStaffChange, StaffItem } from '../lib/dataStore';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/common/Skeleton';
import { SEO } from '../components/common/SEO';

export const Faculty: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadStaff = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getStaffData();
      setStaffList(data);
    } catch (err: any) {
      console.warn('Error fetching staff from store:', err);
      setErrorMessage('Could not load faculty directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
    const unsubscribe = subscribeStaffChange(() => {
      loadStaff();
    });
    return unsubscribe;
  }, []);

  // Compute initials for fallback avatar
  const getInitials = (name: string) => {
    const cleaned = name.replace(/\[TO_CONFIRM:\s*|\]/g, '').trim();
    const parts = cleaned.split(' ').filter(Boolean);
    if (parts.length === 0) return 'CN';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="flex flex-col">
      <SEO
        title="Faculty & Academic Staff"
        description="Meet the dedicated nursing educators, clinical instructors, and departmental mentors at C.N.S. Paramedical and Nursing College, Kannauj."
      />

      {/* Header */}
      <div className="bg-navy-dark text-white py-12 md:py-16 border-b-4 border-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="accent" size="sm" className="mb-3">
              Mentorship & Instruction
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Faculty & Departmental Mentors
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Our educators combine university teaching experience with active bedside clinical practice to shape competent, disciplined nursing professionals.
            </p>
          </div>
        </div>
      </div>

      <Section
        id="faculty-roster"
        badge="Academic Directory"
        title="Faculty Members & Clinical Instructors"
        subtitle="Departmental faculty adhering to statutory teacher-student ratios and clinical supervision guidelines."
        bgVariant="surface"
      >
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mb-8 p-4 rounded-lg bg-status-warning-soft border border-status-warning/30 flex items-start justify-between gap-3 text-ink text-xs sm:text-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-status-warning shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-ink">{errorMessage}</p>
                <p className="text-xs text-ink-muted">To populate custom faculty, insert rows into the <code className="font-mono bg-surface px-1 py-0.5 rounded">staff</code> table in Supabase.</p>
              </div>
            </div>
            <button
              onClick={loadStaff}
              className="inline-flex items-center gap-1 font-bold text-brand hover:underline shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading faculty list">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="p-6 rounded-xl border border-border-subtle bg-surface shadow-card flex flex-col items-center text-center">
                <Skeleton variant="circular" className="w-24 h-24 mb-4" />
                <Skeleton variant="text" className="h-5 w-40 mb-2" />
                <Skeleton variant="text" className="h-4 w-32 mb-3" />
                <Skeleton variant="text" className="h-3 w-48 mb-2" />
                <Skeleton variant="text" className="h-3 w-36" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && staffList.length === 0 && (
          <div className="p-12 text-center bg-surface-light rounded-xl border border-border-subtle max-w-xl mx-auto">
            <Users className="w-12 h-12 text-ink-light mx-auto mb-3" aria-hidden="true" />
            <h3 className="text-lg font-bold text-ink mb-1">No Faculty Records Found</h3>
            <p className="text-xs sm:text-sm text-ink-muted mb-6 leading-relaxed">
              Faculty assignments for the upcoming academic session are currently being indexed by the administrative office.
            </p>
            <Button variant="primary" size="md" onClick={loadStaff}>
              Refresh Directory
            </Button>
          </div>
        )}

        {/* Active Faculty Grid */}
        {!isLoading && staffList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffList.map((member) => (
              <Card
                key={member.id}
                variant="default"
                padding="lg"
                className="flex flex-col items-center text-center hover:shadow-card-hover transition-all border-t-4 border-t-brand"
              >
                {/* Avatar with Photo or Initials Fallback */}
                <div className="relative mb-4">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-brand-faint shadow-sm"
                      onError={(e) => {
                        // Fallback on image load error
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}

                  {/* Fallback Initials Avatar (shown if photo_url is missing or invalid) */}
                  {(!member.photo_url) && (
                    <div
                      className="w-24 h-24 rounded-full bg-brand text-white flex items-center justify-center font-bold text-2xl shadow-sm border-4 border-brand-faint"
                      aria-hidden="true"
                    >
                      {getInitials(member.name)}
                    </div>
                  )}
                </div>

                <Badge variant="brand" size="sm" className="mb-2">
                  {member.department}
                </Badge>

                <h3 className="text-lg font-bold text-ink mb-1">
                  {member.name}
                </h3>

                <p className="text-xs font-semibold text-brand mb-3">
                  {member.designation}
                </p>

                <div className="w-full pt-3 mt-auto border-t border-border-subtle text-xs text-ink-muted leading-relaxed">
                  <span className="font-semibold text-ink block mb-0.5">Qualification & Specialization:</span>
                  <span>{member.qualification}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Regulatory Faculty Standards Notice */}
        <div className="mt-12 text-center p-6 bg-surface-light rounded-xl border border-border-subtle max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 font-bold text-ink text-sm mb-1.5">
            <ShieldCheck className="w-4 h-4 text-brand" aria-hidden="true" />
            <span>Council Faculty Norms & Verification</span>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed mb-4">
            Faculty appointments and clinical supervisor credentials comply with the prescribed qualification norms of the State Medical Faculty and Indian Nursing Council. Official appointment gazettes are accessible for regulatory inspection at the college office.
          </p>
          <Link to="/contact">
            <Button variant="secondary" size="sm">
              Schedule Campus Academic Counseling &rarr;
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
};
