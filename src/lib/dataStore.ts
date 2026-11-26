/**
 * Centralized Supabase Database Store for C.N.S. Paramedical and Nursing College
 * 
 * STRICT ARCHITECTURAL RULES:
 * 1. Zero mock data, demo mode, localStorage, or sessionStorage fallbacks.
 * 2. All data comes exclusively from and writes exclusively to Supabase.
 * 3. Every mutation checks for errors and confirms affected rows via .select().
 * 4. UI state is updated strictly after the database confirms.
 */

import { supabase } from './supabase';

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

/* =========================================================
 * STAFF DATABASE OPERATIONS
 * ========================================================= */

export async function fetchStaff(): Promise<StaffItem[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Database error fetching staff directory: ${error.message}`);
  }

  return data || [];
}

export async function saveStaff(
  payload: Omit<StaffItem, 'id' | 'created_at'>,
  editingId?: string
): Promise<StaffItem> {
  if (editingId) {
    const { data, error } = await supabase
      .from('staff')
      .update(payload)
      .eq('id', editingId)
      .select();

    if (error) {
      throw new Error(`Failed to update staff record in database: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('Database update rejected: No staff row was modified. Verify permissions.');
    }

    window.dispatchEvent(new CustomEvent('cns_staff_changed'));
    return data[0];
  } else {
    const { data, error } = await supabase
      .from('staff')
      .insert([payload])
      .select();

    if (error) {
      throw new Error(`Failed to create staff record in database: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('Database insert rejected: No staff row was created. Verify permissions.');
    }

    window.dispatchEvent(new CustomEvent('cns_staff_changed'));
    return data[0];
  }
}

export async function deleteStaff(id: string, photoUrl?: string | null): Promise<void> {
  // Delete photo from staff-photos storage if stored there
  if (photoUrl && photoUrl.includes('staff-photos')) {
    const parts = photoUrl.split('/staff-photos/');
    if (parts.length > 1) {
      const fileName = parts[1].split('?')[0];
      try {
        await supabase.storage.from('staff-photos').remove([fileName]);
      } catch (storageErr) {
        console.warn('Storage purge warning:', storageErr);
      }
    }
  }

  const { data, error } = await supabase
    .from('staff')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(`Failed to delete staff member from database: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('Database delete rejected: Staff record was not found or could not be removed.');
  }

  window.dispatchEvent(new CustomEvent('cns_staff_changed'));
}

export function subscribeStaffChange(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener('cns_staff_changed', handler);
  return () => {
    window.removeEventListener('cns_staff_changed', handler);
  };
}

/* =========================================================
 * NOTICES DATABASE OPERATIONS
 * ========================================================= */

export async function fetchNotices(activeOnly = false): Promise<NoticeItem[]> {
  let query = supabase
    .from('notices')
    .select('*')
    .order('published_at', { ascending: false });

  if (activeOnly) {
    query = query
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Database error fetching notices: ${error.message}`);
  }

  return data || [];
}

export async function saveNotice(
  payload: Omit<NoticeItem, 'id'>,
  editingId?: string
): Promise<NoticeItem> {
  if (editingId) {
    const { data, error } = await supabase
      .from('notices')
      .update(payload)
      .eq('id', editingId)
      .select();

    if (error) {
      throw new Error(`Failed to update notice in database: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('Database update rejected: No notice row was modified. Verify permissions.');
    }

    window.dispatchEvent(new CustomEvent('cns_notices_changed'));
    return data[0];
  } else {
    const { data, error } = await supabase
      .from('notices')
      .insert([payload])
      .select();

    if (error) {
      throw new Error(`Failed to publish notice in database: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('Database insert rejected: No notice row was created. Verify permissions.');
    }

    window.dispatchEvent(new CustomEvent('cns_notices_changed'));
    return data[0];
  }
}

export async function toggleNoticeActive(id: string, currentStatus: boolean): Promise<NoticeItem> {
  const { data, error } = await supabase
    .from('notices')
    .update({ is_active: !currentStatus })
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(`Failed to toggle notice status in database: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('Database toggle rejected: No notice row was updated. Verify permissions.');
  }

  window.dispatchEvent(new CustomEvent('cns_notices_changed'));
  return data[0];
}

export async function deleteNotice(id: string): Promise<void> {
  const { data, error } = await supabase
    .from('notices')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(`Failed to delete notice from database: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('Database delete rejected: Notice record was not found or could not be removed.');
  }

  window.dispatchEvent(new CustomEvent('cns_notices_changed'));
}

export function subscribeNoticesChange(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener('cns_notices_changed', handler);
  return () => {
    window.removeEventListener('cns_notices_changed', handler);
  };
}
