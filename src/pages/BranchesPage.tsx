import React from 'react';
import Branches from '@/components/laundry/Branches';

const BranchesPage: React.FC = () => {
  return (
    <div>
      <div className="bg-gradient-to-br from-[#EE6633] to-[#d45522] py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Branches</h1>
          <p className="text-white/80 text-lg">7 branches and 14 agent locations serving Nairobi, Kiambu, Ruiru, and Malindi</p>
        </div>
      </div>
      <Branches />
    </div>
  );
};

export default BranchesPage;
