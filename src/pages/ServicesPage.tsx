import React, { useState } from 'react';
import Services from '@/components/laundry/Services';
import PricingCalculator from '@/components/laundry/PricingCalculator';
import BookingModal from '@/components/laundry/BookingModal';

const ServicesPage: React.FC = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [defaultService, setDefaultService] = useState<string | undefined>();

  const openBooking = (service?: string) => {
    setDefaultService(service);
    setBookingOpen(true);
  };

  return (
    <div>
      <div className="bg-gradient-to-br from-[#1a2332] to-[#0f1828] py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-slate-300 text-lg">Premium garment care for every need — from everyday laundry to specialty items</p>
        </div>
      </div>
      <Services onBook={openBooking} />
      <div className="border-t border-slate-100">
        <PricingCalculator onBook={() => openBooking()} />
      </div>
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} defaultService={defaultService} />
    </div>
  );
};

export default ServicesPage;
