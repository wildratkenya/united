import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { StatusBadge, STAGES, STAGE_LABELS } from '@/components/worker/StatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, ClipboardList } from 'lucide-react';

interface Order {
  id: string; order_id: string; customer_name: string; email: string;
  phone: string; service: string; status: string; total_amount: number;
  assigned_name: string | null; created_at: string; items: any;
}

const WorkerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 25;

  useEffect(() => {
    loadOrders();
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

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a2332]">All Orders</h1>
        <p className="text-xs sm:text-sm text-slate-500">{total} total orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search name, order ID, phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9 h-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="h-9 rounded-xl border border-input bg-background px-3 text-sm"
        >
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
                  <th className="text-left font-medium text-slate-500 pb-3 pr-3 pt-3">Service</th>
                  <th className="text-left font-medium text-slate-500 pb-3 pr-3 pt-3">Items</th>
                  <th className="text-left font-medium text-slate-500 pb-3 pr-3 pt-3">Status</th>
                  <th className="text-left font-medium text-slate-500 pb-3 pr-3 pt-3">Assigned</th>
                  <th className="text-left font-medium text-slate-500 pb-3 pt-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 pr-3 px-4">
                      <span className="font-mono text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {order.order_id}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 font-medium text-[#1a2332]">{order.customer_name}</td>
                    <td className="py-2.5 pr-3 text-slate-500 text-xs">{order.service}</td>
                    <td className="py-2.5 pr-3 text-slate-500 text-xs">{Array.isArray(order.items) ? order.items.length : 0}</td>
                    <td className="py-2.5 pr-3"><StatusBadge status={order.status} /></td>
                    <td className="py-2.5 pr-3 text-xs text-slate-400">{order.assigned_name || '-'}</td>
                    <td className="py-2.5 text-xs text-slate-400">
                      {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
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
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkerOrders;
