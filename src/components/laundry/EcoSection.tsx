import React from 'react';
import { Award, Shield, Clock, Users, Sparkles, Wrench } from 'lucide-react';

const stats = [
  { icon: Award, value: '60+', label: 'Years of service excellence across Kenya', color: 'from-[#008cd5] to-[#2f5aae]' },
  { icon: Users, value: '50K+', label: 'Satisfied customers served annually', color: 'from-[#EE6633] to-[#d45522]' },
  { icon: Shield, value: '100%', label: 'Quality guarantee on every garment', color: 'from-emerald-500 to-emerald-600' },
  { icon: Clock, value: '24hr', label: 'Standard turnaround time', color: 'from-purple-500 to-purple-600' },
];

const features = [
  { icon: Wrench, title: 'German & Italian Equipment', desc: 'State-of-the-art dry cleaning machines from Bowe and Union for superior fabric care.' },
  { icon: Sparkles, title: 'Certified Professionals', desc: 'Every garment handled by trained technicians with years of industry experience.' },
  { icon: Shield, title: 'Barcode Tracking', desc: 'Your items are tracked individually from collection to delivery — no lost garments.' },
];

const QualitySection: React.FC = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute right-0 top-0 w-[500px] h-full bg-gradient-to-l from-blue-50/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#008cd5] text-sm font-semibold mb-5 border border-blue-100">
              <Award className="w-4 h-4" /> WHY UDC?
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1a2332] mb-5">
              Quality that{' '}
              <span className="text-[#EE6633]">speaks for itself</span>
            </h2>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
              For over 60 years, United Dry Cleaners has set the standard for garment care in Kenya. 
              Our investment in modern technology and continuous staff training ensures your clothes 
              receive the best possible treatment.
            </p>

            <div className="space-y-4">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-[#008cd5]/20 hover:shadow-sm transition">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#008cd5] to-[#2f5aae] flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a2332] mb-1">{f.title}</h3>
                    <p className="text-sm text-slate-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-slate-100 hover:border-slate-200">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-[#1a2332] mb-1">{s.value}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{s.label}</div>
              </div>
            ))}

            <div className="col-span-2 bg-gradient-to-br from-[#008cd5] to-[#005a8c] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5" />
                <span className="font-bold">Our Promise</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Not satisfied? We'll re-clean your item free of charge. 
                That's the UDC guarantee — backed by 60 years of trust.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
