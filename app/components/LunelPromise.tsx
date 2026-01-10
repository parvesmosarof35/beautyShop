import React from 'react';
import Image from 'next/image';

const promises = [
  {
    id: 1,
    title: 'Natural Ingredients',
    description: 'Sourced from organic farms, free from harsh chemicals',
    icon: '/images/l1.png' // Assuming this is the leaf icon from the design
  },
  {
    id: 2,
    title: 'Cruelty-Free',
    description: 'Never tested on animals, ethically crafted with care',
    icon: '/images/l2.png' // Assuming this is the rabbit icon from the design
  },
  {
    id: 3,
    title: 'pH-Balanced',
    description: 'Formulated with advanced research and proven efficacy',
    icon: '/images/l3.png' // Assuming this is the pH icon from the design
  }
];

const LunelPromise = () => {
  return (
    <section className="py-24 bg-[#3b3b3b] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-light mb-4">The Lunel Promise</h2>
          <p className="text-gray-300 text-lg">
            Uncompromising quality in every detail
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
          {promises.map((promise) => (
            <div key={promise.id} className="text-center">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full border-2 border-white/20 overflow-hidden">
                <div className="w-full h-full relative">
                  <Image
                    src={promise.icon}
                    alt={promise.title}
                    layout="fill"
                    objectFit="cover"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <h3 className="text-[#d4a674] text-xl font-light mb-3">{promise.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{promise.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LunelPromise;
