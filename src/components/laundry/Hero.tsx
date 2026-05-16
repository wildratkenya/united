import React, { useState } from 'react';
import { Search, Truck, Leaf, Clock, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onTrack: (orderId: string) => void;
  onBook: () => void;
}

const Hero: React.FC<HeroProps> = ({ onTrack, onBook }) => {
  const [orderId, setOrderId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) onTrack(orderId.trim());
    else onTrack('UDC-2024-8472');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f1828] via-[#1a2332] to-[#2d4059] text-white">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931769399_a77b05d1.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1828] via-[#0f1828]/80 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#ff6b6b] animate-pulse" />
              Nairobi's #1 Premium Laundry Service
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Fresh clothes,{' '}
              <span className="text-[#ff6b6b]">tracked</span>
              <br />
              every step.
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-xl">
              Premium dry cleaning, laundry, and ironing with free pickup & delivery across Nairobi.
              Track your order live, from collection to your closet.
            </p>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-2 flex items-center shadow-2xl max-w-xl mb-6">
              <div className="flex items-center pl-4 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter order ID or phone number..."
                className="flex-1 px-3 py-3 text-slate-900 outline-none text-sm sm:text-base"
              />
              <button
                type="submit"
                className="px-5 sm:px-7 py-3 bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-semibold rounded-xl transition whitespace-nowrap text-sm sm:text-base"
              >
                Track Order
              </button>
            </form>

            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={onBook}
                className="px-7 py-3.5 rounded-full bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-semibold shadow-lg shadow-[#ff6b6b]/40 transition hover:-translate-y-0.5"
              >
                Schedule Free Pickup
              </button>
              <a
                href="#services"
                className="px-7 py-3.5 rounded-full border-2 border-white/30 hover:bg-white/10 text-white font-semibold transition"
              >
                View Services
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              {[
                { icon: Clock, label: '24hr Service' },
                { icon: Truck, label: 'Free Pickup' },
                { icon: Leaf, label: 'Eco-Friendly' },
                { icon: ShieldCheck, label: 'Insured' },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-sm">
                  <f.icon className="w-5 h-5 text-[#ff6b6b]" />
                  <span className="text-slate-200">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
              <img
                src="https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931769399_a77b05d1.jpg"
                alt="Premium dry cleaning"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-bold">12,000+</div>
                  <div className="text-xs text-slate-500">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-[#ff6b6b] text-white rounded-2xl p-5 shadow-xl">
              <div className="text-3xl font-bold">4.9★</div>
              <div className="text-xs opacity-90">2,400+ Reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
