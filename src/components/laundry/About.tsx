import React from 'react';
import { Target, Eye } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#008cd5]/10 text-[#008cd5] text-sm font-semibold mb-4">
            ABOUT US
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1a2332] mb-4">
            Over 60 Years of Service Excellence
          </h2>
          <p className="text-slate-600 text-lg">
            United Dry Cleaners Ltd (UDC), along with its subsidiary Young United Dry Cleaners Ltd (YUDC), 
            stands as a leading force in the laundry and dry cleaning industry since 29th July 1965.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <img
              src="https://uniteddrycleaners.co.ke/wp-content/uploads/2026/03/United-Dry-Cleaners-Ltd-Ruiru-1011x1024.jpeg"
              alt="United Dry Cleaners"
              className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#1a2332] mb-4">Who We Are</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              With over 60 years of experience, skilled craftsmanship, and commitment to cutting-edge 
              dry cleaning technology, we consistently provide superior services that exceed client expectations.
            </p>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Our customer-centric approach guarantees unmatched quality, attention to detail, and efficiency. 
              Every garment receives the highest standard of care, making us the trusted choice for all dry cleaning needs.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <Target className="w-6 h-6 text-[#008cd5] mb-2" />
                <h4 className="font-bold text-[#1a2332] text-sm mb-1">Our Mission</h4>
                <p className="text-xs text-slate-500">Quality services all over the country</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <Eye className="w-6 h-6 text-[#EE6633] mb-2" />
                <h4 className="font-bold text-[#1a2332] text-sm mb-1">Our Vision</h4>
                <p className="text-xs text-slate-500">Preferred provider at friendly & affordable charges</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#1a2332] via-[#2d4059] to-[#1a2332] rounded-3xl p-10 sm:p-14 text-white">
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-semibold mb-3">
              BOARD OF DIRECTORS
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold">Leadership & Governance</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Col. (Rtd) Philip K. Mwaniki', title: 'Chairman', img: '/board/placeholder-1.jpg' },
              { name: 'Dr. Samuel Kamau Mungai', title: 'Managing Director', img: '/board/placeholder-2.jpg' },
              { name: 'Eng. Henry J. Kamuti', title: 'Director', img: '/board/placeholder-3.jpg' },
              { name: 'Francis Mburu Kahata', title: 'Director', img: '/board/placeholder-4.jpg' },
            ].map((director, i) => (
              <div key={i} className="group text-center">
                <div className="w-28 h-28 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-white/20 group-hover:ring-[#EE6633]/60 transition-all duration-300 shadow-xl">
                  <img
                    src={director.img}
                    alt={director.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full bg-gradient-to-br from-[#EE6633] to-[#d45522] flex items-center justify-center text-3xl font-bold text-white';
                        fallback.textContent = director.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
                <h4 className="font-bold text-lg">{director.name}</h4>
                <p className="text-sm text-white/60">{director.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
