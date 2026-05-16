import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWorkerAuth } from '@/contexts/WorkerAuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Shirt, Lock, HardHat } from 'lucide-react';
import { CaptchaWidget } from '@/components/CaptchaWidget';

const WorkerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const { login } = useWorkerAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const err = await login(email, password, { captchaToken });
    setSubmitting(false);
    if (err) { setError(err); return; }

    // Redirect supervisors/admins to admin panel
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('worker_profiles')
        .select('stations')
        .eq('user_id', user.id)
        .single();
      if (profile?.stations?.some((s: string) => s === 'supervisor' || s === 'admin')) {
        navigate('/admin');
        return;
      }
    }
    navigate('/worker');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1828] via-[#1a2332] to-[#2d4059] p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#EE6633]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[#008cd5]/10 blur-3xl" />
      </div>
      <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/95 shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#EE6633] to-[#d45522] flex items-center justify-center shadow-lg">
              <HardHat className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Worker Portal</CardTitle>
          <CardDescription>
            United Dry Cleaners — Laundry Operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email" type="email" placeholder="worker@udc.co.ke"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password" type="password" placeholder="Enter your password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                required className="h-11"
              />
            </div>
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <Lock className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <CaptchaWidget onToken={setCaptchaToken} />
            <Button type="submit" disabled={submitting} className="w-full h-11 bg-[#EE6633] hover:bg-[#d45522]">
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-6">
            First time? <Link to="/worker/setup" className="text-[#EE6633] hover:underline">Create worker account</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerLogin;
