import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Inbox, 
  Users, 
  Bell, 
  ArrowRight, 
  PlusCircle, 
  RefreshCw 
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { 
  fetchStaff, 
  fetchNotices, 
  subscribeStaffChange, 
  subscribeNoticesChange 
} from '../../lib/dataStore';
import { useAdminAuth } from '../AdminAuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { SEO } from '../../components/common/SEO';

export const AdminDashboard: React.FC = () => {
  const { userEmail } = useAdminAuth();

  const [metrics, setMetrics] = useState({
    newEnquiries: 0,
    totalEnquiries: 0,
    totalStaff: 0,
    activeNotices: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        // 1. Enquiries count
        const { data: enqData } = await supabase
          .from('enquiries')
          .select('id, status, name, phone, course, created_at')
          .order('created_at', { ascending: false });

        const allEnq = enqData || [];
        const newCount = allEnq.filter((e) => e.status === 'new').length;

        // 2. Staff count
        const { count: staffCount } = await supabase
          .from('staff')
          .select('*', { count: 'exact', head: true });

        // 3. Active notices count
        const { count: noticesCount } = await supabase
          .from('notices')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        setMetrics({
          newEnquiries: newCount,
          totalEnquiries: allEnq.length,
          totalStaff: staffCount || 0,
          activeNotices: noticesCount || 0,
        });
        setRecentEnquiries(allEnq.slice(0, 5));
      } else {
        // Fallback for preview reading real local store
        const staffData = await fetchStaff();
        const noticesData = await fetchNotices();
        const activeNoticesCount = noticesData.filter((n) => n.is_active).length;

        // Get local enquiries if any
        let localEnquiries: any[] = [];
        try {
          const raw = localStorage.getItem('cns_mock_enquiries');
          if (raw) localEnquiries = JSON.parse(raw);
        } catch (e) {}

        if (localEnquiries.length === 0) {
          localEnquiries = [
            { id: 'd-1', name: 'Pooja Verma', phone: '9876543210', course: 'ANM', status: 'new', created_at: new Date().toISOString() },
            { id: 'd-2', name: 'Amit Kumar Singh', phone: '9123456789', course: 'B.Sc. Nursing', status: 'in_progress', created_at: new Date().toISOString() },
            { id: 'd-3', name: 'Sunita Devi', phone: '9839000000', course: 'GNM', status: 'new', created_at: new Date().toISOString() },
          ];
        }

        const newCount = localEnquiries.filter((e) => e.status === 'new').length;

        setMetrics({
          newEnquiries: newCount,
          totalEnquiries: localEnquiries.length,
          totalStaff: staffData.length,
          activeNotices: activeNoticesCount,
        });
        setRecentEnquiries(localEnquiries.slice(0, 5));
      }
    } catch (err) {
      console.warn('Dashboard metrics fetch notice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const unsubStaff = subscribeStaffChange(() => fetchMetrics());
    const unsubNotices = subscribeNoticesChange(() => fetchMetrics());
    return () => {
      unsubStaff();
      unsubNotices();
    };
  }, []);

  return (
    <div className="space-y-8">
      <SEO
        title="Admin Dashboard"
        description="Administrative overview and key metrics for C.N.S. Paramedical and Nursing College."
      />

      {/* Welcome Banner */}
      <div className="bg-navy-dark text-white rounded-xl p-6 sm:p-8 border-l-4 border-l-brand shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="accent" size="sm">Logged in as Administrator</Badge>
            <span className="text-xs text-slate-300 font-mono truncate max-w-xs">{userEmail}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Administrative Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time management for student inquiries, academic circulars, and departmental faculty.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchMetrics}
          className="shrink-0"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Data
        </Button>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: New Enquiries */}
        <Link to="/admin/enquiries" className="group block focus-ring rounded-xl">
          <Card
            variant="default"
            padding="lg"
            className="border-t-4 border-t-accent hover:shadow-card-hover transition-all h-full flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                  Admission Leads
                </span>
                <div className="w-10 h-10 rounded-lg bg-accent-soft text-accent-ink flex items-center justify-center">
                  <Inbox className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>

              {isLoading ? (
                <Skeleton variant="text" className="h-10 w-24 my-2" />
              ) : (
                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-ink">
                    {metrics.newEnquiries}
                  </span>
                  <span className="text-xs font-semibold text-accent-ink bg-accent-soft px-2 py-0.5 rounded">
                    New / Unresolved
                  </span>
                </div>
              )}

              <p className="text-xs text-ink-muted">
                {isLoading ? 'Loading...' : `Out of ${metrics.totalEnquiries} total inquiries received.`}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between text-xs font-bold text-brand group-hover:text-brand-dark">
              <span>Review Enquiries</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </div>
          </Card>
        </Link>

        {/* Card 2: Staff Directory */}
        <Link to="/admin/staff" className="group block focus-ring rounded-xl">
          <Card
            variant="default"
            padding="lg"
            className="border-t-4 border-t-brand hover:shadow-card-hover transition-all h-full flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                  Faculty & Staff
                </span>
                <div className="w-10 h-10 rounded-lg bg-brand-faint text-brand flex items-center justify-center">
                  <Users className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>

              {isLoading ? (
                <Skeleton variant="text" className="h-10 w-24 my-2" />
              ) : (
                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-ink">
                    {metrics.totalStaff}
                  </span>
                  <span className="text-xs font-medium text-ink-muted">
                    Profiles Published
                  </span>
                </div>
              )}

              <p className="text-xs text-ink-muted">
                Educators and tutors with photo and qualifications.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between text-xs font-bold text-brand group-hover:text-brand-dark">
              <span>Manage Staff Directory</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </div>
          </Card>
        </Link>

        {/* Card 3: Active Notices */}
        <Link to="/admin/notices" className="group block focus-ring rounded-xl">
          <Card
            variant="default"
            padding="lg"
            className="border-t-4 border-t-status-success hover:shadow-card-hover transition-all h-full flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                  Live Circulars
                </span>
                <div className="w-10 h-10 rounded-lg bg-status-success-soft text-status-success flex items-center justify-center">
                  <Bell className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>

              {isLoading ? (
                <Skeleton variant="text" className="h-10 w-24 my-2" />
              ) : (
                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-ink">
                    {metrics.activeNotices}
                  </span>
                  <span className="text-xs font-semibold text-status-success bg-status-success-soft px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
              )}

              <p className="text-xs text-ink-muted">
                Circulars visible on home ticker and notice board.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between text-xs font-bold text-brand group-hover:text-brand-dark">
              <span>Manage Notices</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Quick Action Buttons & Shortcuts */}
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/admin/enquiries">
          <Button variant="primary" size="md" leftIcon={<Inbox className="w-4 h-4" />}>
            View All Enquiries
          </Button>
        </Link>
        <Link to="/admin/staff">
          <Button variant="secondary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Add Staff Member
          </Button>
        </Link>
        <Link to="/admin/notices">
          <Button variant="secondary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Publish New Notice
          </Button>
        </Link>
      </div>

      {/* Recent Enquiries Strip */}
      <Card variant="default" padding="lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Recent Admission Enquiries</CardTitle>
            <p className="text-xs text-ink-muted">Latest 5 submissions received from the public website.</p>
          </div>
          <Link to="/admin/enquiries" className="text-xs font-bold text-brand hover:underline">
            View All Enquiries &rarr;
          </Link>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton variant="text" className="h-8 w-full" />
              <Skeleton variant="text" className="h-8 w-full" />
            </div>
          ) : recentEnquiries.length === 0 ? (
            <p className="text-xs text-ink-muted py-4 text-center">No admission inquiries received yet.</p>
          ) : (
            <table className="min-w-full divide-y divide-border-subtle text-left text-xs" aria-label="Recent inquiries">
              <thead className="bg-surface-light uppercase text-ink font-semibold">
                <tr>
                  <th scope="col" className="px-4 py-2.5">Candidate</th>
                  <th scope="col" className="px-4 py-2.5">Phone</th>
                  <th scope="col" className="px-4 py-2.5">Course</th>
                  <th scope="col" className="px-4 py-2.5">Status</th>
                  <th scope="col" className="px-4 py-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-ink">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-surface-light">
                    <td className="px-4 py-3 font-semibold">{enq.name}</td>
                    <td className="px-4 py-3 font-mono">{enq.phone}</td>
                    <td className="px-4 py-3">
                      <Badge variant="brand" size="sm">{enq.course}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={enq.status === 'resolved' ? 'success' : enq.status === 'in_progress' ? 'warning' : 'accent'}
                        size="sm"
                      >
                        {enq.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link to="/admin/enquiries" className="text-brand hover:underline font-bold">
                        Open &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
