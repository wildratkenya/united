import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, HardHat, UserPlus, CheckCircle, XCircle, Plus, AlertCircle, Store, MapPin } from 'lucide-react';
import { CaptchaWidget } from '@/components/CaptchaWidget';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { logAudit } from '@/lib/audit';
import { branches, agents } from '@/lib/locations';

const stations = [
  { value: 'intake', label: 'Intake & Sorting' },
  { value: 'washing', label: 'Washing' },
  { value: 'drying', label: 'Drying' },
  { value: 'pressing', label: 'Pressing & Ironing' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'supervisor', label: 'Supervisor' },
];

const stationColors: Record<string, string> = {
  intake: 'bg-blue-100 text-blue-700',
  washing: 'bg-purple-100 text-purple-700',
  drying: 'bg-indigo-100 text-indigo-700',
  pressing: 'bg-orange-100 text-orange-700',
  packaging: 'bg-pink-100 text-pink-700',
  delivery: 'bg-green-100 text-green-700',
  supervisor: 'bg-amber-100 text-amber-700',
};

const AdminWorkerSetup = () => {
  const { toast } = useToast();
  const { user, profile } = useAdminAuth();
  const [form, setForm] = useState({ email: '', password: 'P@ssword', name: '', stations: [] as string[], selectedStation: '', locationType: '', locationName: '' });
  const [submitting, setSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    const { data } = await supabase.from('worker_profiles').select('*').order('created_at', { ascending: false });
    setWorkers(data || []);
    setLoading(false);
  };

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
    setSubmitting(true);
    if (form.stations.length === 0) { toast({ title: 'Error', description: 'Add at least one station', variant: 'destructive' }); setSubmitting(false); return; }
    if (!form.locationType || !form.locationName) { toast({ title: 'Error', description: 'Select a branch or agent location', variant: 'destructive' }); setSubmitting(false); return; }

    const locationPayload = { location_type: form.locationType, location_name: form.locationName };

    try {
      let created = false;
      try {
        const res = await fetch('/api/create-worker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password, name: form.name, stations: form.stations, ...locationPayload }),
        });
        if (res.ok) { created = true; }
        else {
          const err = await res.json();
          console.warn('API method failed:', err.error);
        }
      } catch (apiErr) {
        console.warn('API not available, falling back to client-side signUp');
      }

      if (!created) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: form.email, password: form.password,
          options: { data: { name: form.name, stations: form.stations }, captchaToken },
        });
        if (signUpError) { toast({ title: 'Error', description: `Signup failed: ${signUpError.message}. Disable email confirmation in Supabase Auth settings, or run \`npx vercel dev\` locally.`, variant: 'destructive' }); setSubmitting(false); return; }

        const userId = signUpData?.user?.id;
        if (!userId) { toast({ title: 'Error', description: 'User created but no ID. Disable email confirmation in Supabase Auth settings.', variant: 'destructive' }); setSubmitting(false); return; }

        const { error: insertError } = await supabase.from('worker_profiles').insert({
          user_id: userId, email: form.email, name: form.name, stations: form.stations, is_active: true, ...locationPayload,
        });
        if (insertError) { toast({ title: 'Error', description: insertError.message, variant: 'destructive' }); setSubmitting(false); return; }
      }

      toast({ title: 'Worker Created', description: `${form.name} can login at /worker/login` });
      logAudit({
        action: 'worker_created',
        userId: user?.id,
        userEmail: user?.email || undefined,
        userName: profile?.name || 'Admin',
        entityType: 'worker',
        details: { workerName: form.name, workerEmail: form.email, stations: form.stations, locationType: form.locationType, locationName: form.locationName },
      });
      setForm({ email: '', password: 'P@ssword', name: '', stations: [], selectedStation: '', locationType: '', locationName: '' });
      loadWorkers();
    } catch (err: any) { toast({ title: 'Error', description: err.message, variant: 'destructive' }); }
    setSubmitting(false);
  };

  const toggleWorker = async (worker: any) => {
    setToggling(worker.id);
    const newStatus = !worker.is_active;
    const { error } = await supabase
      .from('worker_profiles')
      .update({ is_active: newStatus })
      .eq('id', worker.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({
        title: newStatus ? 'Worker Activated' : 'Worker Deactivated',
        description: `${worker.name} is now ${newStatus ? 'active' : 'inactive'}.`,
      });
      logAudit({
        action: newStatus ? 'worker_activated' : 'worker_deactivated',
        userId: user?.id,
        userEmail: user?.email || undefined,
        userName: profile?.name || 'Admin',
        entityType: 'worker',
        entityId: worker.email,
        details: { workerName: worker.name, workerEmail: worker.email, previousStatus: worker.is_active, newStatus },
      });
      loadWorkers();
    }
    setToggling(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <HardHat className="h-6 w-6 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-[#1a2332]">Worker Management</h1>
          <p className="text-sm text-slate-500">Create and manage laundry worker accounts</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><UserPlus className="h-4 w-4 text-orange-500" /> Create Worker</CardTitle>
          <CardDescription>Fill in the details to add a new worker.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. John Mwangi" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="worker@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required className="font-mono" />
            </div>
            <div className="space-y-2 md:row-span-2">
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
                <button type="button" onClick={addStation} disabled={!form.selectedStation} className="h-11 px-4 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
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
                <p className="text-xs text-slate-400 mt-2">No stations assigned yet. Add at least one.</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Location</Label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setForm(f => ({ ...f, locationType: 'branch', locationName: '' }))} className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 text-sm transition ${form.locationType === 'branch' ? 'border-[#008cd5] bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <Store className={`w-4 h-4 ${form.locationType === 'branch' ? 'text-[#008cd5]' : 'text-slate-400'}`} />
                  <span className="font-medium">Branch</span>
                </button>
                <button type="button" onClick={() => setForm(f => ({ ...f, locationType: 'agent', locationName: '' }))} className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 text-sm transition ${form.locationType === 'agent' ? 'border-[#EE6633] bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <MapPin className={`w-4 h-4 ${form.locationType === 'agent' ? 'text-[#EE6633]' : 'text-slate-400'}`} />
                  <span className="font-medium">Agent</span>
                </button>
              </div>
              {form.locationType && (
                <select
                  value={form.locationName}
                  onChange={e => setForm(f => ({ ...f, locationName: e.target.value }))}
                  className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm"
                  required
                >
                  <option value="">Select {form.locationType}...</option>
                  {(form.locationType === 'branch' ? branches : agents).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="md:col-span-2">
              <CaptchaWidget onToken={setCaptchaToken} />
              <Button type="submit" disabled={submitting} className="w-full h-11 bg-orange-500 hover:bg-orange-600">
                {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create Worker Account'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Existing Workers ({workers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
          ) : workers.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No workers created yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Location</th>
                    <th className="pb-3 font-medium">Stations</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map(w => (
                    <tr key={w.id} className="border-b last:border-0">
                      <td className="py-3 font-medium text-[#1a2332]">{w.name}</td>
                      <td className="py-3 text-slate-600">{w.email}</td>
                      <td className="py-3">
                        {w.location_name ? (
                          <div>
                            <div className="text-xs font-medium text-[#1a2332]">{w.location_name}</div>
                            <span className={`text-[10px] font-semibold ${w.location_type === 'branch' ? 'text-[#008cd5]' : 'text-[#EE6633]'}`}>
                              {w.location_type === 'branch' ? 'Branch' : 'Agent'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {(w.stations || []).map((s: string) => (
                            <span key={s} className={`px-2 py-0.5 rounded-full text-xs font-medium ${stationColors[s] || 'bg-slate-100 text-slate-700'}`}>
                              {stations.find(st => st.value === s)?.label || s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {w.is_active ? (
                            <span className="text-green-600 flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Active</span>
                          ) : (
                            <span className="text-red-600 flex items-center gap-1"><XCircle className="h-3.5 w-3.5" /> Inactive</span>
                          )}
                          <button
                            onClick={() => toggleWorker(w)}
                            disabled={toggling === w.id}
                            className={`text-xs font-medium px-2 py-1 rounded-lg border transition ${
                              w.is_active
                                ? 'text-red-600 border-red-200 hover:bg-red-50'
                                : 'text-green-600 border-green-200 hover:bg-green-50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {toggling === w.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : w.is_active ? (
                              'Disable'
                            ) : (
                              'Enable'
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 text-slate-500 text-xs">{new Date(w.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWorkerSetup;
