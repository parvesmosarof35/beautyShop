import React from 'react';
import Image from 'next/image';

const ArtOfPureBeauty = () => {
  return (
    <section className="py-12 md:py-16 bg-[#3b3b3b]">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto text-center mb-10 md:mb-20">
          <h2 className="text-3xl md:text-6xl font-serif text-white mb-4 md:mb-6">The Art of Pure Beauty</h2>
          <p className="text-base md:text-xl text-gray-300 font-serif mb-10 md:mb-16 max-w-2xl mx-auto leading-relaxed px-4">
            At Lunel, we believe in the power of nature to enhance your natural beauty. 
            Our products are crafted with pure, organic ingredients that nourish and revitalize your skin. 
            Experience the perfect blend of science and nature for radiant, healthy-looking skin.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-20 mb-8 px-4 md:px-12">
            {[
              { 
                id: 1, 
                alt: 'Laum Seury Serum', 
                src: '/images/b1.png',
                name: 'Laum Seury',
                className: ''
              },
              { 
                id: 2, 
                alt: 'JEKNCLER Cream', 
                src: '/images/b2.png',
                name: 'JEKNCLER',
                className: 'md:mt-20' // Apply top margin only on desktop
              },
              { 
                id: 3, 
                alt: 'Pure Serum', 
                src: '/images/b3.png',
                name: 'Pure Serum',
                className: ''
              },
            ].map((item) => (
              <div key={item.id} className={`relative h-[300px] md:h-[500px] w-full group ${item.className}`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={300}
                  height={500}
                  className="transition-transform duration-500 group-hover:scale-105 object-contain w-full h-full gap-4"
                />
                {/* <div className="absolute bottom-0 left-0 right-0 text-center">
                  <p className="text-gray-100 font-serif text-lg">{item.name}</p>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtOfPureBeauty;
