import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { StatusBadge } from './StatusBadge';
import { GripVertical, Clock, User } from 'lucide-react';

interface OrderCardProps {
  order: any;
  isDragging?: boolean;
}

export const OrderCard = ({ order, isDragging }: OrderCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: order.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const itemCount = Array.isArray(order.items) ? order.items.length : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-lg ring-2 ring-[#EE6633]/40' : 'border-slate-100'
      }`}
    >
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <button {...attributes} {...listeners} className="text-slate-300 hover:text-slate-500 touch-none shrink-0">
              <GripVertical className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded truncate">
              {order.order_id}
            </span>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <h4 className="font-semibold text-[#1a2332] text-sm mb-1 truncate">
          {order.customer_name}
        </h4>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          {itemCount > 0 && <span>{itemCount} items</span>}
          {order.eta && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {order.eta}
            </span>
          )}
        </div>

        {order.assigned_name && (
          <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-50 text-[10px] text-slate-400">
            <User className="w-3 h-3" />
            <span>{order.assigned_name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
