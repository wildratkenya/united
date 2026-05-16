import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Shirt, CheckCircle, AlertCircle, Info, Copy, Check } from 'lucide-react';

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
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    const { data } = await supabase.from('admin_profiles').select('id').limit(1);
    if (data && data.length > 0) setAdminExists(true);
    setChecking(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setNeedConfirmation(false);
    setCreatedUserId(null);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email, password, options: { data: { name } },
      });

      if (signUpError) { setError(signUpError.message); setSubmitting(false); return; }

      const userId = signUpData?.user?.id;
      if (userId) setCreatedUserId(userId);

      // Try to wait for auto-confirm session
      for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 300));
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) break;
      }

      let user = (await supabase.auth.getUser()).data.user;

      // Try signing in if no session yet
      if (!user) {
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInErr) user = (await supabase.auth.getUser()).data.user;
      }

      if (!user) {
        setNeedConfirmation(true);
        setSubmitting(false);
        return;
      }

      const { error: insertError } = await supabase.from('admin_profiles').insert({
        user_id: user.id, email, name, role: 'super_admin',
      });

      if (insertError) { setError(`Profile creation failed: ${insertError.message}`); setSubmitting(false); return; }

      await supabase.auth.signOut();
      setSuccess(true);
    } catch (err: any) { setError(err.message || 'Setup failed'); }
    setSubmitting(false);
  };

  const sqlSnippet = `-- Run this in Supabase Dashboard > SQL Editor
INSERT INTO public.admin_profiles (user_id, email, name, role)
VALUES ('${createdUserId || '<user-uuid-from-auth-users>'}', '${email}', '${name}', 'super_admin');`;

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
            <CardDescription>An admin account already exists.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/admin/login')} className="w-full bg-blue-600 hover:bg-blue-700">Go to Login</Button>
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
            <CardDescription>You can now login at /admin/login</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/admin/login')} className="w-full bg-blue-600 hover:bg-blue-700">Go to Login</Button>
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
      <div className="w-full max-w-lg space-y-4">
        {/* Method 1: Setup form */}
        <Card className="relative backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center shadow-lg">
                <Shirt className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Admin Setup</CardTitle>
            <CardDescription>Create the initial super admin account</CardDescription>
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
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 space-y-3">
                  <div className="flex items-start gap-2 text-amber-700 text-sm">
                    <Info className="h-4 w-4 mt-0.5 shrink-0" />
                    <span><strong>Email confirmation is required.</strong> The user was created in Supabase Auth but can't sign in until confirmed.</span>
                  </div>
                  <div className="text-xs text-amber-600 space-y-2">
                    <p className="font-semibold">Option 1: Disable confirmation</p>
                    <p className="pl-4">Go to Supabase Dashboard → Authentication → Settings → turn OFF "Confirm email", then try again.</p>
                    <p className="font-semibold pt-2">Option 2: Insert profile manually</p>
                    <p className="pl-4">Run this SQL in Supabase SQL Editor:</p>
                  </div>
                  <div className="relative">
                    <pre className="bg-amber-100/50 rounded-lg p-3 text-xs font-mono text-amber-900 overflow-x-auto">{sqlSnippet}</pre>
                    <button
                      type="button"
                      onClick={() => { navigator.clipboard.writeText(sqlSnippet); setCopyDone(true); setTimeout(() => setCopyDone(false), 2000); }}
                      className="absolute top-2 right-2 p-1.5 rounded bg-amber-200/50 hover:bg-amber-200 transition"
                    >
                      {copyDone ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-amber-700" />}
                    </button>
                  </div>
                  <p className="text-xs text-amber-600 pt-1">Then <a href="/admin/login" className="underline font-medium" onClick={(e) => { e.preventDefault(); navigate('/admin/login'); }}>try logging in</a>.</p>
                </div>
              )}

              <Button type="submit" disabled={submitting} className="w-full h-11 bg-blue-600 hover:bg-blue-700">
                {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Admin...</> : 'Create Admin Account'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Method 2: Quick manual instructions */}
        <div className="text-center">
          <span className="text-xs text-white/60">or use the </span>
          <button
            onClick={() => navigate('/admin/login')}
            className="text-xs text-blue-300 hover:text-white underline"
          >
            login page
          </button>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm text-[#1a2332] mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" /> Quick alternative
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Create the admin directly in Supabase Dashboard:
            </p>
            <ol className="text-xs text-slate-500 space-y-1.5 list-decimal list-inside">
              <li>Go to <strong>Supabase Dashboard → Authentication → Users → Add User</strong></li>
              <li>Enter <code className="bg-slate-100 px-1 rounded">admin@uniteddrycleaners.co.ke</code> / <code className="bg-slate-100 px-1 rounded">P@ssword</code> (check "Auto Confirm")</li>
              <li>Copy the new user's UUID, run SQL:</li>
            </ol>
            <pre className="bg-slate-100 rounded-lg p-3 mt-2 text-xs font-mono text-slate-700 overflow-x-auto">
              INSERT INTO public.admin_profiles (user_id, email, name, role)
              VALUES ('&lt;uuid-from-step-2&gt;', 'admin@uniteddrycleaners.co.ke', 'Super Admin', 'super_admin');
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSetup;
