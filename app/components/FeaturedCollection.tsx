'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
// import { useGetFeaturedProductsQuery } from '@/app/store/api/productApi';

const FeaturedCollection = ({ products = [] }: { products?: any[] }) => {
  // const { data, isLoading } = useGetFeaturedProductsQuery({});
  // const products = data?.data || [];

  // if (isLoading) {
  //   return (
  //     <section className="py-24 bg-[#1a1a1a]">
  //       <div className="container mx-auto px-4 flex justify-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A574]"></div>
  //       </div>
  //     </section>
  //   );
  // }

  return (
    <section className="py-24 bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl text-white font-medium mb-6">Featured Collection</h2>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed">
            Discover our best-selling products that will transform your skincare routine
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: any) => (
            <div key={product._id} className="group bg-[#2b2b2b] rounded-lg overflow-hidden transition-all duration-300 flex flex-col h-full">
              <div className="relative pt-[100%] bg-white">
                <div className="absolute inset-0  flex items-center justify-center">
                  <Image
                    src={product.images_urls?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80'}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="text-sm text-gray-400 mb-1">{product.categories?.[0] || 'LUNEL BEAUTY'}</div>
                <h3 className="text-3xl font-light text-white mb-1">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2">{product.description || 'Premium Skincare Product'}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-2xl font-light text-white">${product.price}</span>
                  <Link href={`/products/${product._id}`} className="text-[#d4a674] hover:text-gray-300 transition-colors" aria-label={`View details for ${product.name}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Link href="/shop">
          <Button 
            variant="outline" 
            className="border-b-2 border-white text-white hover:bg-black hover:text-gray-100 px-12 py-6 text-xl rounded-none transition-all duration-300"
          >
            Shop Now
          </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
