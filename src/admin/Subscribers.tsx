import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Users, Trash2 } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  source: string;
  subscribed_at: string;
  is_active: boolean;
}

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadSubscribers();
  }, [search]);

  const loadSubscribers = async () => {
    setLoading(true);
    let query = supabase
      .from('subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const { data } = await query;
    setSubscribers((data as Subscriber[]) || []);
    setLoading(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase
      .from('subscribers')
      .update({ is_active: !current, unsubscribed_at: current ? new Date().toISOString() : null })
      .eq('id', id);
    loadSubscribers();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscribers</h1>
        <p className="text-muted-foreground text-sm">Newsletter and mailing list subscribers</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <CardTitle className="text-lg">All Subscribers ({subscribers.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">No subscribers yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Email</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Name</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Source</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Status</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Subscribed</th>
                    <th className="text-right font-medium text-muted-foreground pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 pr-4 font-medium">{sub.email}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{sub.name || '-'}</td>
                      <td className="py-3 pr-4">
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{sub.source}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={sub.is_active ? 'success' : 'secondary'} className="text-xs">
                          {sub.is_active ? 'Active' : 'Unsubscribed'}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">
                        {new Date(sub.subscribed_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActive(sub.id, sub.is_active)}
                          className="text-xs"
                        >
                          {sub.is_active ? 'Unsubscribe' : 'Reactivate'}
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
    </div>
  );
};

export default Subscribers;
