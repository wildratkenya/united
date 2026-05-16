import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, Plus, Pencil, Search } from 'lucide-react';

interface PricingItem {
  id: string;
  service_name: string;
  price_from: number;
  price_to: number | null;
  unit: string;
  turnaround_time: string;
  category: string;
  is_active: boolean;
  updated_at: string;
}

const Pricing = () => {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<PricingItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    service_name: '',
    price_from: '',
    price_to: '',
    unit: 'item',
    turnaround_time: '',
    category: 'general',
  });

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('pricing')
      .select('*')
      .order('category')
      .order('service_name');

    setItems((data as PricingItem[]) || []);
    setLoading(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase
      .from('pricing')
      .update({ is_active: !current, updated_at: new Date().toISOString() })
      .eq('id', id);
    loadPricing();
  };

  const saveItem = async () => {
    setSaving(true);
    const payload = {
      service_name: form.service_name,
      price_from: parseFloat(form.price_from) || 0,
      price_to: form.price_to ? parseFloat(form.price_to) : null,
      unit: form.unit,
      turnaround_time: form.turnaround_time,
      category: form.category,
    };

    if (editItem) {
      await supabase.from('pricing').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editItem.id);
    } else {
      await supabase.from('pricing').insert(payload);
    }

    setSaving(false);
    setEditItem(null);
    setShowAdd(false);
    resetForm();
    loadPricing();
  };

  const resetForm = () => {
    setForm({ service_name: '', price_from: '', price_to: '', unit: 'item', turnaround_time: '', category: 'general' });
  };

  const openEdit = (item: PricingItem) => {
    setEditItem(item);
    setForm({
      service_name: item.service_name,
      price_from: String(item.price_from),
      price_to: item.price_to ? String(item.price_to) : '',
      unit: item.unit,
      turnaround_time: item.turnaround_time,
      category: item.category,
    });
  };

  const filtered = items.filter(i =>
    i.service_name.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(items.map(i => i.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pricing</h1>
          <p className="text-muted-foreground text-sm">Manage service prices and packages</p>
        </div>
        <Button onClick={() => { resetForm(); setEditItem(null); setShowAdd(true); }} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Add Service
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Service</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Category</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Price From</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Price To</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Unit</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Turnaround</th>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Status</th>
                    <th className="text-right font-medium text-muted-foreground pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 pr-4 font-medium">{item.service_name}</td>
                      <td className="py-3 pr-4">
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded capitalize">{item.category}</span>
                      </td>
                      <td className="py-3 pr-4">KES {Number(item.price_from).toLocaleString()}</td>
                      <td className="py-3 pr-4">{item.price_to ? `KES ${Number(item.price_to).toLocaleString()}` : '-'}</td>
                      <td className="py-3 pr-4 text-muted-foreground">/{item.unit}</td>
                      <td className="py-3 pr-4 text-muted-foreground text-xs">{item.turnaround_time}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={item.is_active ? 'success' : 'secondary'} className="text-xs">
                          {item.is_active ? 'Active' : 'Disabled'}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => toggleActive(item.id, item.is_active)}>
                            {item.is_active ? 'Disable' : 'Enable'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit dialog */}
      <Dialog open={showAdd || !!editItem} onOpenChange={(open) => { if (!open) { setShowAdd(false); setEditItem(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Service' : 'Add Service'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Service Name</label>
              <Input value={form.service_name} onChange={(e) => setForm(f => ({ ...f, service_name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Price From (KES)</label>
                <Input type="number" value={form.price_from} onChange={(e) => setForm(f => ({ ...f, price_from: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium">Price To (KES)</label>
                <Input type="number" value={form.price_to} onChange={(e) => setForm(f => ({ ...f, price_to: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Unit</label>
                <Input value={form.unit} onChange={(e) => setForm(f => ({ ...f, unit: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Turnaround Time</label>
              <Input value={form.turnaround_time} onChange={(e) => setForm(f => ({ ...f, turnaround_time: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAdd(false); setEditItem(null); }}>Cancel</Button>
            <Button onClick={saveItem} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : (editItem ? 'Update' : 'Add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;
