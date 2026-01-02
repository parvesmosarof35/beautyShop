'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { useRemoveFromWishlistMutation } from '@/app/store/api/wishlistApi';
import { useAddToCartMutation } from '@/app/store/api/cartApi';
import { useAuthState } from '@/app/store/hooks';
import Swal from 'sweetalert2';

interface WishlistItemType {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  color?: string;
  size?: string;
}

export default function WishlistItem({ item }: { item: WishlistItemType }) {
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthState();

  const handleRemove = async () => {
    try {
      const res = await removeFromWishlist(item.productId).unwrap();

      if (res?.success) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Removed from wishlist",
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
        text: err?.data?.message || "Failed to remove from wishlist",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
        const returnUrl = encodeURIComponent(pathname + window.location.search);
        router.push(`/login?redirect=${returnUrl}`);
        return;
    }

    try {
      const res = await addToCart({
        product_id: item.productId,
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

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-[#171717] rounded-lg mb-4">
      <div className="flex items-center space-x-4 w-full md:w-auto">
        <Link href={`/products/${item.productId}`} className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover rounded hover:opacity-80 transition-opacity"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/products/${item.productId}`}>
            <h3 className="font-medium text-white truncate hover:text-[#d4a674] transition-colors">
              {item.name}
            </h3>
          </Link>
          {item.color && (
            <p className="text-sm text-gray-400">Color: {item.color}</p>
          )}
          {item.size && (
            <p className="text-sm text-gray-400">Size: {item.size}</p>
          )}
          <div className="mt-2">
            <span className="text-lg font-semibold text-[#d4a674]">
              ${item.price.toFixed(2)}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                ${item.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="flex items-center text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Remove from wishlist"
        >
          {isRemoving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-1"></div>
          ) : (
            <FiTrash2 className="mr-1" />
          )}
          <span className="text-sm">{isRemoving ? 'Removing...' : 'Remove'}</span>
        </button>

        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="flex items-center bg-[#d4a674] text-black px-4 py-2 rounded-md hover:bg-[#c49560] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Add to cart"
        >
          {isAddingToCart ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
              <span className="text-sm font-medium">Adding...</span>
            </>
          ) : (
            <>
              <FiShoppingCart className="mr-2" />
              <span className="text-sm font-medium">Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

