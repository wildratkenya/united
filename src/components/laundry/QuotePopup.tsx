import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Minus, Sparkles, Shield, Clock } from 'lucide-react';

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

interface QuotePopupProps {
  open: boolean;
  onClose: () => void;
  onBook: () => void;
}

const QuotePopup = ({ open, onClose, onBook }: QuotePopupProps) => {
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

  const handleBook = () => {
    onClose();
    setTimeout(() => onBook(), 300);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="bg-gradient-to-br from-[#008cd5] to-[#005a8c] p-5 sm:p-7 text-white">
          <DialogHeader className="p-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-[#EE6633]" />
              <span className="text-xs uppercase tracking-wider font-semibold text-white/80">Instant Quote</span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-white m-0">
              What are we cleaning today?
            </DialogTitle>
            <p className="text-white/70 text-sm mt-0.5">
              Select items below — we'll calculate your total instantly.
            </p>
          </DialogHeader>
        </div>

        <div className="grid md:grid-cols-3 gap-0">
          {/* Total sidebar */}
          <div className="bg-gradient-to-br from-[#0f1828] to-[#1a2332] text-white p-5 sm:p-6 md:sticky md:top-0 md:self-start md:min-h-[400px] flex flex-col">
            <div className="text-sm uppercase tracking-wider text-white/50 font-medium mb-1">Estimate</div>
            <div className="text-4xl sm:text-5xl font-bold mb-1 leading-tight">
              KES {total.toLocaleString()}
            </div>
            <div className="text-sm text-white/50 mb-6">{count} {count === 1 ? 'item' : 'items'} selected</div>

            <div className="space-y-2 mb-5 pb-5 border-b border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Subtotal</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Pickup & Delivery</span>
                <span className="font-semibold text-[#EE6633]">
                  {total >= 1500 || total === 0 ? 'FREE' : 'KES 200'}
                </span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-base mb-6">
              <span>Total Due</span>
              <span className="text-lg">
                KES {(total + (total >= 1500 || total === 0 ? 0 : 200)).toLocaleString()}
              </span>
            </div>

            <div className="mt-auto space-y-3">
              <button
                onClick={handleBook}
                disabled={count === 0}
                className="w-full py-3 rounded-xl bg-[#EE6633] hover:bg-[#d45522] text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-[#EE6633]/30"
              >
                {count === 0 ? 'Add items to continue' : 'Book Now →'}
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition"
              >
                Cancel
              </button>
              <div className="flex items-center gap-3 text-[10px] text-white/30 pt-1">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Pay on delivery</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> M-Pesa / Card</span>
              </div>
            </div>
          </div>

          {/* Items grid */}
          <div className="md:col-span-2 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#1a2332] text-sm">Select your items</h3>
              <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {count} selected
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
              {items.map((it) => (
                <div
                  key={it.name}
                  className={`flex items-center justify-between rounded-xl p-3.5 border transition-all ${
                    qty[it.name]
                      ? 'bg-blue-50 border-[#008cd5]/30 shadow-sm'
                      : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[#1a2332]">{it.name}</div>
                    <div className="text-xs text-slate-400">KES {it.price.toLocaleString()} each</div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0 ml-3">
                    <button
                      onClick={() => update(it.name, -1)}
                      className="w-7 h-7 rounded-full bg-white border border-slate-200 hover:border-[#EE6633] hover:text-[#EE6633] flex items-center justify-center transition text-slate-400"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center font-bold text-sm text-[#1a2332]">{qty[it.name] || 0}</span>
                    <button
                      onClick={() => update(it.name, 1)}
                      className="w-7 h-7 rounded-full bg-[#EE6633] hover:bg-[#d45522] flex items-center justify-center transition text-white shadow-sm shadow-[#EE6633]/30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuotePopup;
