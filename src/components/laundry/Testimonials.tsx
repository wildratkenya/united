import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, MessageCircle } from 'lucide-react';

const reviews = [
  { name: 'Wanjiru K.', role: 'Karen, Nairobi', rating: 5, text: 'United Dry Cleaners has been a lifesaver. My suits come back looking better than when I bought them, and the tracking feature is brilliant — I always know exactly where my laundry is.' },
  { name: 'David M.', role: 'Westlands', rating: 5, text: 'I run a busy schedule. Their pickup is always on time and clothes are delivered same week. The quality is unmatched in Nairobi. Been a customer for 3 years now.' },
  { name: 'Amina H.', role: 'Kilimani', rating: 5, text: 'They preserved my wedding dress beautifully. Eight months later it still looks brand new in its box. Worth every shilling. The attention to detail is incredible.' },
  { name: 'Brian O.', role: 'Lavington', rating: 5, text: 'The pricing calculator made it super easy to estimate before booking. No surprises, no hidden fees. Drop-off at their Nairobi West branch is always quick too.' },
  { name: 'Grace N.', role: 'Runda', rating: 5, text: 'I love the professional care they take with delicate fabrics. My silk blouses and wool suits always come back perfect. And the free pickup is so convenient.' },
  { name: 'Samuel K.', role: 'Parklands', rating: 5, text: 'Live order tracking is a game-changer. I always know exactly where my laundry is. Truly modern service with old-fashioned quality. Highly recommend.' },
];

const initials = ['WK', 'DM', 'AH', 'BO', 'GN', 'SK'];
const colors = ['from-[#008cd5] to-[#2f5aae]', 'from-[#EE6633] to-[#d45522]', 'from-emerald-500 to-teal-600', 'from-purple-500 to-violet-600', 'from-amber-500 to-orange-600', 'from-rose-500 to-pink-600'];

const Testimonials: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const perPage = 3;
  const maxIdx = Math.max(0, reviews.length - perPage);

  const next = () => setIdx((i) => Math.min(i + 1, maxIdx));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));

  return (
    <section id="reviews" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#008cd5]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#EE6633]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#008cd5] text-sm font-semibold mb-5 border border-blue-100">
              <MessageCircle className="w-4 h-4" /> TESTIMONIALS
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1a2332] mb-3">
              Trusted by{' '}
              <span className="text-[#EE6633]">Nairobi</span> since 1965
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#EE6633] text-[#EE6633]" />
                ))}
              </div>
              <span className="font-bold text-[#1a2332]">4.9</span>
              <span className="text-slate-400">· 2,400+ reviews</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={idx === 0}
              className="w-12 h-12 rounded-xl bg-white border border-slate-200 hover:border-[#008cd5] hover:text-[#008cd5] disabled:opacity-40 flex items-center justify-center transition shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={idx === maxIdx}
              className="w-12 h-12 rounded-xl bg-white border border-slate-200 hover:border-[#008cd5] hover:text-[#008cd5] disabled:opacity-40 flex items-center justify-center transition shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="grid md:grid-cols-3 gap-6 transition-transform duration-500"
            style={{ transform: `translateX(-${idx * (100 / perPage)}%)` }}
          >
            {reviews.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition border border-slate-100 group">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#EE6633] text-[#EE6633]" />
                  ))}
                </div>
                <Quote className="w-7 h-7 text-[#008cd5]/20 mb-3" />
                <p className="text-slate-600 mb-6 leading-relaxed text-sm">{r.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${colors[i]} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                    {initials[i]}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[#1a2332] text-sm">{r.name}</div>
                    <div className="text-xs text-slate-400">{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
