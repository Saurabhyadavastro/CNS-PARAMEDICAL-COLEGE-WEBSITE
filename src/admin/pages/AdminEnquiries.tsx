import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Search, 
  Phone, 
  Download, 
  RefreshCw, 
  Eye, 
  CheckCircle2, 
  PhoneCall 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { SEO } from '../../components/common/SEO';

interface EnquiryItem {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  course: 'ANM' | 'GNM' | 'B.Sc. Nursing' | 'Other';
  last_qualification: string;
  percentage?: number | null;
  city?: string | null;
  message?: string | null;
  status: 'new' | 'in_progress' | 'resolved';
  admin_notes?: string | null;
  created_at: string;
}

export const AdminEnquiries: React.FC = () => {
  const { addToast } = useToast();

  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  // Detail Drawer / Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [detailStatus, setDetailStatus] = useState<'new' | 'in_progress' | 'resolved'>('new');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
    } catch (err: any) {
      console.error('Fetch enquiries error:', err);
      addToast({
        type: 'error',
        title: 'Error Loading Enquiries',
        message: err?.message || 'Could not fetch admission enquiries from database.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const openDetailDrawer = (enquiry: EnquiryItem) => {
    setSelectedEnquiry(enquiry);
    setDetailStatus(enquiry.status);
    setAdminNotes(enquiry.admin_notes || '');
  };

  const handleUpdateEnquiry = async () => {
    if (!selectedEnquiry) return;
    setIsUpdating(true);

    try {
      const { data, error } = await supabase
        .from('enquiries')
        .update({
          status: detailStatus,
          admin_notes: adminNotes.trim() || null,
        })
        .eq('id', selectedEnquiry.id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('Update failed: Enquiry record not found in database.');
      }

      addToast({
        type: 'success',
        title: 'Enquiry Updated',
        message: `Status updated to "${detailStatus}" and notes saved.`,
      });

      setSelectedEnquiry(null);
      await fetchEnquiries();
    } catch (err: any) {
      console.error('Update enquiry error:', err);
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err?.message || 'Could not update enquiry status.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter & Search Logic
  const filteredEnquiries = enquiries.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.phone.includes(q) ||
      (item.city && item.city.toLowerCase().includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || item.course === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  // Export to CSV Generator
  const handleExportCSV = () => {
    if (filteredEnquiries.length === 0) {
      addToast({
        type: 'warning',
        title: 'No Data to Export',
        message: 'There are no enquiry records matching the current filters.',
      });
      return;
    }

    const headers = [
      'Submission Date',
      'Candidate Name',
      'Mobile Phone',
      'Email Address',
      'Course',
      'Qualification',
      'Percentage (%)',
      'City / Village',
      'Status',
      'Candidate Message',
      'Admin Notes',
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredEnquiries.map((e) => [
      escapeCsv(new Date(e.created_at).toLocaleString('en-IN')),
      escapeCsv(e.name),
      escapeCsv(e.phone),
      escapeCsv(e.email || ''),
      escapeCsv(e.course),
      escapeCsv(e.last_qualification),
      escapeCsv(e.percentage || ''),
      escapeCsv(e.city || ''),
      escapeCsv(e.status),
      escapeCsv(e.message || ''),
      escapeCsv(e.admin_notes || ''),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cns_admissions_enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: `Exported ${filteredEnquiries.length} enquiry records.`,
    });
  };

  return (
    <div className="space-y-6">
      <SEO
        title="Manage Admission Enquiries"
        description="Review candidate admission inquiries, manage counseling status, and export leads for C.N.S. Paramedical College."
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-6 rounded-xl border border-border-subtle shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink">
            Admission Leads & Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Track student inquiries, manage counseling status, and export data.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchEnquiries}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV ({filteredEnquiries.length})
          </Button>
        </div>
      </div>

      {/* Filters & Search Control Card */}
      <Card variant="surface-light" padding="md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            id="enquiry-search"
            label="Search Candidate"
            placeholder="Search by name, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-ink-light" />}
          />

          <Select
            id="enquiry-status-filter"
            label="Filter by Status"
            options={[
              { label: 'All Statuses', value: 'all' },
              { label: 'New Inquiries', value: 'new' },
              { label: 'In Progress (Counseling)', value: 'in_progress' },
              { label: 'Resolved (Confirmed/Closed)', value: 'resolved' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />

          <Select
            id="enquiry-course-filter"
            label="Filter by Course"
            options={[
              { label: 'All Courses', value: 'all' },
              { label: 'ANM (2 Years)', value: 'ANM' },
              { label: 'GNM (3 Years)', value: 'GNM' },
              { label: 'B.Sc. Nursing (4 Years)', value: 'B.Sc. Nursing' },
              { label: 'Other', value: 'Other' },
            ]}
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          />
        </div>
      </Card>

      {/* Enquiries Table */}
      <Card variant="default" padding="none" className="overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            <Skeleton variant="text" className="h-10 w-full" />
            <Skeleton variant="text" className="h-10 w-full" />
            <Skeleton variant="text" className="h-10 w-full" />
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center text-ink-muted">
            <Inbox className="w-12 h-12 mx-auto mb-2 text-ink-light" />
            <h3 className="font-bold text-base text-ink mb-1">No Enquiries Found</h3>
            <p className="text-xs mb-4">No submissions match your active filter and search terms.</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCourseFilter('all');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-subtle text-left text-xs sm:text-sm" aria-label="Enquiries table">
              <thead className="bg-surface-light text-ink font-semibold uppercase text-xs">
                <tr>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Candidate</th>
                  <th scope="col" className="px-4 py-3">Phone</th>
                  <th scope="col" className="px-4 py-3">Program</th>
                  <th scope="col" className="px-4 py-3">Qualification</th>
                  <th scope="col" className="px-4 py-3">City</th>
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-ink">
                {filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-surface-light transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge
                        variant={enq.status === 'resolved' ? 'success' : enq.status === 'in_progress' ? 'warning' : 'accent'}
                        size="sm"
                      >
                        {enq.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-ink">{enq.name}</div>
                      {enq.email && <div className="text-xs text-brand">{enq.email}</div>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a
                        href={`tel:${enq.phone}`}
                        className="inline-flex items-center gap-1 font-mono text-brand hover:underline"
                        title="Click to call candidate"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{enq.phone}</span>
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="brand" size="sm">{enq.course}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div>{enq.last_qualification}</div>
                      {enq.percentage && <span className="text-ink-light">({enq.percentage}%)</span>}
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {enq.city || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-light whitespace-nowrap">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDetailDrawer(enq)}
                        className="text-brand hover:text-brand-dark"
                        rightIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Enquiry Detail Drawer / Modal */}
      <Modal
        isOpen={Boolean(selectedEnquiry)}
        onClose={() => setSelectedEnquiry(null)}
        title={selectedEnquiry ? `Enquiry: ${selectedEnquiry.name}` : 'Enquiry Detail'}
        description={selectedEnquiry ? `Submitted on ${new Date(selectedEnquiry.created_at).toLocaleString()}` : ''}
        size="lg"
      >
        {selectedEnquiry && (
          <div className="space-y-6">
            {/* Candidate Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-light border border-border-subtle text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-ink-light block text-xs">Candidate Name:</span>
                <span className="font-bold text-ink text-base">{selectedEnquiry.name}</span>
              </div>

              <div className="space-y-1">
                <span className="text-ink-light block text-xs">Phone Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-ink">{selectedEnquiry.phone}</span>
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline bg-brand-faint px-2 py-0.5 rounded"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-ink-light block text-xs">Email Address:</span>
                {selectedEnquiry.email ? (
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-brand hover:underline font-medium">
                    {selectedEnquiry.email}
                  </a>
                ) : (
                  <span className="text-ink-muted">Not provided</span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-ink-light block text-xs">Desired Nursing Program:</span>
                <Badge variant="brand" size="md">{selectedEnquiry.course}</Badge>
              </div>

              <div className="space-y-1">
                <span className="text-ink-light block text-xs">Last Academic Qualification:</span>
                <span className="font-medium text-ink">{selectedEnquiry.last_qualification}</span>
                {selectedEnquiry.percentage && (
                  <span className="text-ink-muted ml-1">({selectedEnquiry.percentage}%)</span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-ink-light block text-xs">Location / City:</span>
                <span className="font-medium text-ink">{selectedEnquiry.city || 'Samdhan / Kannauj'}</span>
              </div>
            </div>

            {/* Candidate Message */}
            <div>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-1">
                Candidate Note / Query
              </h4>
              <div className="p-3.5 rounded-lg bg-surface border border-border-subtle text-xs sm:text-sm text-ink-muted leading-relaxed">
                {selectedEnquiry.message || 'No additional note provided with inquiry.'}
              </div>
            </div>

            {/* Counselor Update Panel */}
            <div className="p-4 rounded-xl border border-brand/20 bg-brand-faint/50 space-y-4">
              <h4 className="font-bold text-ink text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand" />
                <span>Counseling Follow-Up & Notes</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  id="enquiry-status-update"
                  label="Admission Status"
                  options={[
                    { label: 'New Inquiry (Pending Follow-up)', value: 'new' },
                    { label: 'In Progress (Candidate Contacted)', value: 'in_progress' },
                    { label: 'Resolved (Seat Confirmed / Closed)', value: 'resolved' },
                  ]}
                  value={detailStatus}
                  onChange={(e) => setDetailStatus(e.target.value as any)}
                />
              </div>

              <Textarea
                id="enquiry-admin-notes"
                label="Internal Admin & Counseling Notes"
                rows={3}
                placeholder="Enter counseling summary, parent discussion notes, fee confirmation details..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                helperText="Saved notes are visible only to authorized administrators"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setSelectedEnquiry(null)}
                disabled={isUpdating}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleUpdateEnquiry}
                isLoading={isUpdating}
                disabled={isUpdating}
              >
                Save Status & Notes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
