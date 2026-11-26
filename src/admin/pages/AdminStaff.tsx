import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  RefreshCw,
  X
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { 
  fetchStaff as loadStaffFromStore, 
  saveStaff as persistStaff, 
  deleteStaff as removeStaff, 
  subscribeStaffChange, 
  StaffItem 
} from '../../lib/dataStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { SEO } from '../../components/common/SEO';

export const AdminStaff: React.FC = () => {
  const { addToast } = useToast();

  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StaffItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [qualification, setQualification] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete Confirmation Modal
  const [deleteCandidate, setDeleteCandidate] = useState<StaffItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const data = await loadStaffFromStore();
      setStaffList(data);
    } catch (err: any) {
      console.error('Staff fetch error:', err);
      addToast({
        type: 'error',
        title: 'Error Loading Staff',
        message: err?.message || 'Could not retrieve staff list.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    const unsubscribe = subscribeStaffChange(() => {
      fetchStaff();
    });
    return unsubscribe;
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setDesignation('');
    setDepartment('');
    setQualification('');
    setDisplayOrder(staffList.length + 1);
    setPhotoUrl('');
    setSelectedFile(null);
    setFilePreview(null);
    setUploadError(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (item: StaffItem) => {
    setEditingItem(item);
    setName(item.name);
    setDesignation(item.designation);
    setDepartment(item.department);
    setQualification(item.qualification);
    setDisplayOrder(item.display_order || 0);
    setPhotoUrl(item.photo_url || '');
    setSelectedFile(null);
    setFilePreview(item.photo_url || null);
    setUploadError(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      setFilePreview(photoUrl || null);
      return;
    }

    const file = e.target.files[0];

    // File size check: Max 2 MB (2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image size exceeds 2 MB limit. Please select a smaller photo.');
      setSelectedFile(null);
      return;
    }

    // MIME type check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid format. Only JPEG, PNG, or WEBP images are supported.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) errs.name = 'Full name is required (min 2 chars).';
    if (!designation.trim()) errs.designation = 'Designation is required.';
    if (!department.trim()) errs.department = 'Department is required.';
    if (!qualification.trim()) errs.qualification = 'Qualification is required.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    let finalPhotoUrl = photoUrl;

    try {
      // 1. Upload photo to staff-photos bucket if new file selected
      if (selectedFile && isSupabaseConfigured) {
        const fileExt = selectedFile.name.split('.').pop() || 'jpg';
        const cleanBase = selectedFile.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
        const fileName = `${Date.now()}_${cleanBase}.${fileExt}`;

        const { error: uploadErr } = await supabase.storage
          .from('staff-photos')
          .upload(fileName, selectedFile, {
            contentType: selectedFile.type,
            upsert: true,
          });

        if (uploadErr) {
          throw new Error(`Photo upload failed: ${uploadErr.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('staff-photos')
          .getPublicUrl(fileName);

        finalPhotoUrl = publicUrl;
      }

      const payload = {
        name: name.trim(),
        designation: designation.trim(),
        department: department.trim(),
        qualification: qualification.trim(),
        display_order: Number(displayOrder) || 0,
        photo_url: finalPhotoUrl || null,
      };

      await persistStaff(payload, editingItem?.id);

      addToast({
        type: 'success',
        title: editingItem ? 'Staff Member Updated' : 'Staff Member Added',
        message: `${name} has been successfully recorded in the directory.`,
      });

      setIsModalOpen(false);
      fetchStaff();
    } catch (err: any) {
      console.error('Save staff error:', err);
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err?.message || 'Could not save staff record.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);

    try {
      await removeStaff(deleteCandidate.id, deleteCandidate.photo_url);

      addToast({
        type: 'success',
        title: 'Staff Member Deleted',
        message: `${deleteCandidate.name} was removed from the staff directory.`,
      });

      setDeleteCandidate(null);
      fetchStaff();
    } catch (err: any) {
      console.error('Delete staff error:', err);
      addToast({
        type: 'error',
        title: 'Deletion Failed',
        message: err?.message || 'Could not delete staff member.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <SEO
        title="Manage Staff Directory"
        description="Administrative management of faculty and educators for C.N.S. Paramedical and Nursing College."
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-6 rounded-xl border border-border-subtle shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink">
            Faculty & Staff Directory
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Manage profiles, academic qualifications, and departmental affiliations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchStaff}
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
            Add New Faculty
          </Button>
        </div>
      </div>

      {/* Staff Table / Cards */}
      <Card variant="default" padding="none" className="overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            <Skeleton variant="text" className="h-10 w-full" />
            <Skeleton variant="text" className="h-10 w-full" />
            <Skeleton variant="text" className="h-10 w-full" />
          </div>
        ) : staffList.length === 0 ? (
          <div className="p-12 text-center text-ink-muted">
            <Users className="w-12 h-12 mx-auto mb-2 text-ink-light" />
            <h3 className="font-bold text-base text-ink mb-1">No Staff Profiles Added</h3>
            <p className="text-xs mb-4">Click "Add New Faculty" to publish your first academic staff record.</p>
            <Button variant="primary" size="sm" onClick={openAddModal}>
              Add Faculty Profile
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-subtle text-left text-xs sm:text-sm" aria-label="Faculty table">
              <thead className="bg-surface-light text-ink font-semibold uppercase text-xs">
                <tr>
                  <th scope="col" className="px-4 py-3">Order</th>
                  <th scope="col" className="px-4 py-3">Photo</th>
                  <th scope="col" className="px-4 py-3">Name & Designation</th>
                  <th scope="col" className="px-4 py-3">Department</th>
                  <th scope="col" className="px-4 py-3">Qualification</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-ink">
                {staffList.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-light transition-colors">
                    <td className="px-4 py-3 font-mono text-ink-light">
                      #{item.display_order}
                    </td>
                    <td className="px-4 py-3">
                      {item.photo_url ? (
                        <img
                          src={item.photo_url}
                          alt={item.name}
                          className="w-10 h-10 rounded-full object-cover border border-border-subtle"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-brand-faint text-brand font-bold flex items-center justify-center text-xs">
                          {item.name.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase() || 'ST'}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-ink">{item.name}</div>
                      <div className="text-xs text-brand font-medium">{item.designation}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="brand" size="sm">{item.department}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-muted max-w-xs">
                      {item.qualification}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(item)}
                          className="text-brand hover:text-brand-dark"
                          aria-label={`Edit ${item.name}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteCandidate(item)}
                          className="text-status-error hover:bg-status-error-soft"
                          aria-label={`Delete ${item.name}`}
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

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Faculty Profile' : 'Add New Faculty Member'}
        description="Fill out faculty details and upload profile photograph to staff-photos bucket."
        size="lg"
      >
        <form onSubmit={handleSaveStaff} noValidate className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="staff-name"
              label="Full Name"
              required
              placeholder="e.g. Dr. Rajesh Mishra"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={formErrors.name}
            />

            <Input
              id="staff-designation"
              label="Designation / Role"
              required
              placeholder="e.g. Associate Professor / Nursing Tutor"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              error={formErrors.designation}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="staff-department"
              label="Department"
              required
              placeholder="e.g. Community Health Nursing"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              error={formErrors.department}
            />

            <Input
              id="staff-order"
              label="Display Order (Sort rank)"
              type="number"
              min="0"
              value={displayOrder.toString()}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
              helperText="Lower numbers appear first in the public directory"
            />
          </div>

          <Input
            id="staff-qualification"
            label="Qualifications & Degrees"
            required
            placeholder="e.g. M.Sc. Nursing (OBG), B.Sc. Nursing, RN, RM"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            error={formErrors.qualification}
          />

          {/* Photo Upload Area */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink">
              Profile Photo (Max 2 MB, JPG/PNG/WebP)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg border border-border-subtle bg-surface-light">
              {filePreview ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-brand shrink-0">
                  <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreview(null);
                      setPhotoUrl('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    aria-label="Remove photo preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-surface-muted border-2 border-dashed border-border-subtle flex items-center justify-center text-ink-light shrink-0">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}

              <div className="flex-1 w-full text-center sm:text-left">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="staff-photo-file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                >
                  Choose Image File
                </Button>
                <p className="text-[11px] text-ink-light mt-1">
                  Upload directly to the <code>staff-photos</code> bucket.
                </p>
                {uploadError && (
                  <p className="text-xs text-status-error font-medium mt-1">{uploadError}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <Button variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isSaving} disabled={isSaving}>
              {editingItem ? 'Save Changes' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        title="Confirm Faculty Removal"
        description="Are you sure you want to delete this staff member? This will remove their record and purge any uploaded photo from Storage."
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-ink">
            Member: <strong>{deleteCandidate?.name}</strong> ({deleteCandidate?.designation})
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
