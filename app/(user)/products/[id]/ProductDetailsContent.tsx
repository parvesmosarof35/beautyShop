'use client';

import { useState } from 'react';
import { Heart, Star, ChevronLeft, Leaf, Sparkles, Shield } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAddToCartMutation } from '@/app/store/api/cartApi';
import { useAddToWishlistMutation, useGetMyWishlistQuery, useRemoveFromWishlistMutation } from '@/app/store/api/wishlistApi';
import { useAuthState } from '@/app/store/hooks';
import { ProductCard } from '@/app/components/ProductCard';
import Swal from 'sweetalert2';

interface ProductDetailsContentProps {
  product: any;
  relatedProducts: any[];
}

import { useGetSettingsQuery } from '@/app/store/api/settingsApi';

export default function ProductDetailsContent({ product, relatedProducts }: ProductDetailsContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthState();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: settingsData } = useGetSettingsQuery({});
  const settings = settingsData?.data?.productdetails || {};
  const goToDetailsText = settings.Gotodetailstext || "Go to details";
  const relatedProductText = settings.relatedproducttext || "You May Also Like";

  const { data: wishlistData } = useGetMyWishlistQuery({});
  const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] = useRemoveFromWishlistMutation();

  const isInWishlist = wishlistData?.data?.some((item: any) => 
    (item.product_id?._id || item.product_id) === product?._id
  );

  const handleWishlistToggle = async () => {
    if (!product) return;

    if (!isAuthenticated) {
        const returnUrl = encodeURIComponent(pathname + window.location.search);
        router.push(`/login?redirect=${returnUrl}`);
        return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(product._id).unwrap();
        // Optional: Toast
      } else {
        await addToWishlist({
          product_id: product._id
        }).unwrap();
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
        // Error handling
    }
  };

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
        const returnUrl = encodeURIComponent(pathname + window.location.search);
        router.push(`/login?redirect=${returnUrl}`);
        return;
    }

    try {
      const res = await addToCart({
        product_id: product._id,
        quantity: quantity
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

  // Calculate rating distribution
  const calculateRatingDistribution = () => {
    if (!product?.reviews || product.reviews.length === 0) {
      return [0, 0, 0, 0, 0];
    }

    const distribution = [0, 0, 0, 0, 0];
    product.reviews.forEach((review: any) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[5 - review.rating]++;
      }
    });

    return distribution.map(count =>
      product.reviews.length > 0 ? Math.round((count / product.reviews.length) * 100) : 0
    );
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button
          onClick={() => router.push('/products')}
          className="px-6 py-3 bg-[#D4A574] text-black font-medium rounded hover:bg-[#c29563] transition-colors"
        >
          Return to Products
        </button>
      </div>
    );
  }

  const productImages = product.images_urls && product.images_urls.length > 0
    ? product.images_urls
    : ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80'];

  const ratingDistribution = calculateRatingDistribution();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-300 hover:text-[#D4A574] mb-8 transition-colors group"
        >
          <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </button>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative w-full aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={productImages[selectedImage] || productImages[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all ${selectedImage === index
                        ? 'ring-2 ring-[#D4A574] ring-offset-2 ring-offset-[#0a0a0a] scale-95'
                        : 'opacity-60 hover:opacity-100'
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 20vw, 100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-white mb-3 leading-tight">{product.name}</h1>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">{product.description}</p>

            <div className="text-3xl font-bold text-white mb-6">
              ${product.price.toFixed(2)}
            </div>
            
            {product.stock_quantity !== undefined && (
                 <div className="mb-6 flex items-center gap-2">
                    <span className="text-gray-400">Availability:</span>
                    <span className={`${product.stock_quantity > 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                        {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                    </span>
                 </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded border border-gray-700 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 h-10 text-center bg-[#1a1a1a] text-white border border-gray-700 rounded focus:outline-none focus:border-[#D4A574]"
                />
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded border border-gray-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            {product.product_link ? (
            <div className="flex flex-col gap-3 mb-8">
              <button
                onClick={() => window.open(product.product_link, '_blank')}
                className="w-full bg-[#D4A574] hover:bg-[#c29563] text-black font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {goToDetailsText}
              </button>
              {/* <button
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist || isRemovingFromWishlist}
                className="w-full bg-transparent border-2 border-[#2a2a2a] hover:border-[#D4A574] text-white py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} className={isInWishlist ? 'text-[#D4A574]' : ''} />
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button> */}
            </div>
            ) : (
              <div className="flex flex-col gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full bg-[#D4A574] hover:bg-[#c29563] text-black font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Features */}
        {/* <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Product Features</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-[#D4A574]" />
              </div>
              <span className="text-sm text-gray-300 font-medium">Cruelty Free</span>
              <span className="text-xs text-gray-500 mt-1">Never tested on animals</span>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-3">
                <Leaf className="w-8 h-8 text-[#D4A574]" />
              </div>
              <span className="text-sm text-gray-300 font-medium">Organic</span>
              <span className="text-xs text-gray-500 mt-1">Natural ingredients</span>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-3">
                <Sparkles className="w-8 h-8 text-[#D4A574]" />
              </div>
              <span className="text-sm text-gray-300 font-medium">Hypoallergenic</span>
              <span className="text-xs text-gray-500 mt-1">Gentle on sensitive skin</span>
            </div>
          </div>
        </div> */}

        {/* Skin Type Compatibility */}
        {/* <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Skin Type Compatibility</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1a1a1a] rounded-lg p-6 text-center border border-gray-800 hover:border-[#D4A574] transition-colors">
              <div className="text-3xl mb-2">💧</div>
              <h4 className="text-[#D4A574] font-semibold mb-1">Dry Skin</h4>
              <p className="text-xs text-gray-400">Intense hydration boost</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-6 text-center border border-gray-800 hover:border-[#D4A574] transition-colors">
              <div className="text-3xl mb-2">🍃</div>
              <h4 className="text-[#D4A574] font-semibold mb-1">Sensitive Skin</h4>
              <p className="text-xs text-gray-400">Gentle, non-irritating formula</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-6 text-center border border-gray-800 hover:border-[#D4A574] transition-colors">
              <div className="text-3xl mb-2">⚖️</div>
              <h4 className="text-[#D4A574] font-semibold mb-1">Combination Skin</h4>
              <p className="text-xs text-gray-400">Balanced hydration</p>
            </div>
          </div>
        </div> */}

        {/* Customer Reviews */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-8">Customer Reviews</h2>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Rating Summary */}
            <div className="md:col-span-2 flex flex-col items-center justify-center text-center border-r border-gray-800 pr-8">
              <div className="text-6xl font-bold text-white mb-2">
                {(product.averageRating || 0).toFixed(1)}
              </div>
              <div className="flex text-[#D4A574] mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    fill={i < Math.floor(product.averageRating || 0) ? 'currentColor' : 'none'}
                    className="w-5 h-5"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-400">Based on {product.totalReviews || 0} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-3 space-y-3">
              {[5, 4, 3, 2, 1].map((star, index) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-8">{star}</span>
                  <Star className="w-4 h-4 text-[#D4A574]" fill="currentColor" />
                  <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D4A574] rounded-full transition-all"
                      style={{ width: `${ratingDistribution[index]}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-12 text-right">{ratingDistribution[index]}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="mt-8 space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.slice(0, 3).map((review: any, index: number) => (
                <div key={index} className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#D4A574] rounded-full flex items-center justify-center text-black font-semibold">
                        {(review.user_id?.fullname || 'A')[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{review.user_id?.fullname || 'Anonymous'}</h4>
                        <div className="flex text-[#D4A574] mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              fill={i < review.rating ? 'currentColor' : 'none'}
                              className="w-3 h-3"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">{relatedProductText}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct: any) => (
                <ProductCard
                key={relatedProduct._id}
                product={{
                    id: relatedProduct._id,
                    name: relatedProduct.name,
                    price: relatedProduct.price,
                    image: relatedProduct.images_urls?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80',
                    category: relatedProduct.categories || [],
                    rating: relatedProduct.averageRating || 0,
                    reviewCount: relatedProduct.totalReviews || 0,
                    isBestSeller: relatedProduct.isFeatured,
                    description: relatedProduct.description,
                    originalPrice: relatedProduct.discountPrice,
                    skinType: relatedProduct.skintype ? [relatedProduct.skintype] : [],
                    ingredients: relatedProduct.ingredients || []
                }}
                />
            ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
