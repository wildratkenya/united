import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const reviews = [
  { name: 'Wanjiru K.', role: 'Karen, Nairobi', avatar: 'https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931923743_4e88bc4d.png', rating: 5, text: 'United Dry Cleaners has been a lifesaver. My suits come back looking better than when I bought them, and the tracking feature is brilliant.' },
  { name: 'David M.', role: 'Westlands', avatar: 'https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931925400_867ebc28.png', rating: 5, text: 'I run a busy schedule. Their pickup is always on time and clothes are delivered same week. Quality is unmatched in Nairobi.' },
  { name: 'Amina H.', role: 'Kilimani', avatar: 'https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931920599_5e4f82be.jpg', rating: 5, text: 'They preserved my wedding dress beautifully. Eight months later it still looks brand new. Worth every shilling.' },
  { name: 'Brian O.', role: 'Lavington', avatar: 'https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931923743_4e88bc4d.png', rating: 5, text: 'The pricing calculator made it super easy to estimate before booking. No surprises, no hidden fees. Highly recommend!' },
  { name: 'Grace N.', role: 'Runda', avatar: 'https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931925400_867ebc28.png', rating: 5, text: 'I love the eco-friendly approach. Clean clothes without harsh chemicals — perfect for my kids\' clothing.' },
  { name: 'Samuel K.', role: 'Parklands', avatar: 'https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931920599_5e4f82be.jpg', rating: 5, text: 'Live order tracking is a game-changer. I always know exactly where my laundry is. Truly modern service.' },
];

const Testimonials: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const perPage = 3;
  const maxIdx = Math.max(0, reviews.length - perPage);

  const next = () => setIdx((i) => Math.min(i + 1, maxIdx));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));

  return (
    <section id="reviews" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#1a2332]/5 text-[#1a2332] text-sm font-semibold mb-4">
              CUSTOMER LOVE
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1a2332] mb-3">
              Trusted by Nairobi's busiest
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#ff6b6b] text-[#ff6b6b]" />
                ))}
              </div>
              <span className="font-bold text-[#1a2332]">4.9</span>
              <span className="text-slate-500">· 2,400+ reviews</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={prev} disabled={idx === 0} className="w-12 h-12 rounded-full bg-white border border-slate-200 hover:border-[#ff6b6b] disabled:opacity-40 flex items-center justify-center transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} disabled={idx === maxIdx} className="w-12 h-12 rounded-full bg-white border border-slate-200 hover:border-[#ff6b6b] disabled:opacity-40 flex items-center justify-center transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="grid md:grid-cols-3 gap-6 transition-transform duration-500" style={{ transform: `translateX(-${idx * (100 / perPage)}%)` }}>
            {reviews.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition border border-slate-100">
                <Quote className="w-8 h-8 text-[#ff6b6b]/30 mb-4" />
                <p className="text-slate-700 mb-6 leading-relaxed">{r.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="font-bold text-[#1a2332]">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.role}</div>
                  </div>
                  <div className="flex">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#ff6b6b] text-[#ff6b6b]" />
                    ))}
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
