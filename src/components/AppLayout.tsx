import React, { useState } from 'react';
import Header from './laundry/Header';
import Hero from './laundry/Hero';
import Services from './laundry/Services';
import TrackOrder from './laundry/TrackOrder';
import PricingCalculator from './laundry/PricingCalculator';
import HowItWorks from './laundry/HowItWorks';
import EcoSection from './laundry/EcoSection';
import Testimonials from './laundry/Testimonials';
import FAQ from './laundry/FAQ';
import Footer from './laundry/Footer';
import BookingModal from './laundry/BookingModal';

const AppLayout: React.FC = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [defaultService, setDefaultService] = useState<string | undefined>();
  const [trackId, setTrackId] = useState<string | undefined>();

  const openBooking = (service?: string) => {
    setDefaultService(service);
    setBookingOpen(true);
  };

  const handleTrack = (id: string) => {
    setTrackId(id);
    setTimeout(() => {
      document.getElementById('track')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const scrollToTrack = () => {
    document.getElementById('track')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Header onTrackClick={scrollToTrack} onBookClick={() => openBooking()} />
      <Hero onTrack={handleTrack} onBook={() => openBooking()} />
      <Services onBook={openBooking} />
      <TrackOrder prefilledId={trackId} />
      <HowItWorks />
      <PricingCalculator onBook={() => openBooking()} />
      <EcoSection />
      <Testimonials />
      <FAQ />
      <Footer />

      {/* Floating Track button */}
      <button
        onClick={scrollToTrack}
        className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full bg-[#ff6b6b] text-white font-semibold shadow-2xl shadow-[#ff6b6b]/50 hover:bg-[#ff5252] hover:-translate-y-1 transition flex items-center gap-2"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Track Order
      </button>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} defaultService={defaultService} />
    </div>
  );
};

export default AppLayout;
