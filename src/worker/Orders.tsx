import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useWorkerAuth } from '@/contexts/WorkerAuthContext';
import { StatusBadge, STAGES, STAGE_LABELS } from '@/components/worker/StatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Loader2, ClipboardList, Eye, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface Order {
  id: string; order_id: string; customer_name: string; email: string;
  phone: string;   address: string; service: string; status: string; total_amount: number;
  assigned_to: string | null; assigned_name: string | null; created_at: string;
  items: any; timeline: any; notes: string; eta: string; delivery_method?: string;
}

interface WorkerProfile {
  id: string; user_id: string; name: string; email: string; stations: string[];
}

const WorkerOrders = () => {
  const { profile } = useWorkerAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [assigning, setAssigning] = useState(false);
  const PAGE_SIZE = 25;

  const isSupervisorOrAdmin = profile?.stations?.includes('supervisor') || false;

  useEffect(() => {
    loadOrders();
    if (isSupervisorOrAdmin) loadWorkers();
  }, [search, statusFilter, page]);

  const loadOrders = async () => {
    setLoading(true);
    let query = supabase.from('orders').select('*', { count: 'exact' });

    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,order_id.ilike.%${search}%,phone.ilike.%${search}%`);
    }
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    query = query.order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    const { data, count } = await query;
    setOrders((data as Order[]) || []);
    setTotal(count || 0);
    setLoading(false);
  };

  const loadWorkers = async () => {
    const { data } = await supabase.from('worker_profiles').select('*');
    setWorkers((data as WorkerProfile[]) || []);
  };

  const assignOrder = async (orderId: string, workerId: string, workerName: string) => {
    setAssigning(true);
    const timelineEntry = {
      status: selectedOrder?.status || 'received',
      timestamp: new Date().toISOString(),
      note: `Assigned to ${workerName} by ${profile?.name || 'Worker'}`,
    };
    const currentTimeline = selectedOrder?.timeline || [];
    const updatedTimeline = [...currentTimeline, timelineEntry];

    const { error } = await supabase.from('orders').update({
      assigned_to: workerId, assigned_name: workerName,
      timeline: updatedTimeline, updated_at: new Date().toISOString(),
    }).eq('id', orderId);

    if (error) { toast.error(error.message); }
    else {
      toast.success(`Assigned to ${workerName}`);
      setSelectedOrder(prev => prev ? { ...prev, assigned_to: workerId, assigned_name: workerName, timeline: updatedTimeline } : null);
      loadOrders();
    }
    setAssigning(false);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1a2332]">All Orders</h1>
          <p className="text-xs sm:text-sm text-slate-500">{total} total orders</p>
        </div>
        {isSupervisorOrAdmin && (
          <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-medium">Supervisor — can assign orders</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search name, order ID, phone..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="pl-9 h-9" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} className="h-9 rounded-xl border border-input bg-background px-3 text-sm">
          <option value="all">All Status</option>
          {STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#EE6633]" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 mx-auto text-slate-200 mb-3" />
          <p className="text-slate-400 text-sm">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left font-medium text-slate-500 pb-3 pr-3 pt-3 px-4">Order</th>
                  <th className="text-left font-medium text-slate-500 pb-3 pr-3 pt-3">Customer</th>
                  <th className="text-left font-medium text-slate-500 pb-3 pr-3 pt-3">Items</th>
                  <th className="text-left font-medium text-slate-500 pb-3 pr-3 pt-3">Status</th>
                  <th className="text-left font-medium text-slate-500 pb-3 pr-3 pt-3">Assigned</th>
                  <th className="text-left font-medium text-slate-500 pb-3 pr-3 pt-3">Amount</th>
                  <th className="text-right font-medium text-slate-500 pb-3 pt-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="py-2.5 pr-3 px-4">
                      <span className="font-mono text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{order.order_id}</span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <div className="font-medium text-[#1a2332]">{order.customer_name}</div>
                      <div className="text-xs text-slate-400">{order.phone}</div>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-500 text-xs">{Array.isArray(order.items) ? order.items.length : 0} items</td>
                    <td className="py-2.5 pr-3"><StatusBadge status={order.status} /></td>
                    <td className="py-2.5 pr-3 text-xs text-slate-400">{order.assigned_name || '-'}</td>
                    <td className="py-2.5 pr-3 text-xs font-medium">KES {Number(order.total_amount).toLocaleString()}</td>
                    <td className="py-2.5 text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(o) => !o && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="font-mono text-sm">{selectedOrder.order_id}</span>
                  <StatusBadge status={selectedOrder.status} size="md" />
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Customer</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Phone</p>
                  <p className="font-medium">{selectedOrder.phone}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Email</p>
                  <p>{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Amount</p>
                  <p className="font-medium">KES {Number(selectedOrder.total_amount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Delivery</p>
                  <p className="font-medium">{selectedOrder.delivery_method === 'pickup' ? 'Self Pickup' : 'We Deliver'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Address</p>
                  <p>{selectedOrder.address}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Scheduled</p>
                  <p>{selectedOrder.eta || 'Not set'}</p>
                </div>
              </div>

              {/* Items */}
              {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-medium mb-2">Items</p>
                  <div className="space-y-1.5">
                    {selectedOrder.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                        <span>{item.name || item.service_name || item}</span>
                        <span className="font-medium">{item.qty ? `x${item.qty}` : ''} {item.price ? `KES ${item.price}` : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedOrder.notes && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-medium mb-1">Notes</p>
                  <p className="text-sm text-slate-600">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Assigned */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Assigned To</p>
                    <p className="text-sm text-slate-500">{selectedOrder.assigned_name || 'Not assigned'}</p>
                  </div>

                  {isSupervisorOrAdmin && (
                    <div className="flex items-center gap-2">
                      <select
                        id="assign-worker"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            const w = workers.find(w => w.id === e.target.value);
                            if (w) assignOrder(selectedOrder.id, w.user_id, w.name);
                          }
                        }}
                        className="h-9 rounded-xl border border-input bg-background px-3 text-sm"
                        disabled={assigning}
                      >
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

              {/* Timeline */}
              {Array.isArray(selectedOrder.timeline) && selectedOrder.timeline.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-medium mb-3">Timeline</p>
                  <div className="space-y-3">
                    {selectedOrder.timeline.map((entry: any, idx: number) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-[#EE6633] mt-1.5" />
                          {idx < selectedOrder.timeline.length - 1 && <div className="w-px flex-1 bg-slate-200" />}
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkerOrders;
