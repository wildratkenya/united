import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useWorkerAuth } from '@/contexts/WorkerAuthContext';
import { StatusBadge, STAGES, STAGE_LABELS } from '@/components/worker/StatusBadge';
import { Button } from '@/components/ui/button';
import { Loader2, ListTodo, ChevronRight, Clock } from 'lucide-react';

interface Order {
  id: string; order_id: string; customer_name: string; status: string;
  items: any; eta: string; assigned_to: string; assigned_name: string;
  service: string; phone: string;
}

const MyQueue = () => {
  const { profile } = useWorkerAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    loadOrders();
    const sub = supabase
      .channel('worker-queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => loadOrders())
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [profile]);

  const loadOrders = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('assigned_to', profile.user_id)
      .not('status', 'eq', 'delivered')
      .order('created_at', { ascending: false });
    if (data) setOrders(data as Order[]);
    setLoading(false);
  };

  const advanceOrder = async (order: Order) => {
    setAdvancing(order.id);
    const currentIdx = STAGES.indexOf(order.status);
    if (currentIdx >= STAGES.length - 2) return;
    const nextStage = STAGES[currentIdx + 1];
    const timelineEntry = {
      status: nextStage, timestamp: new Date().toISOString(),
      note: `Advanced from ${STAGE_LABELS[order.status]} to ${STAGE_LABELS[nextStage]} by ${profile?.name}`,
    };
    const currentTimeline = await supabase.from('orders').select('timeline').eq('id', order.id).single()
      .then(r => (r.data as any)?.timeline || []);
    await supabase.from('orders').update({
      status: nextStage, current_stage: currentIdx + 1,
      timeline: [...currentTimeline, timelineEntry],
      updated_at: new Date().toISOString(),
    }).eq('id', order.id);
    setAdvancing(null);
    loadOrders();
  };

  const grouped = STAGES.reduce((acc, stage) => {
    const stageOrders = orders.filter(o => o.status === stage);
    if (stageOrders.length > 0) acc[stage] = stageOrders;
    return acc;
  }, {} as Record<string, Order[]>);

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-[#EE6633]" /></div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a2332]">My Queue</h1>
        <p className="text-xs sm:text-sm text-slate-500">{orders.length} active orders assigned to you</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <ListTodo className="h-12 w-12 mx-auto text-slate-200 mb-3" />
          <p className="text-slate-400 text-sm">No orders in your queue</p>
          <p className="text-xs text-slate-300">Drag orders from the kanban to claim them</p>
        </div>
      ) : (
        Object.entries(grouped).map(([stage, stageOrders]) => (
          <div key={stage}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#EE6633]" />
              <h3 className="font-semibold text-sm text-[#1a2332]">{STAGE_LABELS[stage] || stage}</h3>
              <span className="text-xs text-slate-400">({stageOrders.length})</span>
            </div>
            <div className="space-y-2">
              {stageOrders.map(order => (
                <div key={order.id} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {order.order_id}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <h4 className="font-semibold text-sm text-[#1a2332]">{order.customer_name}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{order.service}</span>
                        {order.eta && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{order.eta}</span>}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => advanceOrder(order)}
                      disabled={advancing === order.id || STAGES.indexOf(order.status) >= STAGES.length - 2}
                      className="shrink-0 bg-[#EE6633] hover:bg-[#d45522] text-white text-xs"
                    >
                      {advancing === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                      Advance
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyQueue;
