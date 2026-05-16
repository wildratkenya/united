import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useWorkerAuth } from '@/contexts/WorkerAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Loader2, Plus, Minus, Search, User, MapPin, Phone, Mail, FileText, Sparkles, CheckCircle2, Copy, ArrowLeft, Store, Truck } from 'lucide-react';

interface PricingItem {
  id: string;
  service_name: string;
  price_from: number;
  price_to: number | null;
  unit: string;
  turnaround_time: string;
  category: string;
}

const timeSlots = ['8:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM', '6:00 PM - 8:00 PM'];

const CreateOrder = () => {
  const { profile } = useWorkerAuth();
  const navigate = useNavigate();
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [qty, setQty] = useState<Record<string, number>>({});
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');

  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', date: '', slot: timeSlots[0], notes: '',
  });

  useEffect(() => {
    supabase.from('pricing').select('*').order('service_name').then(({ data }) => {
      setPricing((data as PricingItem[]) || []);
      setLoading(false);
    });
  }, []);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const updateQty = (name: string, delta: number) => {
    setQty(q => ({ ...q, [name]: Math.max(0, (q[name] || 0) + delta) }));
  };

  const items = useMemo(() => {
    let filtered = pricing;
    if (searchTerm) filtered = filtered.filter(i => i.service_name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (categoryFilter !== 'all') filtered = filtered.filter(i => i.category === categoryFilter);
    return filtered;
  }, [pricing, searchTerm, categoryFilter]);

  const categories = useMemo(() => {
    return [...new Set(pricing.map(i => i.category))];
  }, [pricing]);

  const total = useMemo(() => {
    return pricing.reduce((sum, it) => sum + (qty[it.service_name] || 0) * it.price_from, 0);
  }, [pricing, qty]);

  const count = useMemo(() => Object.values(qty).reduce((a, b) => a + b, 0), [qty]);
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : (total >= 1500 || total === 0 ? 0 : 200);
  const grandTotal = total + deliveryFee;

  const submit = async () => {
    if (!form.name || !form.email || !form.phone || !form.date) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (deliveryMethod === 'delivery' && !form.address) {
      toast.error('Address is required for delivery');
      return;
    }
    if (count === 0) {
      toast.error('Add at least one item');
      return;
    }

    setSubmitting(true);

    try {
      const { data: idData, error: idError } = await supabase.rpc('generate_order_id');
      if (idError) throw new Error(`Order ID generation failed: ${idError.message}`);
      const orderId = idData as string;

      const itemsArray = Object.entries(qty).filter(([, q]) => q > 0).map(([name, q]) => ({
        name, qty: q, price: pricing.find(p => p.service_name === name)?.price_from || 0,
      }));

      const nowStr = new Date().toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true });

      const timeline = [{
        status: 'received', timestamp: new Date().toISOString(),
        note: `Order created by ${profile?.name || 'Worker'} (ID: ${orderId})`,
      }];

      const { error: insertError } = await supabase.from('orders').insert({
        order_id: orderId,
        customer_name: form.name,
        email: form.email,
        phone: form.phone,
        address: deliveryMethod === 'delivery' ? form.address : 'Self pickup',
        service: itemsArray.map(i => i.name).join(', '),
        scheduled_date: form.date,
        scheduled_slot: form.slot,
        notes: deliveryMethod === 'pickup' ? `[Pickup] ${form.notes || ''}` : form.notes || null,
        items: itemsArray,
        total_amount: grandTotal,
        status: 'received',
        current_stage: 0,
        eta: `${form.date}, ${form.slot}`,
        timeline,
        assigned_to: null,
        assigned_name: null,
        delivery_method: deliveryMethod,
      });

      if (insertError) throw insertError;

      setCreatedOrderId(orderId);
      setDone(true);
      toast.success('Order created successfully!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to create order');
    }
    setSubmitting(false);
  };

  const reset = () => {
    setDone(false);
    setCreatedOrderId('');
    setQty({});
    setForm({ name: '', email: '', phone: '', address: '', date: '', slot: timeSlots[0], notes: '' });
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#EE6633]" /></div>;
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#1a2332] mb-2">Order Created!</h2>
        <p className="text-slate-600 mb-6">Order tracking ID</p>
        <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left border">
          <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Track ID</div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-2xl font-bold text-[#EE6633]">{createdOrderId}</span>
            <button onClick={() => { navigator.clipboard.writeText(createdOrderId); toast.success('Copied!'); }} className="p-2 rounded-lg hover:bg-slate-200 transition">
              <Copy className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">Customer can track at /track?orderId={createdOrderId}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={reset} className="flex-1 bg-[#EE6633] hover:bg-[#d45522]">Create Another</Button>
          <Button onClick={() => navigate('/worker')} variant="outline" className="flex-1">Go to Kanban</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/worker')} className="p-2 rounded-lg hover:bg-slate-100">
          <ArrowLeft className="h-5 w-5 text-slate-500" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1a2332]">Create New Order</h1>
          <p className="text-sm text-slate-500">Register a customer order with items and pricing</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h2 className="font-semibold text-[#1a2332] flex items-center gap-2"><User className="h-4 w-4 text-[#EE6633]" /> Customer Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name *</label>
                <Input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Jane Mwangi" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block flex items-center gap-1"><Mail className="h-3 w-3" /> Email *</label>
                <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="jane@email.com" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block flex items-center gap-1"><Phone className="h-3 w-3" /> Phone *</label>
                <Input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+254 7XX XXX XXX" />
              </div>
              {deliveryMethod === 'delivery' && (
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block flex items-center gap-1"><MapPin className="h-3 w-3" /> Address *</label>
                  <Input value={form.address} onChange={e => update('address', e.target.value)} placeholder="Building, street, area" />
                </div>
              )}
            </div>
          </div>

          {/* Delivery Method */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h2 className="font-semibold text-[#1a2332]">Delivery Method</h2>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setDeliveryMethod('delivery')} className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                deliveryMethod === 'delivery' ? 'border-[#EE6633] bg-orange-50' : 'border-slate-200 hover:border-slate-300'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${deliveryMethod === 'delivery' ? 'bg-[#EE6633] text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Truck className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm text-[#1a2332]">We Deliver</div>
                  <div className="text-xs text-slate-500">KES 200 or free above 1,500</div>
                </div>
              </button>
              <button type="button" onClick={() => setDeliveryMethod('pickup')} className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                deliveryMethod === 'pickup' ? 'border-[#EE6633] bg-orange-50' : 'border-slate-200 hover:border-slate-300'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${deliveryMethod === 'pickup' ? 'bg-[#EE6633] text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Store className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm text-[#1a2332]">Customer Picks Up</div>
                  <div className="text-xs text-slate-500">No delivery fee</div>
                </div>
              </button>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h2 className="font-semibold text-[#1a2332]">Schedule & Notes</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Pickup Date *</label>
                <Input type="date" min={today} value={form.date} onChange={e => update('date', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Time Slot</label>
                <select value={form.slot} onChange={e => update('slot', e.target.value)} className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm">
                  {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block flex items-center gap-1"><FileText className="h-3 w-3" /> Notes</label>
              <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={2} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#EE6633] resize-none text-sm" placeholder="Special instructions..." />
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#1a2332]">Items & Services</h2>
              <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{count} selected</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search services..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 h-9 text-sm" />
              </div>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="h-9 rounded-xl border border-input bg-background px-3 text-sm">
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1">
              {items.map(it => (
                <div key={it.id} className={`flex items-center justify-between rounded-xl p-3 border transition-all ${qty[it.service_name] ? 'bg-blue-50 border-[#008cd5]/30 shadow-sm' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[#1a2332]">{it.service_name}</div>
                    <div className="text-xs text-slate-400">
                      KES {it.price_from.toLocaleString()}{it.price_to ? ` - KES ${it.price_to.toLocaleString()}` : ''} /{it.unit}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <button onClick={() => updateQty(it.service_name, -1)} className="w-7 h-7 rounded-full bg-white border border-slate-200 hover:border-[#EE6633] hover:text-[#EE6633] flex items-center justify-center transition text-slate-400">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center font-bold text-sm text-[#1a2332]">{qty[it.service_name] || 0}</span>
                    <button onClick={() => updateQty(it.service_name, 1)} className="w-7 h-7 rounded-full bg-[#EE6633] hover:bg-[#d45522] flex items-center justify-center transition text-white shadow-sm shadow-[#EE6633]/30">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="sm:col-span-2 text-center py-8 text-slate-400 text-sm">No services match your search.</div>
              )}
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#0f1828] to-[#1a2332] text-white rounded-2xl p-5 sticky top-24 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#EE6633]" />
              <span className="text-xs uppercase tracking-wider font-semibold text-white/60">Order Summary</span>
            </div>

            <div>
              <div className="text-3xl font-bold">KES {grandTotal.toLocaleString()}</div>
              <div className="text-xs text-white/50">{count} {count === 1 ? 'item' : 'items'}</div>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
              {deliveryMethod === 'delivery' ? (
                <><Truck className="h-3 w-3" /> Delivery</>
              ) : (
                <><Store className="h-3 w-3" /> Self Pickup</>
              )}
            </div>
            <div className="space-y-2 pb-4 border-b border-white/10 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Subtotal</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Delivery</span>
                <span className={deliveryFee === 0 ? 'text-green-400 font-semibold' : ''}>{deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee}`}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-base">
              <span>Total Due</span>
              <span>KES {grandTotal.toLocaleString()}</span>
            </div>

            <div className="space-y-2 pt-2">
              <Button onClick={submit} disabled={submitting || count === 0} className="w-full h-11 bg-[#EE6633] hover:bg-[#d45522] text-sm">
                {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : count === 0 ? 'Add items to continue' : 'Create Order'}
              </Button>
              {count > 0 && (
                <div className="flex items-center gap-2 text-[10px] text-white/30 justify-center">
                  <span>Order ID auto-generated</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
