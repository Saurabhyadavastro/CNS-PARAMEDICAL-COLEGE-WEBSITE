import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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

  const checkAdminStatus = async (userId: string): Promise<boolean> => {
    if (!isSupabaseConfigured) return true; // Local preview mode
    try {
      // 1. Try is_admin() RPC function
      const { data: rpcData, error: rpcError } = await supabase.rpc('is_admin');
      if (!rpcError && typeof rpcData === 'boolean') {
        return rpcData;
      }

      // 2. Fallback check directly in admin_users table
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
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
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
      } else {
        // Check session storage for local demo session
        const demoLogged = sessionStorage.getItem('cns_demo_admin');
        if (demoLogged) {
          setIsAuthenticated(true);
          setIsAdmin(true);
          setUserEmail(demoLogged);
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setUserEmail(null);
        }
      }
    } catch (err) {
      console.error('Session verification error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();

    if (isSupabaseConfigured) {
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
          sessionStorage.removeItem('cns_demo_admin');
        } else if (event === 'TOKEN_REFRESHED' && !session) {
          // Token expired and failed to refresh
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
    }
  }, [verifySession]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isSupabaseConfigured) {
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
            // User exists in auth but is not in admin_users!
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
      } else {
        // Local preview demo credentials
        if (email.trim() && pass.trim()) {
          sessionStorage.setItem('cns_demo_admin', email.trim());
          setIsAuthenticated(true);
          setIsAdmin(true);
          setUserEmail(email.trim());
          return { success: true };
        }
        return { success: false, error: 'Please enter valid credentials.' };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login request failed.' };
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Signout warning:', err);
    } finally {
      sessionStorage.removeItem('cns_demo_admin');
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserEmail(null);
      addToast({
        type: 'info',
        title: 'Logged Out',
        message: 'You have safely exited the administration portal.',
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

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
