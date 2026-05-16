import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Users, DollarSign, Clock, TrendingUp, Package, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrderDetailDialog from '@/components/worker/OrderDetailDialog';

interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  totalSubscribers: number;
  totalServices: number;
  todayOrders: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  order_id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  notes: string;
  items: any[];
  status: string;
  current_stage: number;
  total_amount: number;
  timeline: any[];
  created_at: string;
  assigned_to: string | null;
  assigned_name: string | null;
  delivery_method?: string;
  scheduled_date: string;
  scheduled_slot: string;
}

const statusColors: Record<string, string> = {
  received: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  washing: 'bg-purple-100 text-purple-700',
  drying: 'bg-indigo-100 text-indigo-700',
  pressing: 'bg-orange-100 text-orange-700',
  packaging: 'bg-pink-100 text-pink-700',
  ready: 'bg-green-100 text-green-700',
  delivered: 'bg-gray-100 text-gray-700',
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0, activeOrders: 0, totalSubscribers: 0,
    totalServices: 0, todayOrders: 0, revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadRecentOrders();
  }, []);

  const loadStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      { count: totalOrders },
      { count: activeOrders },
      { count: totalSubscribers },
      { count: totalServices },
      { count: todayOrders },
      { data: orders },
    ] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }).not('status', 'in', '("delivered")'),
      supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('pricing').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
      supabase.from('orders').select('total_amount'),
    ]);

    const revenue = (orders as { total_amount: number }[] || []).reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

    setStats({
      totalOrders: totalOrders || 0,
      activeOrders: activeOrders || 0,
      totalSubscribers: totalSubscribers || 0,
      totalServices: totalServices || 0,
      todayOrders: todayOrders || 0,
      revenue,
    });
  };

  const loadRecentOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    setRecentOrders((data as RecentOrder[]) || []);
    setLoading(false);
  };

  const statCards = [
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Active Orders', value: stats.activeOrders, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Today\'s Orders', value: stats.todayOrders, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Revenue (KSh)', value: `KES ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Subscribers', value: stats.totalSubscribers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Services', value: stats.totalServices, icon: DollarSign, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your dry cleaning business</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card) => (
          <Card key={card.title} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">{card.title}</CardTitle>
              <div className={`h-8 w-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Order #</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Customer</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Service</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Amount</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Status</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Date</th>
                    <th className="text-right font-medium text-muted-foreground pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 pr-4 font-mono text-xs">{order.order_id}</td>
                      <td className="py-3 pr-4 font-medium">{order.customer_name}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{order.service}</td>
                      <td className="py-3 pr-4">KES {Number(order.total_amount).toLocaleString()}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">
                        {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
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
          )}
        </CardContent>
      </Card>

      <OrderDetailDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdated={() => loadRecentOrders()}
        supervisorOverride={true}
      />
    </div>
  );
};

export default Dashboard;
