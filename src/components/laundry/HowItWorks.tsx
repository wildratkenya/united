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
    <section id="how" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#008cd5] text-sm font-semibold mb-5 border border-blue-100">
            <Sparkles className="w-4 h-4" /> HOW IT WORKS
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1a2332] mb-4">
            From your closet, <span className="text-[#008cd5]">back in 24 hours</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Nairobi's most trusted dry cleaning since 1965 — now with modern convenience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <div key={i} className="group relative">
              <div className="bg-white border border-slate-200 rounded-2xl p-7 transition-all hover:border-[#008cd5]/30 hover:shadow-[0_8px_30px_rgba(0,140,213,0.1)] h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#008cd5] to-[#2f5aae] flex items-center justify-center group-hover:scale-110 transition shadow-lg shadow-blue-200">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-5xl font-black text-slate-100 group-hover:text-[#008cd5]/10 transition">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-[#1a2332] mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-[#008cd5]/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#008cd5]" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-blue-50 rounded-full px-6 py-3 text-sm text-[#1a2332]">
            <MapPin className="w-4 h-4 text-[#EE6633]" />
            <span>Free pickup & delivery across <strong>Nairobi, Kiambu, Ruiru, Malindi</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
