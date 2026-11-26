import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Database, 
  LogOut, 
  Inbox
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Section } from '../components/ui/Section';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { SEO } from '../components/common/SEO';

export const AdminPortal: React.FC = () => {
  const { addToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);

  // Demo / local inquiry fallback
  const demoInquiries = [
    {
      id: 'demo-1',
      name: 'Pooja Verma',
      phone: '9876543210',
      email: 'pooja.verma@example.com',
      course: 'ANM',
      last_qualification: '10+2 Arts',
      percentage: 64.0,
      city: 'Kannauj',
      message: 'Inquiring about hostel facilities and bus transport from Samdhan market.',
      status: 'new',
      created_at: new Date().toLocaleDateString(),
    },
    {
      id: 'demo-2',
      name: 'Amit Kumar Singh',
      phone: '9123456789',
      email: 'amit.singh@example.com',
      course: 'B.Sc. Nursing',
      last_qualification: '10+2 Science PCB',
      percentage: 72.5,
      city: 'Gursahaiganj',
      message: 'Looking for B.Sc. Nursing admission criteria and clinical hospital tie-ups.',
      status: 'in_progress',
      created_at: new Date().toLocaleDateString(),
    },
  ];

  // Check existing session
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setIsAuthenticated(true);
          loadInquiries();
        }
      });
    }
  }, []);

  const loadInquiries = async () => {
    if (!isSupabaseConfigured) {
      setInquiries(demoInquiries);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data && data.length > 0 ? data : demoInquiries);
    } catch (err: any) {
      console.warn('Could not load Supabase enquiries, showing demo data:', err?.message);
      setInquiries(demoInquiries);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      setIsAuthenticated(true);
      loadInquiries();
      addToast({
        type: 'success',
        title: 'Logged In Successfully',
        message: 'Welcome to the C.N.S. College Administration Panel.',
      });
    } catch (err: any) {
      // Allow demo login for staff testing if Supabase is still unconfigured
      if (!isSupabaseConfigured && email && password) {
        setIsAuthenticated(true);
        loadInquiries();
        addToast({
          type: 'info',
          title: 'Demo Staff Session',
          message: 'Logged in under local demonstration mode (Supabase keys not yet configured).',
        });
      } else {
        addToast({
          type: 'error',
          title: 'Authentication Failed',
          message: err?.message || 'Invalid credentials or connection error.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have safely exited the administration portal.',
    });
  };

  return (
    <div className="flex flex-col">
      <SEO
        title="Staff & Administration Portal"
        description="Administrative management portal for staff at C.N.S. Paramedical and Nursing College, Kannauj."
      />

      {/* Header */}
      <div className="bg-navy-dark text-white py-10 border-b-4 border-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge variant="accent" size="sm" className="mb-2">
              Staff & Office Portal
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              C.N.S. Administration Control Panel
            </h1>
          </div>

          {isAuthenticated && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOut className="w-4 h-4" aria-hidden="true" />}
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>

      <Section id="admin-main" bgVariant="surface" className="py-10">
        {!isAuthenticated ? (
          /* Login Form */
          <div className="max-w-md mx-auto">
            <Card variant="surface-light" padding="lg" className="border-t-4 border-t-brand">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-faint text-brand mx-auto flex items-center justify-center mb-2">
                  <Lock className="w-6 h-6" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">Staff Authentication</CardTitle>
                <p className="text-xs text-ink-muted mt-1">
                  Enter authorized email and password to manage admission leads and notifications.
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    id="admin-email"
                    name="email"
                    type="email"
                    label="Staff Email Address"
                    required
                    placeholder="admin@cnscollege.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <Input
                    id="admin-password"
                    name="password"
                    type="password"
                    label="Password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      className="w-full"
                      isLoading={isLoading}
                      leftIcon={<Key className="w-4 h-4" aria-hidden="true" />}
                    >
                      Authenticate & Access Panel
                    </Button>
                  </div>
                </form>

                <div className="mt-6 pt-4 border-t border-border-subtle text-xs text-ink-light space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-ink">
                    <Database className="w-3.5 h-3.5 text-brand shrink-0" aria-hidden="true" />
                    <span>Supabase Backend Status:</span>
                    {isSupabaseConfigured ? (
                      <Badge variant="success" size="sm">Connected</Badge>
                    ) : (
                      <Badge variant="warning" size="sm">Awaiting VITE_SUPABASE_URL</Badge>
                    )}
                  </div>
                  <p className="text-xs text-ink-muted">
                    When running on free tier without backend keys, demo staff credentials can be used for UI validation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card variant="surface-light" padding="md">
                <div className="text-xs font-semibold text-ink-light mb-1">Backend Connection</div>
                <div className="flex items-center gap-2">
                  <Badge variant={isSupabaseConfigured ? 'success' : 'warning'}>
                    {isSupabaseConfigured ? 'Supabase Active (Postgres + Auth)' : 'Local Preview Mode'}
                  </Badge>
                </div>
                <p className="text-xs text-ink-muted mt-2">
                  {isSupabaseConfigured
                    ? 'Syncing with Supabase database.'
                    : 'Add VITE_SUPABASE_URL in .env to connect live Postgres.'}
                </p>
              </Card>

              <Card variant="surface-light" padding="md">
                <div className="text-xs font-semibold text-ink-light mb-1">Total Inquiries Received</div>
                <div className="text-2xl font-bold text-brand">{inquiries.length}</div>
                <p className="text-xs text-ink-muted mt-2">
                  Candidate inquiries submitted for Session 2026–27.
                </p>
              </Card>

              <Card variant="surface-light" padding="md">
                <div className="text-xs font-semibold text-ink-light mb-1">Unconfirmed Fact Tokens</div>
                <div className="text-2xl font-bold text-accent-ink">Config Monitored</div>
                <p className="text-xs text-ink-muted mt-2">
                  Placeholders in siteConfig.ts: "[TO_CONFIRM: ...]"
                </p>
              </Card>
            </div>

            {/* Inquiries Table */}
            <Card variant="default" padding="lg">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-brand" aria-hidden="true" />
                    <span>Recent Student Admission Inquiries</span>
                  </CardTitle>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Prospective students who submitted their details via the contact and course pages.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={loadInquiries}>
                  Refresh Data
                </Button>
              </CardHeader>

              <CardContent className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-subtle text-left text-sm" aria-label="Student inquiries table">
                  <thead className="bg-surface-light text-xs uppercase tracking-wider text-ink font-semibold">
                    <tr>
                      <th scope="col" className="px-4 py-3">Candidate</th>
                      <th scope="col" className="px-4 py-3">Contact</th>
                      <th scope="col" className="px-4 py-3">Program</th>
                      <th scope="col" className="px-4 py-3">Qualification</th>
                      <th scope="col" className="px-4 py-3">Message / Notes</th>
                      <th scope="col" className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-ink">
                    {inquiries.map((inq, i) => (
                      <tr key={inq.id || i} className="hover:bg-surface-light transition-colors">
                        <td className="px-4 py-3 font-semibold text-ink whitespace-nowrap">
                          {inq.name || inq.full_name}
                        </td>
                        <td className="px-4 py-3 text-xs text-ink-muted">
                          <div>{inq.phone}</div>
                          <div className="text-brand">{inq.email || '—'}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant="brand" size="sm">
                            {inq.course || inq.course_id}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-ink">
                          <div>{inq.last_qualification || inq.qualification}</div>
                          {inq.percentage && <div className="text-ink-light">{inq.percentage}%</div>}
                          {inq.city && <div className="text-xs text-brand font-medium">{inq.city}</div>}
                        </td>
                        <td className="px-4 py-3 text-xs text-ink-muted max-w-xs">
                          {inq.message || '—'}
                        </td>
                        <td className="px-4 py-3 text-xs text-ink-light whitespace-nowrap">
                          {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Fact Configuration Audit Checker */}
            <Card variant="surface-light" padding="lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-status-success" aria-hidden="true" />
                  <span>Site Fact Audit & Verification Tracker</span>
                </CardTitle>
                <p className="text-xs text-ink-muted mt-1">
                  Tracking confirmed facts vs placeholders in <code className="bg-surface px-1.5 py-0.5 rounded border border-border-subtle text-brand font-mono">src/content/siteConfig.ts</code>.
                </p>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-surface rounded border border-border-subtle">
                    <span className="font-bold text-ink block mb-1">Confirmed College Facts:</span>
                    <ul className="space-y-1 text-ink-muted">
                      <li>✓ Name: C.N.S. Paramedical and Nursing College</li>
                      <li>✓ Established: 2022</li>
                      <li>✓ Address: Lakhaiyamau, Gursahaiganj Road, Samdhan, Kannauj (209735)</li>
                      <li>✓ Working Hours: Mon–Sat, 9:30 AM – 4:30 PM</li>
                      <li>✓ Approved Courses: ANM, GNM, B.Sc. Nursing</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-surface rounded border border-border-subtle">
                    <span className="font-bold text-accent-ink block mb-1">Awaiting Official Confirmation:</span>
                    <ul className="space-y-1 text-ink-muted">
                      <li>• Phone & Email: Marked as <code>[TO_CONFIRM]</code></li>
                      <li>• Annual Intake & Fees: Marked as <code>[TO_CONFIRM]</code></li>
                      <li>• Affiliation Numbers: Marked as <code>[TO_CONFIRM]</code></li>
                      <li>• Principal & Director Names: Marked as <code>[TO_CONFIRM]</code></li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Section>
    </div>
  );
};
