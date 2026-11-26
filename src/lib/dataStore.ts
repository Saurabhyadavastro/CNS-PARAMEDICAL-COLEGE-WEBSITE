/**
 * Unified Client & Admin Data Store for C.N.S. Paramedical and Nursing College
 * 
 * Ensures seamless bidirectional synchronization:
 * - When Supabase is configured: acts as the primary cloud database with local fallback caching.
 * - When in local preview mode: transparently saves to and reads from localStorage, emitting
 *   reactive broadcast events so changes made in /admin appear INSTANTLY on client-side
 *   pages (/faculty, /notices, and the home-page NoticeTicker) without requiring page reloads.
 */

import { supabase, isSupabaseConfigured } from './supabase';

export interface StaffItem {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  photo_url?: string | null;
  display_order: number;
  created_at?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  description: string;
  category: string;
  link_url?: string | null;
  published_at: string;
  expires_at?: string | null;
  is_active: boolean;
}

const STORAGE_KEY_STAFF = 'cns_persistent_staff';
const STORAGE_KEY_NOTICES = 'cns_persistent_notices';

export const initialStaffList: StaffItem[] = [
  {
    id: 'staff-1',
    name: '[TO_CONFIRM: Principal Name]',
    designation: 'Principal & Professor',
    department: 'Administration & Nursing Management',
    qualification: 'M.Sc. Nursing (Medical-Surgical), Ph.D. in Nursing',
    photo_url: null,
    display_order: 1,
  },
  {
    id: 'staff-2',
    name: '[TO_CONFIRM: Vice Principal Name]',
    designation: 'Vice Principal & Associate Professor',
    department: 'Obstetrics & Gynecological Nursing',
    qualification: 'M.Sc. Nursing (OBG), 12+ Years Clinical & Teaching Exp.',
    photo_url: null,
    display_order: 2,
  },
  {
    id: 'staff-3',
    name: '[TO_CONFIRM: Community Health Head]',
    designation: 'Assistant Professor & Field Supervisor',
    department: 'Community Health Nursing',
    qualification: 'M.Sc. Nursing (Community Health)',
    photo_url: null,
    display_order: 3,
  },
  {
    id: 'staff-4',
    name: '[TO_CONFIRM: Pediatric Nursing Head]',
    designation: 'Assistant Professor',
    department: 'Child Health (Pediatric) Nursing',
    qualification: 'M.Sc. Pediatric Nursing, RN, RM',
    photo_url: null,
    display_order: 4,
  },
  {
    id: 'staff-5',
    name: '[TO_CONFIRM: Foundations Tutor]',
    designation: 'Clinical Nursing Tutor',
    department: 'Nursing Foundations & Clinical Lab',
    qualification: 'B.Sc. Nursing with Intensive Care Diploma',
    photo_url: null,
    display_order: 5,
  },
  {
    id: 'staff-6',
    name: '[TO_CONFIRM: Anatomy & Bio-Science Tutor]',
    designation: 'Lecturer in Medical Sciences',
    department: 'Anatomy, Physiology & Microbiology',
    qualification: 'M.Sc. Medical Microbiology / Physiology',
    photo_url: null,
    display_order: 6,
  },
];

export const initialNoticesList: NoticeItem[] = [
  {
    id: 'not-01',
    title: 'Commencement of Admission Inquiries for Session 2026–2027 (ANM, GNM, B.Sc. Nursing)',
    category: 'Admissions',
    published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    description: 'Prospective nursing candidates and guardians are notified that preliminary online inquiries and in-person registration for the 2026–27 academic session have commenced. Candidates may visit the college desk from Monday to Saturday, 9:30 AM to 4:30 PM.',
    link_url: null,
    is_active: true,
    expires_at: null,
  },
  {
    id: 'not-02',
    title: 'Clinical Uniform & Diagnostic Equipment Specifications for Hospital Postings',
    category: 'Academic',
    published_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    description: 'All enrolled nursing students are required to adhere to uniform color codes and carry a standard clinical kit (stethoscope, manual sphygmomanometer, digital thermometer, and safety watch) during hospital rotations.',
    link_url: null,
    is_active: true,
    expires_at: null,
  },
  {
    id: 'not-03',
    title: 'Office Working Hours & Document Verification Desk Schedule',
    category: 'General',
    published_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    description: 'The administrative and admissions office operates Monday through Saturday, 9:30 AM – 4:30 PM (closed on Sundays and gazetted public holidays). Please bring original marksheets for verification.',
    link_url: null,
    is_active: true,
    expires_at: null,
  },
  {
    id: 'not-04',
    title: 'Zero Tolerance Anti-Ragging Policy & Student Grievance Committee',
    category: 'General',
    published_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    description: 'The college strictly enforces anti-ragging mandates in accordance with Supreme Court and nursing council directives. All admitted candidates and parents must sign the anti-ragging affidavit.',
    link_url: null,
    is_active: true,
    expires_at: null,
  },
];

// Helper: Get local staff
function getLocalStaff(): StaffItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STAFF);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error reading local staff:', e);
  }
  return initialStaffList;
}

