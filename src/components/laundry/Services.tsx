import React from 'react';
import { ArrowRight, Sparkles, Wind, Shirt, Heart, Shield, Bed, Droplets, Clock, Truck, CreditCard, Package } from 'lucide-react';

interface ServicesProps {
  onBook: (service?: string) => void;
}

const services = [
  { name: 'Dry Cleaning', desc: 'Modern and international dry cleaning standards. Premium care for suits, dresses & delicates.', features: ['Expert stain removal', 'Garment-friendly chemicals', 'Hand-finishing'], icon: Shirt },
  { name: 'Laundry Services', desc: 'Premium laundry care supported by expert craftsmanship and latest technology.', features: ['Temperature-controlled washing', 'Gentle fabric care', 'Fragrance options'], icon: Sparkles },
  { name: 'Steam Pressing', desc: 'Professional steam pressing that keeps your garments sharp and polished.', features: ['Wrinkle-free finish', 'Crisp creases', 'Delicate fabric safe'], icon: Wind },
  { name: 'Wash, Dry & Fold', desc: 'Everyday laundry, washed, dried and neatly folded for your convenience.', features: ['Sorting by color/fabric', 'Machine or hand wash', 'Same-day available'], icon: Droplets },
  { name: 'Wedding & Graduation Gowns', desc: 'Preserve the elegance of your special day with expert gown cleaning.', features: ['Gentle stain removal', 'Preservation packaging', 'Beading & lace safe'], icon: Heart },
  { name: 'Leather Jacket Cleaning', desc: 'Restores softness, shine, and freshness for leathers and suedes.', features: ['pH-balanced cleaners', 'Conditioning treatment', 'Color restoration'], icon: Shield },
  { name: 'Curtains & Drapes', desc: 'Deep clean for home textiles, curtains, and blinds of all sizes.', features: ['Bulky item handling', 'No shrinkage', 'Ready to rehang'], icon : Bed },
  { name: 'Duvets & Beddings', desc: 'Removes stains, odors, and allergens — leaving linens fresh and hygienic.', features: ['Large capacity wash', 'Allergen removal', 'Fluff & fold'], icon: Bed },
];

const perks = [
  { icon: Clock, label: 'Express Services at No Extra Charge' },
  { icon: CreditCard, label: 'Credit Facility for Contracted Customers' },
  { icon: Package, label: 'Custom Packaging to Your Taste' },
  { icon: Truck, label: 'Well-Organized Transportation System' },
];

const Services: React.FC<ServicesProps> = ({ onBook }) => {
  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#EE6633]/10 text-[#EE6633] text-sm font-semibold mb-4">
            OUR SERVICES
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1a2332] mb-4">
            Experience Premium Fabric Care
          </h2>
          <p className="text-slate-600 text-lg">
            Modern and international dry cleaning standards with impeccable freshness, expert fabric care, 
            and unmatched convenience you can trust.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.slice(0, 4).map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.name} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100">
                <div className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#008cd5] to-[#2f5aae] flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-[#1a2332] mb-2">{s.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{s.desc}</p>
                  <ul className="space-y-1.5 mb-5">
                    {s.features.map((f) => (
                      <li key={f} className="text-xs text-slate-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EE6633]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onBook(s.name)}
                    className="flex items-center gap-1 text-sm font-semibold text-[#008cd5] hover:text-[#EE6633] transition"
                  >
                    Book Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.slice(4).map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.name} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100">
                <div className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EE6633] to-[#d45520] flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-[#1a2332] mb-2">{s.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{s.desc}</p>
                  <ul className="space-y-1.5 mb-5">
                    {s.features.map((f) => (
                      <li key={f} className="text-xs text-slate-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EE6633]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onBook(s.name)}
                    className="flex items-center gap-1 text-sm font-semibold text-[#008cd5] hover:text-[#EE6633] transition"
                  >
                    Book Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-[#008cd5] to-[#2f5aae] rounded-3xl p-8 sm:p-10">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">What Makes Our Services Unique</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.label} className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">{p.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
