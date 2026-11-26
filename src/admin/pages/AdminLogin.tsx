import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Key, ArrowRight, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { SEO } from '../../components/common/SEO';

export const AdminLogin: React.FC = () => {
  const { isAuthenticated, isAdmin, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect if already logged in and verified admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const target = (location.state as any)?.from?.pathname || '/admin';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials or user is not authorized in admin_users.');
      } else {
        const target = (location.state as any)?.from?.pathname || '/admin';
        navigate(target, { replace: true });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <SEO
        title="Admin Portal Login"
        description="Authorized staff and administrative login for C.N.S. Paramedical and Nursing College."
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white mb-6 focus-ring-navy rounded py-1 px-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to College Website</span>
        </Link>

        <div className="w-20 h-20 rounded-2xl bg-white p-2 mx-auto flex items-center justify-center shadow-xl mb-4 border border-navy-border/60">
          <img
            src="/images/Logos/College Logo.png"
            alt="C.N.S. Paramedical & Nursing College Official Emblem"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          C.N.S. Staff Administration
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-300">
          Sign in to manage student admission inquiries, staff directory, and circulars.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card variant="default" padding="lg" className="border-t-4 border-t-brand shadow-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="navy" size="sm" className="inline-flex items-center gap-1">
                <Lock className="w-3 h-3 text-accent" aria-hidden="true" />
                <span>Staff Sign-In</span>
              </Badge>
              <span className="text-[11px] text-ink-light">Password Authentication Only</span>
            </div>
          </CardHeader>

          <CardContent>
            {errorMessage && (
              <div
                role="alert"
                className="mb-4 p-3.5 rounded-lg bg-status-error-soft border border-status-error/30 text-status-error text-xs flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Input
                id="admin-email"
                name="email"
                type="email"
                label="Registered Staff Email"
                required
                placeholder="admin@cnscollege.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                leftIcon={<Mail className="w-4 h-4 text-ink-light" aria-hidden="true" />}
              />

              <Input
                id="admin-password"
                name="password"
                type="password"
                label="Account Password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                leftIcon={<Key className="w-4 h-4 text-ink-light" aria-hidden="true" />}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
                >
                  {isLoading ? 'Authenticating...' : 'Sign In to Admin Portal'}
                </Button>
              </div>
            </form>

            {/* Security Notes & Configuration Guide */}
            <div className="mt-6 pt-4 border-t border-border-subtle text-xs text-ink-muted space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-ink">
                <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                <span>Protected Portal:</span>
                <span className="text-brand font-medium">Supabase Auth Session</span>
              </div>

              <p className="text-[11px] text-ink-light leading-relaxed">
                Public user self-registration is permanently disabled. Only staff accounts registered in the <code className="bg-surface px-1 py-0.5 rounded font-mono text-brand">admin_users</code> database table with active credentials can access this console.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
