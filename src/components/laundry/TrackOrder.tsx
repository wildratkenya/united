import React, { useState, useEffect } from 'react';
import { Search, Package, Sparkles, ShieldCheck, Truck, CheckCircle2, MapPin, Phone, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TrackOrderProps {
  prefilledId?: string;
}

const stages = [
  { id: 'received', label: 'Order Received', icon: Package, desc: 'Picked up from your location' },
  { id: 'processing', label: 'Processing', icon: Sparkles, desc: 'Being cleaned with care' },
  { id: 'quality', label: 'Quality Check', icon: ShieldCheck, desc: 'Inspected and pressed' },
  { id: 'delivery', label: 'Out for Delivery', icon: Truck, desc: 'On the way to you' },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2, desc: 'Enjoy your fresh clothes' },
];

const TrackOrder: React.FC<TrackOrderProps> = ({ prefilledId }) => {
  const [query, setQuery] = useState(prefilledId || '');
  const [order, setOrder] = useState<any>(null);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (prefilledId) {
      setQuery(prefilledId);
      lookup(prefilledId);
    }
  }, [prefilledId]);

  const lookup = async (input: string) => {
    setSearched(true);
    setLoading(true);
    setError(null);
    setOrder(null);
    setAllOrders([]);

    const trimmed = input.trim();
    const looksLikeOrderId = /^UDC-/i.test(trimmed);

    try {
      let query = supabase.from('orders').select('*');

      if (looksLikeOrderId) {
        query = query.eq('order_id', trimmed.toUpperCase());
      } else {
        // Phone or email lookup — match either field with cleaned phone
        const cleaned = trimmed.replace(/\s+/g, '');
        query = query.or(`phone.ilike.%${cleaned}%,email.ilike.%${trimmed}%`).order('created_at', { ascending: false });
      }

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;

      if (!data || data.length === 0) {
        setError(`No order found for "${trimmed}". Please double-check your order ID or phone number.`);
      } else if (data.length === 1) {
        setOrder(data[0]);
      } else {
        // Multiple orders for same phone/email — pick most recent, show list
        setOrder(data[0]);
        setAllOrders(data);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to look up order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) lookup(query.trim());
  };

  return (
    <section id="track" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#1a2332]/5 text-[#1a2332] text-sm font-semibold mb-4">
            LIVE TRACKING
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1a2332] mb-4">
            Track your order, live
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Real-time updates from pickup to delivery. Search by order ID or phone number.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-10">
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-2 flex items-center shadow-lg focus-within:border-[#ff6b6b] transition">
            <Search className="w-5 h-5 text-slate-400 ml-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Order ID (UDC-...) or phone number"
              className="flex-1 px-3 py-3 outline-none text-slate-900"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-[#1a2332] text-white font-semibold rounded-xl hover:bg-[#0f1828] transition disabled:opacity-60 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Track
            </button>
          </div>
          <p className="text-xs text-slate-500 text-center mt-3">
            Demo order: try <span className="font-mono font-semibold">UDC-2024-8472</span>
          </p>
        </form>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#ff6b6b] mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Looking up your order...</p>
          </div>
        )}

        {/* Error */}
        {!loading && searched && error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-900 mb-1">Order not found</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Multiple orders */}
        {!loading && allOrders.length > 1 && order && (
          <div className="max-w-2xl mx-auto mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-sm text-blue-900 font-medium mb-3">
              Found {allOrders.length} orders. Showing the most recent. Click another to view:
            </p>
            <div className="flex flex-wrap gap-2">
              {allOrders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOrder(o)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition ${
                    order.id === o.id ? 'bg-[#1a2332] text-white' : 'bg-white text-[#1a2332] border border-slate-200 hover:border-[#1a2332]'
                  }`}
                >
                  {o.order_id}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Order details */}
        {!loading && order && (
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <div className="text-sm text-slate-500 mb-1">Order #{order.order_id}</div>
                <h3 className="text-2xl font-bold text-[#1a2332]">
                  Hi {order.customer_name?.split(' ')[0] || 'there'}, here's your order status
                </h3>
              </div>
              {order.eta && (
                <div className="flex items-center gap-2 px-4 py-2 bg-[#ff6b6b]/10 rounded-full">
                  <Truck className="w-4 h-4 text-[#ff6b6b]" />
                  <span className="text-sm font-semibold text-[#ff6b6b]">ETA: {order.eta}</span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="relative mb-12">
              <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 rounded-full" />
              <div
                className="absolute top-6 left-0 h-1 bg-gradient-to-r from-[#ff6b6b] to-[#ff5252] rounded-full transition-all duration-1000"
                style={{ width: `${(order.current_stage / (stages.length - 1)) * 100}%` }}
              />
              <div className="relative grid grid-cols-5 gap-2">
                {stages.map((stage, i) => {
                  const Icon = stage.icon;
                  const done = i <= order.current_stage;
                  const current = i === order.current_stage;
                  return (
                    <div key={stage.id} className="flex flex-col items-center text-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                          done
                            ? 'bg-gradient-to-br from-[#ff6b6b] to-[#ff5252] text-white shadow-lg shadow-[#ff6b6b]/40'
                            : 'bg-white border-2 border-slate-200 text-slate-400'
                        } ${current ? 'ring-4 ring-[#ff6b6b]/20 scale-110' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className={`text-xs sm:text-sm font-semibold ${done ? 'text-[#1a2332]' : 'text-slate-400'}`}>
                        {stage.label}
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-500 mt-1 hidden sm:block">{stage.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-semibold">
                  Items ({Array.isArray(order.items) ? order.items.length : 0})
                </div>
                <ul className="space-y-2">
                  {(Array.isArray(order.items) ? order.items : []).map((it: string, i: number) => (
                    <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> {it}
                    </li>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <li className="text-sm text-slate-400 italic">No items listed</li>
                  )}
                </ul>
                {order.total_amount > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
                    <span className="text-sm text-slate-500">Total</span>
                    <span className="font-bold text-[#1a2332]">KSh {Number(order.total_amount).toLocaleString()}</span>
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500">Service</div>
                  <div className="font-semibold text-[#1a2332]">{order.service}</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-semibold">Delivery To</div>
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-[#ff6b6b] mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#1a2332]">{order.address}</div>
                    <div className="text-xs text-slate-500">Nairobi, Kenya</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                  <Phone className="w-4 h-4 text-slate-400" /> {order.phone}
                </div>
                <a href="tel:+254700000000" className="flex items-center gap-2 text-sm text-[#ff6b6b] font-semibold mt-3">
                  <Phone className="w-4 h-4" /> Contact Support
                </a>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-semibold">Timeline</div>
                <ul className="space-y-2">
                  {(Array.isArray(order.timeline) ? order.timeline : []).map((t: any, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${t.done ? 'bg-[#ff6b6b]' : 'bg-slate-300'}`} />
                      <div>
                        <div className={`${t.done ? 'text-[#1a2332] font-medium' : 'text-slate-400'}`}>
                          {t.label || stages[t.stage]?.label}
                        </div>
                        <div className="text-xs text-slate-500">{t.time}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrackOrder;
