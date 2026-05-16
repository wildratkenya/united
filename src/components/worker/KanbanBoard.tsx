import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { supabase } from '@/lib/supabase';
import { KanbanColumn } from './KanbanColumn';
import { OrderCard } from './OrderCard';
import { useWorkerAuth } from '@/contexts/WorkerAuthContext';
import { STAGES, STAGE_LABELS } from './StatusBadge';
import { Loader2 } from 'lucide-react';

const stageIdx = (s: string) => STAGES.indexOf(s);

interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  status: string;
  items: any;
  eta: string;
  assigned_to: string | null;
  assigned_name: string | null;
}

interface KanbanBoardProps {
  filterStation?: string;
}

export const KanbanBoard = ({ filterStation }: KanbanBoardProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const { profile } = useWorkerAuth();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    loadOrders();
    const sub = supabase
      .channel('worker-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, loadOrders)
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  const loadOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('id, order_id, customer_name, status, items, eta, assigned_to, assigned_name')
      .order('created_at', { ascending: false });
    if (data) setOrders(data as Order[]);
    setLoading(false);
  }, []);

  const ordersByStage = (stage: string) =>
    orders.filter(o => o.status === stage);

  const handleDragStart = (event: DragStartEvent) => {
    const order = orders.find(o => o.id === event.active.id);
    if (order) setActiveOrder(order);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveOrder(null);
    const { active, over } = event;
    if (!over) return;

    const orderId = active.id as string;
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const targetStage = over.id as string;
    const currentIdx = stageIdx(order.status);
    const targetIdx = stageIdx(targetStage);

    if (targetIdx !== currentIdx + 1) return;

    const timelineEntry = {
      status: targetStage,
      timestamp: new Date().toISOString(),
      note: `Advanced to ${STAGE_LABELS[targetStage]} by ${profile?.name || 'Worker'}`,
    };

    const currentTimeline = await supabase
      .from('orders')
      .select('timeline')
      .eq('id', orderId)
      .single()
      .then(r => (r.data as any)?.timeline || []);

    const updatedTimeline = [...currentTimeline, timelineEntry];

    const updates: any = {
      status: targetStage,
      current_stage: targetIdx,
      timeline: updatedTimeline,
      updated_at: new Date().toISOString(),
    };

    if (!order.assigned_to && profile) {
      updates.assigned_to = profile.user_id;
      updates.assigned_name = profile.name;
    }

    await supabase.from('orders').update(updates).eq('id', orderId);
    loadOrders();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#EE6633]" />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 pb-4 overflow-x-auto">
        {STAGES.map((stage, i) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            stageIndex={i}
            orders={ordersByStage(stage)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeOrder ? (
          <div className="w-72 rotate-3 shadow-2xl">
            <OrderCard order={activeOrder} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
