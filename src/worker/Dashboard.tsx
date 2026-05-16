import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useWorkerAuth } from '@/contexts/WorkerAuthContext';
import { STAGES, STAGE_LABELS, statusEmojis } from '@/components/worker/StatusBadge';
import OrderDetailDialog from '@/components/worker/OrderDetailDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, X as XIcon, HardHat, Calendar } from 'lucide-react';

const stageColors: Record<string, string> = {
  received: 'border-l-blue-500 bg-blue-50/50',
  processing: 'border-l-amber-500 bg-amber-50/50',
  washing: 'border-l-purple-500 bg-purple-50/50',
  drying: 'border-l-indigo-500 bg-indigo-50/50',
  pressing: 'border-l-orange-500 bg-orange-50/50',
  packaging: 'border-l-pink-500 bg-pink-50/50',
  ready: 'border-l-green-500 bg-green-50/50',
  delivered: 'border-l-slate-400 bg-slate-50/50',
};

const stageSidebarColors: Record<string, string> = {
  received: 'text-blue-600 bg-blue-100',
  processing: 'text-amber-600 bg-amber-100',
  washing: 'text-purple-600 bg-purple-100',
  drying: 'text-indigo-600 bg-indigo-100',
  pressing: 'text-orange-600 bg-orange-100',
  packaging: 'text-pink-600 bg-pink-100',
  ready: 'text-green-600 bg-green-100',
  delivered: 'text-slate-500 bg-slate-100',
};

const stationGreeting: Record<string, string> = {
  intake: 'Manage incoming orders and sort by service type.',
  washing: 'Process orders through the wash cycle.',
  drying: 'Move washed items to drying.',
  pressing: 'Press and finish garments to perfection.',
  packaging: 'Package completed orders for delivery.',
  delivery: 'Dispatch ready orders to customers.',
  supervisor: 'Oversee the full production flow.',
};

const stationLabel: Record<string, string> = {
  intake: 'Intake & Sorting', washing: 'Washing', drying: 'Drying',
  pressing: 'Pressing & Ironing', packaging: 'Packaging', delivery: 'Delivery', supervisor: 'Supervisor',
};

interface OrderRow {
  id: string; order_id: string; customer_name: string; phone: string;
  status: string; items: any; total_amount: number; created_at: string;
  assigned_name: string | null;
}

const Dashboard = () => {
  const { profile } = useWorkerAuth();
  const [allOrders, setAllOrders] = useState<OrderRow[]>([]);
  const [stageCounts, setStageCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<string>('received');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const refresh = useCallback(async () => {
    const { data: orders } = await supabase
      .from('orders')
      .select('id, order_id, customer_name, phone, status, items, total_amount, created_at, assigned_name')
      .order('created_at', { ascending: false });

    if (orders) {
      setAllOrders(orders as OrderRow[]);
      const counts: Record<string, number> = {};
      STAGES.forEach(s => counts[s] = 0);
      orders.forEach((o: any) => { if (counts[o.status] !== undefined) counts[o.status]++; });
      setStageCounts(counts);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const sub = supabase
      .channel('dash-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [refresh]);

  const openOrder = async (orderId: string) => {
    const { data } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (data) { setSelectedOrder(data); setDialogOpen(true); }
  };

  const stageOrders = useMemo(() => {
    let filtered = allOrders.filter(o => o.status === selectedStage);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(o =>
        o.order_id.toLowerCase().includes(q) || o.phone.toLowerCase().includes(q)
      );
    }
    if (dateFilter) {
      filtered = filtered.filter(o =>
        new Date(o.created_at).toISOString().slice(0, 10) === dateFilter
      );
    }
    return filtered;
  }, [allOrders, selectedStage, search, dateFilter]);

  const formatDate = (d: string) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#EE6633]" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1a2332]">
            {profile?.stations?.includes('supervisor') ? 'Production Overview' : 'Your Stations'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {profile?.stations?.length
              ? profile.stations.map(s => stationGreeting[s]).filter(Boolean).join(' ')
              : 'Click a stage to view orders.'}
          </p>
        </div>
        {profile && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <HardHat className="w-5 h-5 text-[#EE6633]" />
            <div>
              <div className="text-sm font-semibold text-[#1a2332]">{profile.name}</div>
              <div className="text-[10px] text-slate-400">{profile.stations?.map(s => stationLabel[s]).filter(Boolean).join(', ') || 'Multi-station'}</div>
            </div>
          </div>
        )}
      </div>

      {/* Search + Date */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by Order ID or Phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="relative w-full sm:w-48">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
          {dateFilter && (
            <button onClick={() => setDateFilter('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main layout: sidebar + table */}
      <div className="flex gap-4 min-h-[500px]">
        {/* Stage sidebar */}
        <div className="w-[200px] shrink-0 space-y-0.5">
          {STAGES.map(stage => {
            const count = stageCounts[stage] || 0;
            const isActive = selectedStage === stage;
            return (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm flex items-center justify-between ${
                  isActive
                    ? 'bg-[#1a2332] text-white shadow-md font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#1a2332]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{statusEmojis[stage] || '📋'}</span>
                  <span>{STAGE_LABELS[stage]}</span>
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders table */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-sm text-[#1a2332]">
                {STAGE_LABELS[selectedStage]} ({stageOrders.length})
              </h2>
              <span className="text-xs text-slate-400">
                {search || dateFilter ? 'Filtered' : 'All orders'}
              </span>
            </div>

            {stageOrders.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                No orders in {STAGE_LABELS[selectedStage].toLowerCase()}
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                      <th className="font-medium px-4 py-2.5 w-[180px]">Order ID</th>
                      <th className="font-medium px-3 py-2.5">Customer</th>
                      <th className="font-medium px-3 py-2.5 text-center w-12">#</th>
                      <th className="font-medium px-3 py-2.5 text-right w-24">Amount</th>
                      <th className="font-medium px-3 py-2.5 w-24">Date</th>
                      <th className="font-medium px-3 py-2.5 w-28">Assigned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stageOrders.map((order, i) => (
                      <tr key={order.id} className={`border-b border-slate-50 transition-colors hover:bg-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => openOrder(order.id)}
                            className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded transition"
                          >
                            {order.order_id}
                          </button>
                        </td>
                        <td className="px-3 py-2 text-slate-700">{order.customer_name}</td>
                        <td className="px-3 py-2 text-center text-slate-500">{Array.isArray(order.items) ? order.items.length : 0}</td>
                        <td className="px-3 py-2 text-right font-medium text-slate-700">KES {Number(order.total_amount).toLocaleString()}</td>
                        <td className="px-3 py-2 text-slate-400 text-xs">{formatDate(order.created_at)}</td>
                        <td className="px-3 py-2 text-xs text-slate-400 truncate">{order.assigned_name || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          open={dialogOpen}
          onClose={() => { setDialogOpen(false); setSelectedOrder(null); }}
          onUpdated={() => refresh()}
        />
      )}
    </div>
  );
};

export default Dashboard;
