import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, HardHat, CheckCircle, AlertCircle, Plus, XCircle } from 'lucide-react';
import { CaptchaWidget } from '@/components/CaptchaWidget';

const stations = [
  { value: 'intake', label: 'Intake & Sorting' },
  { value: 'washing', label: 'Washing' },
  { value: 'drying', label: 'Drying' },
  { value: 'pressing', label: 'Pressing & Ironing' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'supervisor', label: 'Supervisor' },
];

const WorkerSetup = () => {
  const [form, setForm] = useState({ email: '', password: '', name: '', stations: [] as string[], selectedStation: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [checking, setChecking] = useState(true);
  const [workerExists, setWorkerExists] = useState(false);
  const [needConfirmation, setNeedConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from('worker_profiles').select('id').limit(1).then(({ data }) => {
      if (data && data.length > 0) setWorkerExists(true);
      setChecking(false);
    });
  }, []);

  const addStation = () => {
    if (form.selectedStation && !form.stations.includes(form.selectedStation)) {
      setForm(f => ({ ...f, stations: [...f.stations, f.selectedStation], selectedStation: '' }));
    }
  };

  const removeStation = (value: string) => {
    setForm(f => ({ ...f, stations: f.stations.filter(s => s !== value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setNeedConfirmation(false);

    if (form.stations.length === 0) { setError('Add at least one station'); setSubmitting(false); return; }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { name: form.name, stations: form.stations }, captchaToken },
      });
      if (signUpError) { setError(signUpError.message); setSubmitting(false); return; }

      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 500));
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) break;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setNeedConfirmation(true); setSubmitting(false); return; }

      const { error: insertError } = await supabase.from('worker_profiles').insert({
        user_id: user.id, email: form.email, name: form.name, stations: form.stations, is_active: true,
      });
      if (insertError) { setError(`Profile failed: ${insertError.message}`); setSubmitting(false); return; }

      await supabase.auth.signOut();
      setSuccess(true);
    } catch (err: any) { setError(err.message || 'Setup failed'); }
    setSubmitting(false);
  };

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1828] to-[#1a2332]">
      <Loader2 className="h-8 w-8 animate-spin text-[#EE6633]" />
    </div>
  );

  if (workerExists && !success) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1828] to-[#1a2332] p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <CardTitle>Already Set Up</CardTitle>
          <CardDescription>A worker account already exists. Use the admin panel to add more workers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/worker/login')} className="w-full bg-[#EE6633] hover:bg-[#d45522]">Go to Login</Button>
        </CardContent>
      </Card>
    </div>
  );

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1828] to-[#1a2332] p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle>Worker Created!</CardTitle>
          <CardDescription>{form.name} can now log in at /worker/login</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/worker/login')} className="w-full bg-[#EE6633] hover:bg-[#d45522]">Go to Login</Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1828] to-[#1a2332] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#EE6633] to-[#d45522] flex items-center justify-center shadow-lg">
              <HardHat className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle>Create Worker Account</CardTitle>
          <CardDescription>Add a new laundry worker to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label>Stations / Roles</Label>
              <div className="flex gap-2">
                <select
                  value={form.selectedStation}
                  onChange={e => setForm(f => ({ ...f, selectedStation: e.target.value }))}
                  className="flex-1 h-11 rounded-xl border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select a station...</option>
                  {stations.filter(s => !form.stations.includes(s.value)).map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <button type="button" onClick={addStation} disabled={!form.selectedStation} className="h-11 px-4 rounded-xl bg-[#EE6633] text-white text-sm font-medium hover:bg-[#d45522] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
              {form.stations.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.stations.map(s => {
                    const st = stations.find(st => st.value === s);
                    return (
                      <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        {st?.label || s}
                        <button type="button" onClick={() => removeStation(s)} className="hover:text-red-600 transition">
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No stations assigned yet.</p>
              )}
            </div>
            {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
            {needConfirmation && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                Email confirmation required. Check inbox or disable in Supabase Auth settings.
              </div>
            )}
            <CaptchaWidget onToken={setCaptchaToken} />
            <Button type="submit" disabled={submitting} className="w-full h-11 bg-[#EE6633] hover:bg-[#d45522]">
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create Worker'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerSetup;
