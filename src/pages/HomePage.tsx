import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '@/components/laundry/Hero';
import HowItWorks from '@/components/laundry/HowItWorks';
import Testimonials from '@/components/laundry/Testimonials';
import FAQ from '@/components/laundry/FAQ';
import BookingModal from '@/components/laundry/BookingModal';
import { Award, MapPin, Users, Shield } from 'lucide-react';

const HomePage: React.FC = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const navigate = useNavigate();

  const handleTrack = (id: string) => {
    navigate(`/track?orderId=${encodeURIComponent(id)}`);
  };

  return (
    <>
      <Hero onTrack={handleTrack} onBook={() => setBookingOpen(true)} />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#008cd5] to-[#2f5aae] flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#1a2332] mb-1">60+ Years</h3>
              <p className="text-sm text-slate-500">Trusted by Nairobi since 1965</p>
              <Link to="/about" className="text-[#008cd5] text-sm font-semibold hover:text-[#EE6633] transition mt-3 inline-block">Learn more →</Link>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EE6633] to-[#d45522] flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#1a2332] mb-1">50K+ Customers</h3>
              <p className="text-sm text-slate-500">Served annually across Kenya</p>
              <Link to="/branches" className="text-[#008cd5] text-sm font-semibold hover:text-[#EE6633] transition mt-3 inline-block">Find a branch →</Link>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#1a2332] mb-1">14 Services</h3>
              <p className="text-sm text-slate-500">From dry cleaning to wedding gowns</p>
              <Link to="/services" className="text-[#008cd5] text-sm font-semibold hover:text-[#EE6633] transition mt-3 inline-block">View services →</Link>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#1a2332] mb-1">7 Branches</h3>
              <p className="text-sm text-slate-500">Plus 14 agent locations</p>
              <Link to="/branches" className="text-[#008cd5] text-sm font-semibold hover:text-[#EE6633] transition mt-3 inline-block">Find us →</Link>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <Testimonials />
      <FAQ />

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
};

export default HomePage;
