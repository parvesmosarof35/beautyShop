'use client';

import WishlistItem from './WishlistItem';
import { FiHeart, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { useGetMyWishlistQuery } from '@/app/store/api/wishlistApi';

export default function WishlistPage() {
  const { data: wishlistData, isLoading, isError } = useGetMyWishlistQuery({});

  // Extract wishlist items from API response
  const wishlist = wishlistData?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A574] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Failed to load wishlist</h2>
          <p className="text-gray-400 mb-6">Please try again later</p>
          <Link
            href="/products"
            className="inline-block bg-[#d4a674] text-black font-medium px-6 py-3 rounded-md hover:bg-[#c49560] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <Link
            href="/products"
            className="flex items-center text-[#d4a674] hover:text-[#c49560] transition-colors mb-6"
          >
            <FiArrowLeft className="mr-2" /> Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-400">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-[#171717] inline-flex items-center justify-center w-20 h-20 rounded-full mb-4">
              <FiHeart className="text-3xl text-gray-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-6">
              You haven't added any items to your wishlist yet.
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#d4a674] text-black font-medium px-6 py-3 rounded-md hover:bg-[#c49560] transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {wishlist.map((item: any) => (
              <WishlistItem
                key={item._id}
                item={{
                  id: item._id,
                  productId: item.product_id?._id || item.product_id,
                  name: item.product_id?.name || 'Product',
                  price: item.product_id?.price || 0,
                  originalPrice: item.product_id?.discountPrice,
                  image: item.product_id?.images_urls?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80',
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
