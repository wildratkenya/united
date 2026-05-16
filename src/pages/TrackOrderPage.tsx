import React from 'react';
import { useSearchParams } from 'react-router-dom';
import TrackOrder from '@/components/laundry/TrackOrder';

const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || undefined;

  return (
    <div>
      <div className="bg-gradient-to-br from-[#1a2332] to-[#0f1828] py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Track Your Order</h1>
          <p className="text-slate-300 text-lg">Enter your order ID to see real-time updates</p>
        </div>
      </div>
      <TrackOrder prefilledId={orderId} />
    </div>
  );
};

export default TrackOrderPage;
