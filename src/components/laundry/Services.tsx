import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ServicesProps {
  onBook: (service?: string) => void;
}

const services = [
  { name: 'Dry Cleaning', desc: 'Premium care for suits, dresses & delicates', price: 'From KSh 350', time: '24 hrs', img: 'https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931811300_3836e60d.jpg' },
  { name: 'Wash & Fold', desc: 'Everyday laundry, washed and neatly folded', price: 'From KSh 150/kg', time: '24 hrs', img: 'https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931785380_2f552f0b.jpg' },
  { name: 'Ironing & Pressing', desc: 'Crisp, professional finish for every garment', price: 'From KSh 80', time: '12 hrs', img: 'https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931901158_41662b2d.png' },
  { name: 'Wedding Dress Care', desc: 'Specialized preservation & restoration', price: 'From KSh 4,500', time: '5-7 days', img: 'https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931842378_71ab4a4a.png' },
  { name: 'Leather & Suede', desc: 'Expert cleaning for leather jackets & bags', price: 'From KSh 1,800', time: '3-5 days', img: 'https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931859708_2b771cf4.jpg' },
  { name: 'Curtains & Drapes', desc: 'Deep clean for home textiles & blinds', price: 'From KSh 600/panel', time: '48 hrs', img: 'https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931878562_8d894d8f.jpg' },
  { name: 'Shirt Service', desc: 'Hand-finished shirts, ready for the boardroom', price: 'From KSh 200', time: '24 hrs', img: 'https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931785781_ee36976f.jpg' },
  { name: 'Duvets & Beddings', desc: 'Bulky items washed with care', price: 'From KSh 800', time: '48 hrs', img: 'https://d64gsuwffb70l.cloudfront.net/6a0857b2724ad9ad4fbb89d9_1778931787923_8f2c4523.jpg' },
];

const Services: React.FC<ServicesProps> = ({ onBook }) => {
  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#ff6b6b]/10 text-[#ff6b6b] text-sm font-semibold mb-4">
            OUR SERVICES
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1a2332] mb-4">
            Care for every fabric, every fit
          </h2>
          <p className="text-slate-600 text-lg">
            From everyday laundry to your most prized garments — we treat them all with expertise.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.name}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-[#1a2332]">
                  {s.time}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-[#1a2332] mb-1">{s.name}</h3>
                <p className="text-sm text-slate-600 mb-4 min-h-[40px]">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#ff6b6b]">{s.price}</span>
                  <button
                    onClick={() => onBook(s.name)}
                    className="flex items-center gap-1 text-sm font-semibold text-[#1a2332] hover:text-[#ff6b6b] transition"
                  >
                    Book <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
