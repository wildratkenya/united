import React, { useState } from 'react';
import PricingCalculator from '@/components/laundry/PricingCalculator';
import BookingModal from '@/components/laundry/BookingModal';

const PricingPage: React.FC = () => {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div>
      <div className="bg-gradient-to-br from-[#EE6633] to-[#d45522] py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Transparent Pricing</h1>
          <p className="text-white/80 text-lg">No surprises, no hidden fees — what you see is what you pay</p>
        </div>
      </div>
      <PricingCalculator onBook={() => setBookingOpen(true)} />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
};

export default PricingPage;
