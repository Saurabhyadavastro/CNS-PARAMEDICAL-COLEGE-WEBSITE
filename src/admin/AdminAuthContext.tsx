import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toast';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  userEmail: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  /**
   * Verifies if the authenticated user has active administrator privileges
   * in the admin_users table (or via is_admin() RPC function).
   */
  const checkAdminStatus = async (userId: string): Promise<boolean> => {
    try {
      // 1. Try is_admin() database function
      const { data: rpcData, error: rpcError } = await supabase.rpc('is_admin');
      if (!rpcError && typeof rpcData === 'boolean') {
        return rpcData;
      }

      // 2. Direct check in admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('admin_users query error:', error.message);
        return false;
      }

      return Boolean(data);
    } catch (err) {
      console.warn('Error checking admin status:', err);
      return false;
    }
  };

  const verifySession = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session && session.user) {
        const isUserAdmin = await checkAdminStatus(session.user.id);
        setIsAuthenticated(true);
        setIsAdmin(isUserAdmin);
        setUserEmail(session.user.email || null);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUserEmail(null);
      }
    } catch (err) {
      console.error('Session verification error:', err);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserEmail(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const isUserAdmin = await checkAdminStatus(session.user.id);
        setIsAuthenticated(true);
        setIsAdmin(isUserAdmin);
        setUserEmail(session.user.email || null);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUserEmail(null);
      } else if (event === 'TOKEN_REFRESHED' && !session) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUserEmail(null);
        addToast({
          type: 'warning',
          title: 'Session Expired',
          message: 'Your administrator session has expired. Please log in again.',
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [verifySession, addToast]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const isUserAdmin = await checkAdminStatus(data.user.id);
        if (!isUserAdmin) {
          // Reject user if not registered in admin_users
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Access denied: Your account is not authorized in the admin_users registry.',
          };
        }

        setIsAuthenticated(true);
        setIsAdmin(true);
        setUserEmail(data.user.email || email);
        return { success: true };
      }

      return { success: false, error: 'Authentication could not be completed.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login request failed.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Signout warning:', err);
    } finally {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserEmail(null);
      addToast({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been safely signed out of the administrator portal.',
      });
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        isLoading,
        userEmail,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
