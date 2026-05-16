import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useWorkerAuth } from '@/contexts/WorkerAuthContext';
import { StatusBadge, STAGES, STAGE_LABELS } from './StatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, UserCheck, Pencil, Save, X, ChevronRight, Truck, Store } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface WorkerProfile {
  id: string; user_id: string; name: string; email: string; stations: string[]; is_active: boolean;
}

interface OrderDetailDialogProps {
  order: any;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const OrderDetailDialog = ({ order, open, onClose, onUpdated }: OrderDetailDialogProps) => {
  const { profile } = useWorkerAuth();
  const [editing, setEditing] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [form, setForm] = useState<any>({});

  const isSupervisorOrAdmin = profile?.stations?.includes('supervisor') || false;
  const currentIdx = STAGES.indexOf(order?.status);
  const canAdvance = currentIdx < STAGES.length - 1;
  const nextStage = canAdvance ? STAGES[currentIdx + 1] : null;

  useEffect(() => {
    if (open) {
      setForm({ ...order });
      setEditing(false);
      if (isSupervisorOrAdmin) loadWorkers();
    }
  }, [open, order?.id]);

  const loadWorkers = async () => {
    const { data } = await supabase.from('worker_profiles').select('*');
    setWorkers((data as WorkerProfile[]) || []);
  };

  const assignOrder = async (workerId: string, workerName: string) => {
    setAssigning(true);
    const timelineEntry = {
      status: order.status, timestamp: new Date().toISOString(),
      note: `Assigned to ${workerName} by ${profile?.name || 'Worker'}`,
    };
    const currentTimeline = form.timeline || [];
    const { error } = await supabase.from('orders').update({
      assigned_to: workerId, assigned_name: workerName,
      timeline: [...currentTimeline, timelineEntry],
      updated_at: new Date().toISOString(),
    }).eq('id', order.id);
    if (error) { toast.error(error.message); }
    else {
      toast.success(`Assigned to ${workerName}`);
      setForm((f: any) => ({ ...f, assigned_to: workerId, assigned_name: workerName, timeline: [...currentTimeline, timelineEntry] }));
      onUpdated();
    }
    setAssigning(false);
  };

  const advanceOrder = async () => {
    if (!nextStage) return;
    setAdvancing(true);
    const timelineEntry = {
      status: nextStage, timestamp: new Date().toISOString(),
      note: `Advanced to ${STAGE_LABELS[nextStage]} by ${profile?.name || 'Worker'}`,
    };
    const currentTimeline = form.timeline || [];
    const { error } = await supabase.from('orders').update({
      status: nextStage, current_stage: currentIdx + 1,
      timeline: [...currentTimeline, timelineEntry],
      updated_at: new Date().toISOString(),
    }).eq('id', order.id);
    if (error) { toast.error(error.message); }
    else {
      toast.success(`Advanced to ${STAGE_LABELS[nextStage]}`);
      setForm((f: any) => ({ ...f, status: nextStage, current_stage: currentIdx + 1, timeline: [...currentTimeline, timelineEntry] }));
      onUpdated();
    }
    setAdvancing(false);
  };

  const saveChanges = async () => {
    setSaving(true);
    const updates: any = {};
    if (form.customer_name !== order.customer_name) updates.customer_name = form.customer_name;
    if (form.email !== order.email) updates.email = form.email;
    if (form.phone !== order.phone) updates.phone = form.phone;
    if (form.address !== order.address) updates.address = form.address;
    if (form.notes !== order.notes) updates.notes = form.notes;
    updates.updated_at = new Date().toISOString();

    if (Object.keys(updates).length <= 1) { toast.success('No changes to save'); setSaving(false); setEditing(false); return; }

    const { error } = await supabase.from('orders').update(updates).eq('id', order.id);
    if (error) { toast.error(error.message); }
    else { toast.success('Order updated'); setEditing(false); onUpdated(); }
    setSaving(false);
  };

  const itemsList = Array.isArray(form.items) ? form.items : [];

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { setEditing(false); onClose(); } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm">{order?.order_id}</span>
            <StatusBadge status={form.status} size="md" />
            {form.delivery_method === 'pickup' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700"><Store className="h-3 w-3" /> Pickup</span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700"><Truck className="h-3 w-3" /> Delivery</span>
            )}
            <button onClick={() => setEditing(!editing)} className="ml-auto p-1.5 rounded-lg hover:bg-slate-100">
              {editing ? <X className="h-4 w-4 text-slate-500" /> : <Pencil className="h-4 w-4 text-slate-400" />}
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400 text-xs mb-1">Customer Name</p>
            {editing ? <Input value={form.customer_name || ''} onChange={e => setForm((f: any) => ({ ...f, customer_name: e.target.value }))} className="h-8 text-sm" /> : <p className="font-medium">{order?.customer_name}</p>}
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Phone</p>
            {editing ? <Input value={form.phone || ''} onChange={e => setForm((f: any) => ({ ...f, phone: e.target.value }))} className="h-8 text-sm" /> : <p className="font-medium">{order?.phone}</p>}
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Email</p>
            {editing ? <Input value={form.email || ''} onChange={e => setForm((f: any) => ({ ...f, email: e.target.value }))} className="h-8 text-sm" /> : <p>{order?.email}</p>}
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Amount</p>
            <p className="font-medium">KES {Number(order?.total_amount || 0).toLocaleString()}</p>
          </div>
          <div className="col-span-2">
            <p className="text-slate-400 text-xs mb-1">Address</p>
            {editing ? <Input value={form.address || ''} onChange={e => setForm((f: any) => ({ ...f, address: e.target.value }))} className="h-8 text-sm" /> : <p>{order?.address}</p>}
          </div>
          {editing && (
            <div className="col-span-2">
              <p className="text-slate-400 text-xs mb-1">Notes</p>
              <textarea value={form.notes || ''} onChange={e => setForm((f: any) => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#EE6633] resize-none text-sm" />
            </div>
          )}
        </div>

        {/* Items */}
        {itemsList.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <p className="text-sm font-medium mb-2">Items</p>
            <div className="space-y-1.5">
              {itemsList.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                  <span>{item.name || item.service_name || item}</span>
                  <span className="font-medium">{item.qty ? `x${item.qty}` : ''} {item.price ? `KES ${item.price}` : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assign */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Assigned To</p>
              <p className="text-sm text-slate-500">{form.assigned_name || 'Not assigned'}</p>
            </div>
            {isSupervisorOrAdmin && (
              <div className="flex items-center gap-2">
                <select value="" onChange={(e) => { if (e.target.value) { const w = workers.find(w => w.id === e.target.value); if (w) assignOrder(w.user_id, w.name); } }} className="h-9 rounded-xl border border-input bg-background px-3 text-sm" disabled={assigning}>
                  <option value="">{assigning ? 'Assigning...' : 'Assign to...'}</option>
                  {workers.filter(w => w.is_active).map(w => (
                    <option key={w.id} value={w.id}>{w.name} — {w.stations?.join(', ')}</option>
                  ))}
                </select>
                <UserCheck className="h-4 w-4 text-slate-400" />
              </div>
            )}
          </div>
        </div>

        {/* Advance */}
        {canAdvance && (
          <div className="pt-4 border-t border-slate-100">
            <Button onClick={advanceOrder} disabled={advancing} className="w-full bg-[#EE6633] hover:bg-[#d45522] text-sm">
              {advancing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChevronRight className="mr-2 h-4 w-4" />}
              Advance to {STAGE_LABELS[nextStage!]} →
            </Button>
          </div>
        )}

        {/* Timeline */}
        {Array.isArray(form.timeline) && form.timeline.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <p className="text-sm font-medium mb-3">Timeline</p>
            <div className="space-y-3">
              {form.timeline.map((entry: any, idx: number) => (
                <div key={idx} className="flex gap-3 text-sm">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-[#EE6633] mt-1.5" />
                    {idx < form.timeline.length - 1 && <div className="w-px flex-1 bg-slate-200" />}
                  </div>
                  <div>
                    <p className="font-medium capitalize">{entry.status || entry.label}</p>
                    <p className="text-xs text-slate-400">{new Date(entry.timestamp || entry.time).toLocaleString('en-KE')}</p>
                    {entry.note && <p className="text-xs text-slate-500">{entry.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        {editing && (
          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <Button onClick={() => { setEditing(false); setForm({ ...order }); }} variant="outline" className="flex-1">Cancel</Button>
            <Button onClick={saveChanges} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
