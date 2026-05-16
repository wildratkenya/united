import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  { q: 'What areas do you cover for pickup and delivery?', a: 'We currently cover all of Nairobi including Westlands, Kilimani, Karen, Lavington, Runda, Parklands, CBD, Kileleshwa, Hurlingham, and surrounding areas. Coverage is free on orders above KSh 1,500.' },
  { q: 'How long does dry cleaning take?', a: 'Standard turnaround is 24-48 hours for most items. Express same-day service is available before 11 AM for an additional fee. Specialty items like wedding dresses may take 5-7 days.' },
  { q: 'How do I track my order?', a: 'Once your order is collected, you receive an order ID via SMS. Enter it on our tracking page or click the SMS link to see real-time updates from pickup to delivery.' },
  { q: 'What payment methods do you accept?', a: 'We accept M-Pesa, cash on delivery, credit/debit cards, and bank transfers. Pay only when your clothes are delivered.' },
  { q: 'Are your cleaning products eco-friendly?', a: 'Yes. We use biodegradable detergents and modern hydrocarbon dry cleaning solvents that are gentler on fabrics and safer for the environment.' },
  { q: 'What if I\'m not satisfied with the cleaning?', a: 'We offer a 100% satisfaction guarantee. If you\'re not happy, we\'ll re-clean the item free of charge, no questions asked.' },
];

const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#ff6b6b]/10 text-[#ff6b6b] text-sm font-semibold mb-4">
            FAQ
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1a2332] mb-4">Frequently asked questions</h2>
          <p className="text-slate-600 text-lg">Everything you need to know before your first order.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition"
              >
                <span className="font-semibold text-[#1a2332] pr-4">{f.q}</span>
                {open === i ? <Minus className="w-5 h-5 text-[#ff6b6b] flex-shrink-0" /> : <Plus className="w-5 h-5 text-slate-400 flex-shrink-0" />}
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-slate-600 leading-relaxed">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
