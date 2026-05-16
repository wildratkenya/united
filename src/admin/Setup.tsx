import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Shirt, CheckCircle, AlertCircle, Info } from 'lucide-react';

const AdminSetup = () => {
  const [email, setEmail] = useState('admin@uniteddrycleaners.co.ke');
  const [password, setPassword] = useState('P@ssword');
  const [name, setName] = useState('Super Admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const [needConfirmation, setNeedConfirmation] = useState(false);
  const pollingRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    const { data } = await supabase
      .from('admin_profiles')
      .select('id')
      .limit(1);

    if (data && data.length > 0) {
      setAdminExists(true);
    }
    setChecking(false);
  };

  const waitForSession = async (): Promise<boolean> => {
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 500));
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setNeedConfirmation(false);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (signUpError) {
        setError(signUpError.message);
        setSubmitting(false);
        return;
      }

      const signedIn = await waitForSession();

      if (!signedIn) {
        await supabase.auth.signInWithPassword({ email, password });
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setNeedConfirmation(true);
        setSubmitting(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('admin_profiles')
        .insert({
          user_id: user.id,
          email: email,
          name: name,
          role: 'super_admin',
        });

      if (insertError) {
        setError(`Profile creation failed: ${insertError.message}`);
        setSubmitting(false);
        return;
      }

      await supabase.auth.signOut();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Setup failed');
    }

    setSubmitting(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (adminExists && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <CardTitle>Already Set Up</CardTitle>
            <CardDescription>
              An admin account already exists.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/admin/login')} className="w-full bg-blue-600 hover:bg-blue-700">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle>Admin Created!</CardTitle>
            <CardDescription>
              The super admin account has been created successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/admin/login')} className="w-full bg-blue-600 hover:bg-blue-700">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl" />
      </div>
      <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/95 shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center shadow-lg">
              <Shirt className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Setup</CardTitle>
          <CardDescription>
            Create the initial super admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 font-mono" />
              <p className="text-xs text-muted-foreground">Hashed and stored securely by Supabase Auth</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Admin Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="h-11" />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {needConfirmation && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Account created but email confirmation is required. Check {email} inbox, confirm the address, then <a href="/admin/login" className="underline font-medium" onClick={(e) => { e.preventDefault(); navigate('/admin/login'); }}>login</a>.</span>
              </div>
            )}

            <Button type="submit" disabled={submitting} className="w-full h-11 bg-blue-600 hover:bg-blue-700">
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Admin...</>
              ) : (
                'Create Admin Account'
              )}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Already have an account?{' '}
            <a href="/admin/login" className="text-blue-600 hover:underline" onClick={(e) => { e.preventDefault(); navigate('/admin/login'); }}>Login</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
