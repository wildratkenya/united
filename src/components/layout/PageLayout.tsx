import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '@/components/laundry/Header';
import Footer from '@/components/laundry/Footer';
import BookingModal from '@/components/laundry/BookingModal';
import ChatBot from '@/components/laundry/ChatBot';

const PageLayout = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [defaultService, setDefaultService] = useState<string | undefined>();
  const navigate = useNavigate();

  const openBooking = (service?: string) => {
    setDefaultService(service);
    setBookingOpen(true);
  };

  const scrollToTrack = () => {
    navigate('/track');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Header onBookClick={() => openBooking()} />
      <Outlet />
      <Footer />

      <button
        onClick={scrollToTrack}
        className="fixed bottom-6 right-20 z-40 px-5 py-3 rounded-full bg-[#1a2332] text-white font-semibold shadow-2xl hover:bg-[#0f1828] hover:-translate-y-1 transition flex items-center gap-2"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Track Order
      </button>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} defaultService={defaultService} />
      <ChatBot />
    </div>
  );
};

export default PageLayout;
