'use client';

import Link from 'next/link';
import { FiXCircle, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';

export default function CancelPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center container mx-auto px-4 py-8">
      <div className="bg-[#171717] rounded-lg p-10 max-w-md w-full text-center shadow-lg border border-gray-800">
        <div className="mb-6 flex justify-center">
          <div className="bg-red-500/10 rounded-full p-4">
            <FiXCircle className="text-red-500 text-5xl" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Payment Cancelled</h1>
        <p className="text-gray-400 mb-8">
          Your payment was not processed.
        </p>
        
        <div className="flex flex-col gap-3">
          <Link 
            href="/cart" 
            className="w-full bg-[#d4a674] text-black font-medium py-3 rounded-md hover:bg-[#c49560] transition-colors flex items-center justify-center gap-2"
          >
            <FiShoppingCart /> Return to Cart
          </Link>
          
          <Link 
            href="/products" 
            className="w-full bg-transparent text-gray-400 font-medium py-3 rounded-md hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <FiArrowLeft /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
