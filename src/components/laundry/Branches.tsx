import React from 'react';
import { MapPin, Clock, Phone, Store } from 'lucide-react';
import { branches, agents as agentNames } from '@/lib/locations';

const agentColumns = [
  agentNames.slice(0, 7),
  agentNames.slice(7),
];

const Branches: React.FC = () => {
  return (
    <section id="branches" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#008cd5]/10 text-[#008cd5] text-sm font-semibold mb-4">
            OUR BRANCHES
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1a2332] mb-4">
            Find Us Near You
          </h2>
          <p className="text-slate-600 text-lg">
            To guarantee convenient access to premium laundry and dry-cleaning services, 
            we have developed an extensive branch network across Kenya.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {branches.map((b) => (
            <div key={b.name} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${b.type === 'UDC' ? 'bg-[#008cd5]/10' : 'bg-[#EE6633]/10'}`}>
                  <Store className={`w-5 h-5 ${b.type === 'UDC' ? 'text-[#008cd5]' : 'text-[#EE6633]'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a2332]">{b.name}</h3>
                  <span className={`text-xs font-semibold ${b.type === 'UDC' ? 'text-[#008cd5]' : 'text-[#EE6633]'}`}>{b.type}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{b.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a href={`tel:${b.phone.replace(/\s/g, '')}`} className="hover:text-[#008cd5]">{b.phone}</a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <span>{b.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-bold text-[#1a2332] mb-2 text-center">Our Agent Network</h3>
          <p className="text-slate-500 text-center mb-8">Visit your nearest agent for professional garment care</p>
          <div className="grid md:grid-cols-2 gap-8">
            {agentColumns.map((col, i) => (
              <ul key={i} className="space-y-3">
                {col.map((a) => (
                  <li key={a} className="flex items-center gap-3 text-sm text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-[#EE6633]" />
                    {a}
                  </li>
                ))}
              </ul>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
            <p className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Saturdays: Closing at 5:00pm &middot; Closed: Sundays &amp; Public Holidays
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Branches;
