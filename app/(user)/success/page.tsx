'use client';

import Link from 'next/link';
import { FiCheckCircle, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';

export default function SuccessPage() {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center container mx-auto px-4 py-8 relative overflow-hidden">
      {windowDimensions.width > 0 && <Confetti width={windowDimensions.width} height={windowDimensions.height} recycle={false} numberOfPieces={500} />}
      <div className="bg-[#171717] rounded-lg p-10 max-w-md w-full text-center shadow-lg border border-gray-800 z-10">
        <div className="mb-6 flex justify-center">
          <div className="bg-green-500/10 rounded-full p-4">
            <FiCheckCircle className="text-green-500 text-5xl" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
        <p className="text-gray-400 mb-8">
          Thank you for your purchase. Your order has been processed successfully.
        </p>
        
        <div className="flex flex-col gap-3">
          <Link 
            href="/account" 
            className="w-full bg-[#2a2a2a] text-white font-medium py-3 rounded-md hover:bg-[#333] transition-colors border border-gray-700 flex items-center justify-center gap-2"
          >
            <FiShoppingBag /> View Order History
          </Link>
          
          <Link 
            href="/products" 
            className="w-full bg-[#d4a674] text-black font-medium py-3 rounded-md hover:bg-[#c49560] transition-colors flex items-center justify-center gap-2"
          >
            Continue Shopping <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}