// Helper: Set local staff
function setLocalStaff(items: StaffItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('cns_staff_changed', { detail: items }));
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY_STAFF }));
  } catch (e) {
    console.warn('Error setting local staff:', e);
  }
}

// Helper: Get local notices
function getLocalNotices(): NoticeItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTICES);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error reading local notices:', e);
  }
  return initialNoticesList;
}

// Helper: Set local notices
function setLocalNotices(items: NoticeItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY_NOTICES, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('cns_notices_changed', { detail: items }));
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY_NOTICES }));
  } catch (e) {
    console.warn('Error setting local notices:', e);
  }
}

/* =========================================================
 * STAFF STORE API
 * ========================================================= */

export async function fetchStaff(): Promise<StaffItem[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && Array.isArray(data)) {
        setLocalStaff(data);
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetchStaff error, falling back to local store:', err);
    }
  }
  return getLocalStaff();
}

export async function saveStaff(
  payload: Omit<StaffItem, 'id'>,
  editingId?: string
): Promise<StaffItem> {
  let savedItem: StaffItem;

  if (isSupabaseConfigured) {
    if (editingId) {
      const { data, error } = await supabase
        .from('staff')
        .update(payload)
        .eq('id', editingId)
        .select()
        .single();
      if (error) throw error;
      savedItem = data;
    } else {
      const { data, error } = await supabase
        .from('staff')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      savedItem = data;
    }
  } else {
    savedItem = {
      id: editingId || `st-${Date.now()}`,
      ...payload,
      created_at: new Date().toISOString(),
    };
  }

  // Update local store & notify listeners
  const current = getLocalStaff();
  let updated: StaffItem[];
  if (editingId) {
    updated = current.map((s) => (s.id === editingId ? { ...s, ...payload } : s));
  } else {
    updated = [...current, savedItem];
  }
  updated.sort((a, b) => a.display_order - b.display_order);
  setLocalStaff(updated);

  return savedItem;
}

export async function deleteStaff(id: string, photoUrl?: string | null): Promise<void> {
  if (isSupabaseConfigured) {
    // Delete photo from storage if stored in staff-photos
    if (photoUrl && photoUrl.includes('staff-photos')) {
      const parts = photoUrl.split('/staff-photos/');
      if (parts.length > 1) {
        const fileName = parts[1].split('?')[0];
        await supabase.storage.from('staff-photos').remove([fileName]);
      }
    }

    const { error } = await supabase.from('staff').delete().eq('id', id);
    if (error) throw error;
  }

  // Update local store & notify listeners
  const current = getLocalStaff();
  const updated = current.filter((s) => s.id !== id);
  setLocalStaff(updated);
}

export function subscribeStaffChange(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener('cns_staff_changed', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('cns_staff_changed', handler);
    window.removeEventListener('storage', handler);
  };
}

/* =========================================================
 * NOTICES STORE API
 * ========================================================= */

export async function fetchNotices(activeOnly = false): Promise<NoticeItem[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from('notices')
        .select('*')
        .order('published_at', { ascending: false });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        if (!activeOnly) {
          setLocalNotices(data);
        }
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetchNotices error, falling back to local store:', err);
    }
  }

  const all = getLocalNotices();
  if (!activeOnly) return all;

  const now = new Date().getTime();
  return all.filter((n) => {
    if (!n.is_active) return false;
    if (n.expires_at) {
      return new Date(n.expires_at).getTime() > now;
    }
    return true;
  });
}

export async function saveNotice(
  payload: Omit<NoticeItem, 'id'>,
  editingId?: string
): Promise<NoticeItem> {
  let savedNotice: NoticeItem;

  if (isSupabaseConfigured) {
    if (editingId) {
      const { data, error } = await supabase
        .from('notices')
        .update(payload)
        .eq('id', editingId)
        .select()
        .single();
      if (error) throw error;
      savedNotice = data;
    } else {
      const { data, error } = await supabase
        .from('notices')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      savedNotice = data;
    }
  } else {
    savedNotice = {
      id: editingId || `n-${Date.now()}`,
      ...payload,
    };
  }

  // Update local store & notify listeners
  const current = getLocalNotices();
  let updated: NoticeItem[];
  if (editingId) {
    updated = current.map((n) => (n.id === editingId ? { ...n, ...payload } : n));
  } else {
    updated = [savedNotice, ...current];
  }
  setLocalNotices(updated);

  return savedNotice;
}

export async function deleteNotice(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) throw error;
  }

  const current = getLocalNotices();
  const updated = current.filter((n) => n.id !== id);
  setLocalNotices(updated);
}

export async function toggleNoticeActive(id: string, currentStatus: boolean): Promise<boolean> {
  const newStatus = !currentStatus;

  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('notices')
      .update({ is_active: newStatus })
      .eq('id', id);
    if (error) throw error;
  }

  const current = getLocalNotices();
  const updated = current.map((n) => (n.id === id ? { ...n, is_active: newStatus } : n));
  setLocalNotices(updated);

  return newStatus;
}

export function subscribeNoticesChange(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener('cns_notices_changed', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('cns_notices_changed', handler);
    window.removeEventListener('storage', handler);
  };
}
