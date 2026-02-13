'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthState } from '@/app/store/hooks';
import { ShoppingCart, Eye, Star, Heart } from 'lucide-react';
import { useAddToCartMutation } from '@/app/store/api/cartApi';
import { useAddToWishlistMutation, useGetMyWishlistQuery } from '@/app/store/api/wishlistApi';
import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';

// Using a simple button since the UI button component already exists
const Button = ({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'sm' | 'md' | 'lg'
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export type Product = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string[];
  skinType: string[];
  ingredients: string[];
  image: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  product_link?: string;
};

type ProductCardProps = {
  product: Product;
};

import { useGetSettingsQuery } from '@/app/store/api/settingsApi';

export function ProductCard({ product }: ProductCardProps) {
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();
  const { data: wishlistData } = useGetMyWishlistQuery({});
  
  const { data: settingsData } = useGetSettingsQuery({});
  const settings = settingsData?.data?.productdetails || {};
  const goToDetailsText = settings.Gotodetailstext || "Go to Details";

  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthState();

  // Check if product is in wishlist based on API data
  const isInWishlist = useMemo(() => {
    if (!wishlistData?.data) return false;
    return wishlistData.data.some((item: any) =>
      String(item.product_id?._id || item.product_id) === String(product.id)
    );
  }, [wishlistData, product.id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product details
    e.stopPropagation();

    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname + window.location.search);
      router.push(`/login?redirect=${returnUrl}`);
      return;
    }

    try {
      const res = await addToCart({
        product_id: product.id,
        quantity: 1
      }).unwrap();

      if (res?.success) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Added to cart",
          showConfirmButton: false,
          timer: 1500,
          background: '#171717',
          color: '#fff',
          toast: true
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err?.data?.message || "Failed to add to cart",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product details
    e.stopPropagation();

    if (!isAuthenticated) {
        const returnUrl = encodeURIComponent(pathname + window.location.search);
        router.push(`/login?redirect=${returnUrl}`);
        return;
    }

    if (isInWishlist) {
      // If already in wishlist, show info message
      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Already in wishlist",
        showConfirmButton: false,
        timer: 1500,
        background: '#171717',
        color: '#fff',
        toast: true
      });
      return;
    }

    try {
      const res = await addToWishlist({
        product_id: String(product.id)
      }).unwrap();

      if (res?.success) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Added to wishlist",
          showConfirmButton: false,
          timer: 1500,
          background: '#171717',
          color: '#fff',
          toast: true
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err?.data?.message || "Failed to add to wishlist",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
    }
  };

  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-600" />
        );
      }
    }

    return (
      <div className="flex items-center">
        <div className="flex">{stars}</div>
        <span className="text-sm text-gray-400 ml-1">({product.reviewCount})</span>
      </div>
    );
  };

  return (
    <Link href={`/products/${product.id}`} className="block h-full" aria-label={`View details for ${product.name}, price $${product.price}`}>
      <div className="bg-[#383838] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col w-full max-w-sm mx-auto border border-gray-700">
        {/* Product Image */}
        <div className="relative h-72 bg-gray-100 group">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Wishlist Icon - Top Left */}
          {/* <button
            onClick={handleWishlistToggle}
            disabled={isAddingToWishlist}
            className={`absolute top-3 left-3 z-20 p-2 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${isInWishlist
              ? 'bg-[#D4A574] text-white shadow-lg scale-110'
              : 'bg-white/90 text-gray-700 hover:bg-[#D4A574] hover:text-white hover:scale-110'
              }`}
            aria-label={isInWishlist ? 'In wishlist' : 'Add to wishlist'}
          >
            {isAddingToWishlist ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
            ) : (
              <Heart
                className="w-5 h-5"
                fill={isInWishlist ? 'currentColor' : 'none'}
              />
            )}
          </button> */}

          {product.isBestSeller && (
            <div className="absolute top-3 right-3 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider z-10">
              Best Seller
            </div>
          )}
          {product.isNew && !product.isBestSeller && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider z-10">
              New
            </div>
          )}

          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Quick view">
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="text-xs text-gray-300 mb-2">{product.category[0] || 'Skincare'}</div>
          <h3 className="font-medium text-gray-100 text-lg mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-gray-100 text-sm mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= 5 ? 'text-[#5CA1B5] fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-100 ml-1">({product.reviewCount})</span>
            {/* <span className="text-xs text-gray-100 ml-1">({product.product_link})</span> */}
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-baseline">
              <span className="text-lg font-bold text-gray-100">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
              {product.product_link ? (
                <a
                  href={product.product_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#d4a674] text-white text-sm px-4 py-2 rounded-full hover:bg-[#b88b5c] transition-colors flex items-center"
                >
                  {goToDetailsText}
                </a>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="bg-[#d4a674] text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-1"></div>
                  ) : (
                    <ShoppingCart className="w-4 h-4 mr-1" />
                  )}
                  Add to Cart
                </button>
              )}
            </div>
        </div>
      </div>
    </Link>
  );
}
