import React from 'react';
import { ClipboardList, Truck, Sparkles, MapPin, PhoneCall } from 'lucide-react';

const steps = [
  {
    icon: PhoneCall,
    title: 'Request Pickup',
    desc: 'Book via phone, WhatsApp, or our online form. Choose a time slot that fits your schedule — no minimum order.',
  },
  {
    icon: ClipboardList,
    title: 'We Inspect & Tag',
    desc: 'Your items are sorted, inspected for damage, and tagged with a unique barcode. Every garment tracked individually.',
  },
  {
    icon: Sparkles,
    title: 'Expert Cleaning',
    desc: 'Dry cleaned, laundered, or steam pressed by trained professionals using modern German and Italian equipment.',
  },
  {
    icon: Truck,
    title: 'Delivery',
    desc: 'Fresh, pressed, and packaged — delivered to your doorstep. Pay via M-Pesa or card on delivery.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how" className="py-12 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#008cd5] text-xs font-semibold mb-3 border border-blue-100">
            <Sparkles className="w-3 h-3" /> HOW IT WORKS
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2332] mb-2">
            From your closet, <span className="text-[#008cd5]">back in 24 hours</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">
            Nairobi's most trusted dry cleaning since 1965 — now with modern convenience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="group relative">
              <div className="bg-white border border-slate-200 rounded-xl p-4 transition-all hover:border-[#008cd5]/30 hover:shadow-[0_4px_20px_rgba(0,140,213,0.08)] h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#008cd5] to-[#2f5aae] flex items-center justify-center group-hover:scale-110 transition shadow-md shadow-blue-200">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-3xl font-black text-slate-100 group-hover:text-[#008cd5]/10 transition">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#1a2332] mb-1">{step.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-5 py-2 text-xs text-[#1a2332]">
            <MapPin className="w-3.5 h-3.5 text-[#EE6633]" />
            <span>Free pickup & delivery across <strong>Nairobi, Kiambu, Ruiru, Malindi</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
