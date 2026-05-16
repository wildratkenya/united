import React from 'react';
import { Leaf, Droplets, Recycle, Heart } from 'lucide-react';

const stats = [
  { icon: Droplets, value: '60%', label: 'Less water used than traditional cleaners' },
  { icon: Leaf, value: '100%', label: 'Biodegradable detergents & solvents' },
  { icon: Recycle, value: '15k+', label: 'Hangers recycled monthly' },
  { icon: Heart, value: '0', label: 'Harsh chemicals on your skin' },
];

const EcoSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-5">
              <Leaf className="w-4 h-4" /> SUSTAINABILITY FIRST
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1a2332] mb-5">
              Clean clothes,<br />cleaner planet.
            </h2>
            <p className="text-slate-600 text-lg mb-8">
              We've invested in modern, eco-friendly equipment and processes that protect both your
              garments and the environment. Because looking good shouldn't cost the earth.
            </p>
            <div className="grid grid-cols-2 gap-5">
              {stats.map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                    <s.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-bold text-[#1a2332] mb-1">{s.value}</div>
                  <div className="text-xs text-slate-600">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931785380_2f552f0b.jpg"
                alt="Eco-friendly laundry"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute bottom-6 left-6 bg-white rounded-2xl p-5 shadow-xl max-w-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="font-bold text-[#1a2332]">Certified Green</div>
              </div>
              <p className="text-xs text-slate-600">Officially recognized by Kenya's Environmental Protection Authority</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcoSection;
