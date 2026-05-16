import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Loader2, ChevronLeft, ChevronRight, Eye, Package, UserCheck } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface WorkerProfile {
  id: string; user_id: string; name: string; email: string; stations: string[];
}

interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  scheduled_date: string;
  scheduled_slot: string;
  notes: string;
  items: any[];
  total_amount: number;
  status: string;
  current_stage: number;
  timeline: any[];
  eta: string;
  created_at: string;
  assigned_to: string | null;
  assigned_name: string | null;
  delivery_method?: string;
}

const ORDER_STATUSES = [
  'received',
  'processing',
  'washing',
  'drying',
  'pressing',
  'packaging',
  'ready',
  'delivered',
];

const statusColors: Record<string, string> = {
  received: 'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  washing: 'bg-purple-100 text-purple-700 border-purple-200',
  drying: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  pressing: 'bg-orange-100 text-orange-700 border-orange-200',
  packaging: 'bg-pink-100 text-pink-700 border-pink-200',
  ready: 'bg-green-100 text-green-700 border-green-200',
  delivered: 'bg-gray-100 text-gray-700 border-gray-200',
};

const statusIcons: Record<string, string> = {
  received: '📥',
  processing: '🔄',
  washing: '🧼',
  drying: '💨',
  pressing: '👔',
  packaging: '📦',
  ready: '✅',
  delivered: '🚚',
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [assigning, setAssigning] = useState(false);
  const PAGE_SIZE = 20;

  useEffect(() => {
    loadOrders();
    loadWorkers();
  }, [search, statusFilter, page]);

  const loadOrders = async () => {
    setLoading(true);
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,order_id.ilike.%${search}%`);
    }

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    query = query.order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    const { data, count } = await query;

    setOrders((data as Order[]) || []);
    setTotal(count || 0);
    setLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const stageIndex = ORDER_STATUSES.indexOf(newStatus);

    const timelineEntry = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: `Status changed to ${newStatus}`,
    };

    const { data: existingOrder } = await supabase
      .from('orders')
      .select('timeline')
      .eq('id', orderId)
      .single();

    const currentTimeline = (existingOrder as any)?.timeline || [];
    const updatedTimeline = [...currentTimeline, timelineEntry];

    await supabase
      .from('orders')
      .update({
        status: newStatus,
        current_stage: stageIndex,
        timeline: updatedTimeline,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    setUpdatingId(null);
    loadOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus, current_stage: stageIndex, timeline: updatedTimeline } : null);
    }
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
      note: `Assigned to ${workerName} by Admin`,
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground text-sm">Manage and track customer orders</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <CardTitle className="text-lg">All Orders ({total})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, email, phone, order..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
                <SelectTrigger className="w-full sm:w-36 h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {ORDER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left font-medium text-muted-foreground pb-3 pr-3">Order</th>
                      <th className="text-left font-medium text-muted-foreground pb-3 pr-3">Customer</th>
                      <th className="text-left font-medium text-muted-foreground pb-3 pr-3">Service</th>
                      <th className="text-left font-medium text-muted-foreground pb-3 pr-3">Amount</th>
                      <th className="text-left font-medium text-muted-foreground pb-3 pr-3">Status</th>
                      <th className="text-left font-medium text-muted-foreground pb-3 pr-3">Date</th>
                      <th className="text-right font-medium text-muted-foreground pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 pr-3">
                          <span className="font-mono text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
                            {order.order_id}
                          </span>
                        </td>
                        <td className="py-3 pr-3">
                          <div className="font-medium">{order.customer_name}</div>
                          <div className="text-xs text-muted-foreground">{order.phone}</div>
                        </td>
                        <td className="py-3 pr-3 text-muted-foreground">{order.service}</td>
                        <td className="py-3 pr-3 font-medium">KES {Number(order.total_amount).toLocaleString()}</td>
                        <td className="py-3 pr-3">
                          <Badge variant="outline" className={statusColors[order.status]}>
                            {statusIcons[order.status]} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 pr-3 text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3 text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                  <p className="text-xs text-muted-foreground">
                    Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
                  </p>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order detail dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="font-mono text-sm">{selectedOrder.order_id}</span>
                  <Badge variant="outline" className={statusColors[selectedOrder.status]}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Customer</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Phone</p>
                  <p className="font-medium">{selectedOrder.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Email</p>
                  <p>{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Service</p>
                  <p className="font-medium">{selectedOrder.service}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Amount</p>
                  <p className="font-medium">KES {Number(selectedOrder.total_amount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Delivery</p>
                  <p className="font-medium">{selectedOrder.delivery_method === 'pickup' ? 'Self Pickup' : 'We Deliver'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Scheduled</p>
                  <p>{selectedOrder.scheduled_date ? new Date(selectedOrder.scheduled_date).toLocaleDateString('en-KE') : 'Not set'} {selectedOrder.scheduled_slot}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs mb-1">Address</p>
                  <p>{selectedOrder.address}</p>
                </div>
                {selectedOrder.notes && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs mb-1">Notes</p>
                    <p>{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Assign */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Assigned To</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.assigned_name || 'Not assigned'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
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
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Status update */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUSES.map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selectedOrder.status === status ? 'default' : 'outline'}
                      disabled={updatingId === selectedOrder.id}
                      onClick={() => updateStatus(selectedOrder.id, status)}
                      className="text-xs"
                    >
                      {updatingId === selectedOrder.id ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <span className="mr-1">{statusIcons[status]}</span>
                      )}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium mb-3">Timeline</p>
                  <div className="space-y-3">
                    {(selectedOrder.timeline as any[]).map((entry: any, idx: number) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                          {idx < selectedOrder.timeline.length - 1 && (
                            <div className="w-px flex-1 bg-gray-200" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{entry.status}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleString('en-KE')}
                          </p>
                          {entry.note && <p className="text-xs text-muted-foreground">{entry.note}</p>}
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

export default Orders;
