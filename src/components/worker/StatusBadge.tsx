const statusColors: Record<string, string> = {
  received: 'bg-blue-100 text-blue-700',
  processing: 'bg-amber-100 text-amber-700',
  washing: 'bg-purple-100 text-purple-700',
  drying: 'bg-indigo-100 text-indigo-700',
  pressing: 'bg-orange-100 text-orange-700',
  packaging: 'bg-pink-100 text-pink-700',
  ready: 'bg-green-100 text-green-700',
  delivered: 'bg-slate-100 text-slate-600',
};

export const statusEmojis: Record<string, string> = {
  received: '📥', processing: '🔄', washing: '🧼', drying: '💨',
  pressing: '👔', packaging: '📦', ready: '✅', delivered: '🚚',
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge = ({ status, size = 'sm' }: StatusBadgeProps) => {
  const s = status.toLowerCase();
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${statusColors[s] || 'bg-slate-100 text-slate-700'}`}
    >
      <span>{statusEmojis[s] || '📋'}</span>
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
};

export const STAGES = ['received', 'processing', 'washing', 'drying', 'pressing', 'packaging', 'ready', 'delivered'];

export const STAGE_LABELS: Record<string, string> = {
  received: 'Received',
  processing: 'Processing',
  washing: 'Washing',
  drying: 'Drying',
  pressing: 'Pressing',
  packaging: 'Packaging',
  ready: 'Ready',
  delivered: 'Delivered',
};
