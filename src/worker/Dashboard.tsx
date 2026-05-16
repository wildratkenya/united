import { KanbanBoard } from '@/components/worker/KanbanBoard';
import { useWorkerAuth } from '@/contexts/WorkerAuthContext';
import { HardHat } from 'lucide-react';

const stationGreeting: Record<string, string> = {
  intake: 'Manage incoming orders and sort by service type.',
  washing: 'Process orders through the wash cycle.',
  drying: 'Move washed items to drying.',
  pressing: 'Press and finish garments to perfection.',
  packaging: 'Package completed orders for delivery.',
  delivery: 'Dispatch ready orders to customers.',
  supervisor: 'Oversee the full production flow.',
};

const Dashboard = () => {
  const { profile } = useWorkerAuth();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1a2332]">
            {profile?.station === 'supervisor' ? 'Production Overview' : 'Your Station'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {profile?.station
              ? stationGreeting[profile.station] || 'Drag orders to advance them through the laundry process.'
              : 'Drag orders between columns to update their status.'}
          </p>
        </div>
        {profile && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <HardHat className="w-5 h-5 text-[#EE6633]" />
            <div>
              <div className="text-sm font-semibold text-[#1a2332]">{profile.name}</div>
              <div className="text-[10px] text-slate-400 capitalize">{profile.station}</div>
            </div>
          </div>
        )}
      </div>

      <KanbanBoard />
    </div>
  );
};

export default Dashboard;
