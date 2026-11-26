import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  ExternalLink 
} from 'lucide-react';
import { 
  fetchNotices as loadNoticesFromStore, 
  saveNotice as persistNotice, 
  deleteNotice as removeNotice, 
  toggleNoticeActive as switchNoticeActive, 
  subscribeNoticesChange, 
  NoticeItem 
} from '../../lib/dataStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { SEO } from '../../components/common/SEO';

export const AdminNotices: React.FC = () => {
  const { addToast } = useToast();

  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [linkUrl, setLinkUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete State
  const [deleteCandidate, setDeleteCandidate] = useState<NoticeItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryOptions = [
    { label: 'General Announcement', value: 'General' },
    { label: 'Admissions Notice', value: 'Admissions' },
    { label: 'Examination Schedule', value: 'Examination' },
    { label: 'Academic & Syllabus', value: 'Academic' },
  ];

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const data = await loadNoticesFromStore(false);
      setNotices(data);
    } catch (err: any) {
      console.error('Fetch notices error:', err);
      addToast({
        type: 'error',
        title: 'Error Loading Notices',
        message: err?.message || 'Could not fetch notices.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
    const unsubscribe = subscribeNoticesChange(() => {
      fetchNotices();
    });
    return unsubscribe;
  }, []);

  const openAddModal = () => {
    setEditingNotice(null);
    setTitle('');
    setDescription('');
    setCategory('General');
    setLinkUrl('');
    setIsActive(true);
    setExpiresAt('');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (notice: NoticeItem) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setDescription(notice.description);
    setCategory(notice.category);
    setLinkUrl(notice.link_url || '');
    setIsActive(notice.is_active);
    setExpiresAt(notice.expires_at ? notice.expires_at.split('T')[0] : '');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const toggleNoticeActive = async (notice: NoticeItem) => {
    try {
      const newStatus = await switchNoticeActive(notice.id, notice.is_active);

      addToast({
        type: 'success',
        title: newStatus ? 'Notice Activated' : 'Notice Deactivated',
        message: `Notice status updated to ${newStatus ? 'Active' : 'Inactive'}.`,
      });
      fetchNotices();
    } catch (err: any) {
      console.error('Toggle error:', err);
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err?.message || 'Could not toggle notice status.',
      });
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 5) errs.title = 'Title must be at least 5 characters.';
    if (!description.trim() || description.trim().length < 5) errs.description = 'Description must be at least 5 characters.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        link_url: linkUrl.trim() || null,
        is_active: isActive,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        published_at: editingNotice ? editingNotice.published_at : new Date().toISOString(),
      };

      await persistNotice(payload, editingNotice?.id);

      addToast({
        type: 'success',
        title: editingNotice ? 'Notice Updated' : 'Notice Published',
        message: 'The circular has been saved successfully.',
      });

      setIsModalOpen(false);
      fetchNotices();
    } catch (err: any) {
      console.error('Save notice error:', err);
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err?.message || 'Could not save notice.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);

    try {
      await removeNotice(deleteCandidate.id);

      addToast({
        type: 'success',
        title: 'Notice Deleted',
        message: 'Notice was permanently removed.',
      });

      setDeleteCandidate(null);
      fetchNotices();
    } catch (err: any) {
      console.error('Delete notice error:', err);
      addToast({
        type: 'error',
        title: 'Deletion Failed',
        message: err?.message || 'Could not delete notice.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <SEO
        title="Manage Notices & Circulars"
        description="Administrative management of academic circulars and notices for C.N.S. Paramedical and Nursing College."
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-6 rounded-xl border border-border-subtle shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink">
            Notices & Circulars Management
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Publish official announcements, set expiry dates, and toggle ticker visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchNotices}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={openAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Publish New Notice
          </Button>
        </div>
      </div>

      {/* Notices Table */}
      <Card variant="default" padding="none" className="overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            <Skeleton variant="text" className="h-10 w-full" />
            <Skeleton variant="text" className="h-10 w-full" />
            <Skeleton variant="text" className="h-10 w-full" />
          </div>
        ) : notices.length === 0 ? (
          <div className="p-12 text-center text-ink-muted">
            <Bell className="w-12 h-12 mx-auto mb-2 text-ink-light" />
            <h3 className="font-bold text-base text-ink mb-1">No Notices Published</h3>
            <p className="text-xs mb-4">Click "Publish New Notice" to add your first circular.</p>
            <Button variant="primary" size="sm" onClick={openAddModal}>
              Create Notice
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-subtle text-left text-xs sm:text-sm" aria-label="Notices table">
              <thead className="bg-surface-light text-ink font-semibold uppercase text-xs">
                <tr>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Notice Title & Details</th>
                  <th scope="col" className="px-4 py-3">Published Date</th>
                  <th scope="col" className="px-4 py-3">Expires</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-ink">
                {notices.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-light transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleNoticeActive(item)}
                        className="inline-flex items-center gap-1.5 focus-ring rounded py-0.5 px-1 font-semibold text-xs"
                        title="Click to toggle active state"
                      >
                        {item.is_active ? (
                          <Badge variant="success" size="sm">Active</Badge>
                        ) : (
                          <Badge variant="neutral" size="sm">Inactive</Badge>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="brand" size="sm">{item.category}</Badge>
                    </td>
                    <td className="px-4 py-3 max-w-md">
                      <div className="font-bold text-ink">{item.title}</div>
                      <div className="text-xs text-ink-muted line-clamp-2 mt-0.5">
                        {item.description}
                      </div>
                      {item.link_url && (
                        <a
                          href={item.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-brand hover:underline mt-1"
                        >
                          <span>Attachment Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-ink-light">
                      {new Date(item.published_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-ink-light">
                      {item.expires_at ? new Date(item.expires_at).toLocaleDateString() : 'Permanent'}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(item)}
                          className="text-brand hover:text-brand-dark"
                          aria-label={`Edit ${item.title}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteCandidate(item)}
                          className="text-status-error hover:bg-status-error-soft"
                          aria-label={`Delete ${item.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Notice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNotice ? 'Edit Notice' : 'Publish New Notice'}
        description="Enter circular title, details, and optional expiration date."
        size="lg"
      >
        <form onSubmit={handleSaveNotice} noValidate className="space-y-4">
          <Input
            id="notice-title"
            label="Notice Title"
            required
            placeholder="e.g. Schedule of B.Sc. Nursing Examination"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={formErrors.title}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="notice-category"
              label="Notice Category"
              required
              options={categoryOptions}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <Input
              id="notice-expires"
              label="Optional Expiry Date"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              helperText="Notice will stop showing publicly after this date"
            />
          </div>

          <Textarea
            id="notice-desc"
            label="Notice Body / Description"
            required
            rows={4}
            placeholder="Provide complete circular details, venue, time, or eligibility..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={formErrors.description}
          />

          <Input
            id="notice-link"
            label="External Document / Attachment URL (Optional)"
            type="url"
            placeholder="https://example.com/circular.pdf"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            helperText="Link to PDF syllabus or government gazette"
          />

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="notice-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-brand rounded border-border-subtle focus-ring"
            />
            <label htmlFor="notice-active" className="text-sm font-semibold text-ink cursor-pointer">
              Notice is Active (Visible on Public Website & Ticker)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <Button variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isSaving} disabled={isSaving}>
              {editingNotice ? 'Save Notice' : 'Publish Notice'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        title="Confirm Notice Deletion"
        description="Are you sure you want to delete this notice? This action is permanent."
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-ink">
            Circular: <strong>{deleteCandidate?.title}</strong>
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteCandidate(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={isDeleting}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
