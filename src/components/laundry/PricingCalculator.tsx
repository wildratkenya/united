import React, { useState, useMemo } from 'react';
import { Plus, Minus, Calculator } from 'lucide-react';

const items = [
  { name: 'Shirt', price: 200 },
  { name: 'Trousers', price: 250 },
  { name: 'Suit (2-pc)', price: 800 },
  { name: 'Dress', price: 450 },
  { name: 'Blouse', price: 220 },
  { name: 'Skirt', price: 200 },
  { name: 'Coat', price: 950 },
  { name: 'Tie', price: 100 },
  { name: 'Bedsheet', price: 350 },
  { name: 'Duvet', price: 800 },
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
    <section id="pricing" className="py-20 bg-gradient-to-br from-[#1a2332] to-[#0f1828] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold mb-4">
            INSTANT QUOTE
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Transparent pricing, no surprises</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Build your order and see your total instantly. Free pickup & delivery on orders over KSh 1,500.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 sm:p-8">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#ff6b6b]" /> Select your items
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {items.map((it) => (
                <div key={it.name} className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/5 hover:border-[#ff6b6b]/40 transition">
                  <div>
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-xs text-slate-400">KSh {it.price} each</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => update(it.name, -1)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center font-bold">{qty[it.name] || 0}</span>
                    <button
                      onClick={() => update(it.name, 1)}
                      className="w-8 h-8 rounded-full bg-[#ff6b6b] hover:bg-[#ff5252] flex items-center justify-center transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#ff6b6b] to-[#ff5252] rounded-3xl p-6 sm:p-8 sticky top-24 self-start">
            <div className="text-sm uppercase tracking-wider opacity-90 mb-2">Estimate</div>
            <div className="text-5xl font-bold mb-1">KSh {total.toLocaleString()}</div>
            <div className="text-sm opacity-90 mb-6">{count} {count === 1 ? 'item' : 'items'} selected</div>

            <div className="space-y-2 mb-6 pb-6 border-b border-white/20">
              <div className="flex justify-between text-sm">
                <span className="opacity-90">Subtotal</span>
                <span>KSh {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-90">Pickup & Delivery</span>
                <span>{total >= 1500 ? 'FREE' : 'KSh 200'}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>KSh {(total + (total >= 1500 || total === 0 ? 0 : 200)).toLocaleString()}</span>
            </div>

            <button
              onClick={onBook}
              disabled={count === 0}
              className="w-full py-3.5 rounded-xl bg-white text-[#ff5252] font-bold hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {count === 0 ? 'Add items to continue' : 'Schedule Pickup'}
            </button>
            <p className="text-xs text-center opacity-80 mt-3">Pay on delivery • M-Pesa accepted</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCalculator;
