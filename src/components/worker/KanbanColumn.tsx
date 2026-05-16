import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { OrderCard } from './OrderCard';
import { STAGE_LABELS } from './StatusBadge';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  stage: string;
  orders: any[];
  stageIndex: number;
}

const columnColors: Record<string, string> = {
  received: 'from-blue-50 to-blue-100/50 border-blue-200',
  processing: 'from-amber-50 to-amber-100/50 border-amber-200',
  washing: 'from-purple-50 to-purple-100/50 border-purple-200',
  drying: 'from-indigo-50 to-indigo-100/50 border-indigo-200',
  pressing: 'from-orange-50 to-orange-100/50 border-orange-200',
  packaging: 'from-pink-50 to-pink-100/50 border-pink-200',
  ready: 'from-green-50 to-green-100/50 border-green-200',
  delivered: 'from-slate-50 to-slate-100/50 border-slate-200',
};

const headerColors: Record<string, string> = {
  received: 'bg-blue-500', processing: 'bg-amber-500', washing: 'bg-purple-500',
  drying: 'bg-indigo-500', pressing: 'bg-orange-500', packaging: 'bg-pink-500',
  ready: 'bg-green-500', delivered: 'bg-slate-500',
};

export const KanbanColumn = ({ stage, orders, stageIndex }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-shrink-0 w-72 rounded-2xl border bg-gradient-to-b p-3 transition-all',
        columnColors[stage] || 'bg-slate-50 border-slate-200',
        isOver && 'ring-2 ring-[#EE6633]/40 shadow-lg shadow-[#EE6633]/10 scale-[1.02]'
      )}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={cn('w-2.5 h-2.5 rounded-full', headerColors[stage] || 'bg-slate-400')} />
          <h3 className="font-semibold text-sm text-[#1a2332]">{STAGE_LABELS[stage] || stage}</h3>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-white/60 px-2 py-0.5 rounded-full">
          {orders.length}
        </span>
      </div>

      <SortableContext items={orders.map(o => o.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2.5 min-h-[100px]">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          {orders.length === 0 && (
            <div className="flex items-center justify-center h-20 text-xs text-slate-300 italic">
              No orders
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};
