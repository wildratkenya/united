import React from 'react';
import { CalendarCheck, Truck, Sparkles, Home } from 'lucide-react';

const steps = [
  { icon: CalendarCheck, title: 'Schedule', desc: 'Book your pickup online in 30 seconds. Choose your time, address, and services.' },
  { icon: Truck, title: 'We Collect', desc: 'Our driver arrives at your door in a clean, branded van — free across Nairobi.' },
  { icon: Sparkles, title: 'We Clean', desc: 'Your garments are sorted, cleaned, and finished by trained professionals.' },
  { icon: Home, title: 'We Deliver', desc: 'Fresh, folded, and on-hangers — delivered to you in as little as 24 hours.' },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#ff6b6b]/10 text-[#ff6b6b] text-sm font-semibold mb-4">
            HOW IT WORKS
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1a2332] mb-4">Laundry done in 4 simple steps</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            We've reinvented the laundry experience for busy Nairobians.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="bg-slate-50 hover:bg-white border border-slate-100 hover:border-[#ff6b6b]/30 hover:shadow-xl rounded-2xl p-7 transition-all h-full group">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a2332] to-[#2d4059] flex items-center justify-center group-hover:scale-110 transition">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-5xl font-black text-slate-200 group-hover:text-[#ff6b6b]/20 transition">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-[#1a2332] mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
