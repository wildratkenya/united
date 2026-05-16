import React, { useState, useMemo } from 'react';
import { Plus, Minus, Calculator, Tag, Shield, Clock } from 'lucide-react';

const items = [
  { name: 'Shirt', price: 200 },
  { name: 'Trousers', price: 250 },
  { name: 'Suit (2-piece)', price: 800 },
  { name: 'Dress', price: 450 },
  { name: 'Blouse', price: 220 },
  { name: 'Skirt', price: 200 },
  { name: 'Coat', price: 950 },
  { name: 'Tie / Scarf', price: 100 },
  { name: 'Bedsheet (Single)', price: 350 },
  { name: 'Bedsheet (King)', price: 500 },
  { name: 'Duvet / Comforter', price: 800 },
  { name: 'Curtain (per panel)', price: 600 },
  { name: 'Wedding Gown', price: 3500 },
  { name: 'Leather Jacket', price: 1500 },
];

interface PricingCalcProps {
  onBook: () => void;
}

const PricingCalculator: React.FC<PricingCalcProps> = ({ onBook }) => {
  const [qty, setQty] = useState<Record<string, number>>({});

  const update = (name: string, delta: number) => {
    setQty((q) => {
      const next = Math.max(0, (q[name] || 0) + delta);
      return { ...q, [name]: next };
    });
  };

  const total = useMemo(
    () => items.reduce((sum, it) => sum + (qty[it.name] || 0) * it.price, 0),
    [qty]
  );
  const count = useMemo(() => Object.values(qty).reduce((a, b) => a + b, 0), [qty]);

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-[#0a1628] to-[#1a2332] text-white relative overflow-hidden">
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-[#008cd5]/5 blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-[#EE6633]/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold mb-5 border border-white/10">
            <Calculator className="w-4 h-4" /> INSTANT QUOTE
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Transparent pricing,{' '}
            <span className="text-[#EE6633]">no surprises</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Add your items and get a real-time estimate. Free pickup & delivery on orders over KSh 1,500.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/[0.04] backdrop-blur border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#EE6633]" /> Select your items
              </h3>
              <span className="text-xs text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-2 scrollbar-thin">
              {items.map((it) => (
                <div
                  key={it.name}
                  className={`flex items-center justify-between rounded-xl p-4 border transition ${
                    qty[it.name]
                      ? 'bg-[#008cd5]/10 border-[#008cd5]/30'
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{it.name}</div>
                    <div className="text-xs text-slate-400">KES {it.price.toLocaleString()} each</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <button
                      onClick={() => update(it.name, -1)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{qty[it.name] || 0}</span>
                    <button
                      onClick={() => update(it.name, 1)}
                      className="w-8 h-8 rounded-full bg-[#EE6633] hover:bg-[#d45522] flex items-center justify-center transition text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#008cd5] to-[#005a8c] rounded-3xl p-6 sm:p-8 sticky top-24">
              <div className="text-sm uppercase tracking-wider opacity-80 mb-1">Estimate</div>
              <div className="text-5xl font-bold mb-1">
                KES {total.toLocaleString()}
              </div>
              <div className="text-sm opacity-70 mb-6">{count} {count === 1 ? 'item' : 'items'} selected</div>

              <div className="space-y-2 mb-6 pb-6 border-b border-white/20">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Subtotal</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Pickup & Delivery</span>
                  <span className="font-semibold">{total >= 1500 ? 'FREE' : 'KES 200'}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total Due</span>
                <span>KES {(total + (total >= 1500 || total === 0 ? 0 : 200)).toLocaleString()}</span>
              </div>

              <button
                onClick={onBook}
                disabled={count === 0}
                className="w-full py-3.5 rounded-xl bg-white text-[#008cd5] font-bold hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {count === 0 ? 'Add items to continue' : 'Book Pickup'}
              </button>

              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-2 text-xs opacity-70">
                  <Shield className="w-3 h-3" /> Satisfaction guaranteed
                </div>
                <div className="flex items-center gap-2 text-xs opacity-70">
                  <Clock className="w-3 h-3" /> Express service available
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCalculator;
