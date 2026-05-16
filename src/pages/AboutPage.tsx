import React from 'react';
import About from '@/components/laundry/About';

const AboutPage: React.FC = () => {
  return (
    <div>
      <div className="bg-gradient-to-br from-[#008cd5] to-[#005a8c] py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About United Dry Cleaners</h1>
          <p className="text-white/80 text-lg">Serving Nairobi with excellence since 1965</p>
        </div>
      </div>
      <About />
    </div>
  );
};

export default AboutPage;
