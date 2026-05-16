import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, History, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

const actionLabels: Record<string, string> = {
  admin_login: 'Admin Login',
  worker_login: 'Worker Login',
  order_created: 'Order Created',
  order_advanced: 'Order Advanced',
  order_moved_back: 'Order Moved Back',
  order_assigned: 'Order Assigned',
  order_edited: 'Order Edited',
  worker_created: 'Worker Created',
  worker_deactivated: 'Worker Deactivated',
  admin_logout: 'Admin Logout',
  worker_logout: 'Worker Logout',
};

const actionColors: Record<string, string> = {
  admin_login: 'bg-blue-100 text-blue-700',
  worker_login: 'bg-green-100 text-green-700',
  order_created: 'bg-purple-100 text-purple-700',
  order_advanced: 'bg-orange-100 text-orange-700',
  order_moved_back: 'bg-red-100 text-red-700',
  order_assigned: 'bg-amber-100 text-amber-700',
  order_edited: 'bg-sky-100 text-sky-700',
  worker_created: 'bg-teal-100 text-teal-700',
  worker_deactivated: 'bg-rose-100 text-rose-700',
  admin_logout: 'bg-slate-100 text-slate-700',
  worker_logout: 'bg-slate-100 text-slate-700',
};

const PAGE_SIZE = 50;

const AuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadLogs();
  }, [page, search]);

  const loadLogs = async () => {
    setLoading(true);
    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (search) {
      query = query.or(
        `user_email.ilike.%${search}%,user_name.ilike.%${search}%,action.ilike.%${search}%,entity_id.ilike.%${search}%`
      );
    }

    const { data, count } = await query;
    setLogs(data || []);
    setTotal(count || 0);
    setLoading(false);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <History className="h-6 w-6 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-[#1a2332]">Audit Logs</h1>
          <p className="text-sm text-slate-500">Track all actions across the system</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by email, name, action, or entity ID..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          className="pl-9 h-10"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">No audit logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Entity</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any) => (
                  <tr key={log.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                      {new Date(log.created_at).toLocaleString('en-KE')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#1a2332] text-xs">{log.user_name || '—'}</div>
                      <div className="text-[10px] text-slate-400">{log.user_email || '—'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${actionColors[log.action] || 'bg-slate-100 text-slate-700'}`}>
                        {actionLabels[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {log.entity_type && (
                        <span className="font-medium">{log.entity_type}:</span>
                      )}
                      {log.entity_id && (
                        <span className="font-mono text-[10px] text-slate-400 ml-1">{log.entity_id}</span>
                      )}
                      {!log.entity_type && !log.entity_id && <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-[200px] truncate" title={log.details ? JSON.stringify(log.details) : ''}>
                      {log.details ? JSON.stringify(log.details).slice(0, 80) + (JSON.stringify(log.details).length > 80 ? '...' : '') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">{total} total entries</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-slate-600">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
