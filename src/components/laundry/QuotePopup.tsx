import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Minus, Calculator, Tag, Shield, Clock, Sparkles } from 'lucide-react';

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="bg-gradient-to-br from-[#008cd5] to-[#005a8c] p-6 sm:p-8 text-white">
          <DialogHeader className="p-0">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#EE6633]" />
              <span className="text-xs uppercase tracking-wider font-semibold text-white/80">Instant Quote</span>
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-white m-0">
              What are we cleaning today?
            </DialogTitle>
            <p className="text-white/70 text-sm mt-1">
              Select your items and we'll calculate the total instantly.
            </p>
          </DialogHeader>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1a2332] flex items-center gap-2 text-sm">
              <Tag className="w-4 h-4 text-[#EE6633]" /> Items
            </h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              {count} selected
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
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

          <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0f1828] to-[#1a2332] text-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/70">Estimated Total</span>
              <span className="text-2xl sm:text-3xl font-bold">KES {total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-white/50 mb-4">
              <span>{count} {count === 1 ? 'item' : 'items'}</span>
              <span>+ KES {total >= 1500 || total === 0 ? 0 : 200} delivery</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBook}
                disabled={count === 0}
                className="flex-1 py-3 rounded-xl bg-[#EE6633] hover:bg-[#d45522] text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-[#EE6633]/30"
              >
                {count === 0 ? 'Add items to continue' : 'Book Now'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition"
              >
                Cancel
              </button>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Pay on delivery</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> M-Pesa / Card</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuotePopup;
