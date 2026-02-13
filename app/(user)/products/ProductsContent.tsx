'use client';

import { useState, useEffect } from 'react';
import { Filter, Grid, List, Star, ShoppingCart, Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/app/components/ProductCard';
import { useAddToCartMutation } from '@/app/store/api/cartApi';
import { useAddToWishlistMutation, useGetMyWishlistQuery, useRemoveFromWishlistMutation } from '@/app/store/api/wishlistApi';
import { useAuthState } from '@/app/store/hooks';
import FilterComponent from '@/app/components/FilterComponent';
import Swal from 'sweetalert2';

// Debounce hook
const ProductListItem = ({ product }: { product: any }) => {
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthState();

  const { data: settingsData } = useGetSettingsQuery({});
  const settings = settingsData?.data?.productdetails || {};
  const goToDetailsText = settings.Gotodetailstext || "Go to Details";

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
        const returnUrl = encodeURIComponent(pathname + window.location.search);
        router.push(`/login?redirect=${returnUrl}`);
        return;
    }

    try {
      const res = await addToCart({
        product_id: product._id,
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

  const { data: wishlistData } = useGetMyWishlistQuery({});
  const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] = useRemoveFromWishlistMutation();

  const isInWishlist = wishlistData?.data?.some((item: any) => item.product_id?._id === product._id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
        const returnUrl = encodeURIComponent(pathname + window.location.search);
        router.push(`/login?redirect=${returnUrl}`);
        return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(product._id).unwrap();
        // Optional: Toast for removal
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

  return (
    <div className="bg-[#383838] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row h-64 w-full border border-gray-700">
      {/* Image - Left side */}
      <div className="relative h-48 sm:h-full w-full sm:w-64 flex-shrink-0">
        <Image
          src={product.images_urls?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80'}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 25vw"
        />
        {product.isFeatured && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white text-[10px] font-medium px-2 py-1 rounded-full uppercase tracking-wider">
            Featured
          </div>
        )}
      </div>
      
      {/* Details - Right side */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-xs text-gray-300 mb-2">{product.categories?.[0] || 'Uncategorized'}</div>
        <h3 className="font-medium text-gray-100 text-xl mb-2">{product.name}</h3>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-4 h-4 ${star <= (product.averageRating || 0) ? 'text-[#5CA1B5] fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-1">({product.totalReviews || 0})</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-gray-100">${product.price.toFixed(2)}</span>
            {product.discountPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                ${product.discountPrice.toFixed(2)}
              </span>
            )}
          </div>
          {product.product_link ? (
              <a
                href={product.product_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="bg-[#d4a674] text-white text-sm px-4 py-2 rounded-full transition-colors flex items-center hover:bg-[#b88b5c]"
              >
                {goToDetailsText}
              </a>
          ) : (
              <button 
                onClick={handleAddToCart}
                disabled={isLoading}
                className="bg-[#d4a674] text-white text-sm px-4 py-2 rounded-full transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-1"></div>
                ) : (
                    <ShoppingCart className="w-4 h-4 mr-1" />
                )}
                Add to Cart
              </button>
          )}
          
          <button 
            onClick={handleWishlistToggle}
            disabled={isAddingToWishlist || isRemovingFromWishlist}
            className={`ml-2 p-2 rounded-full border transition-colors ${isInWishlist 
                ? 'bg-[#d4a674] border-[#d4a674] text-white' 
                : 'border-gray-600 text-gray-400 hover:border-[#d4a674] hover:text-[#d4a674]'}`}
          >
             <Heart className="w-5 h-5" fill={isInWishlist ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

import { useGetSettingsQuery } from '@/app/store/api/settingsApi';

type FilterState = {
  collections: string[];
  priceRange: [number, number];
  skinTypes: string[];
  ingredients: string[];
};

interface ProductsContentProps {
  title?: string;
  description?: string;
  products: any[];
  meta: any;
  collections: any[];
}

export default function ProductsContent({ 
  title = "All Products", 
  description = "Discover our complete collection of premium beauty products",
  products,
  meta,
  collections
}: ProductsContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: settingsData } = useGetSettingsQuery({});
  const settings = settingsData?.data?.productpage || {};

  const displayTitle = settings.title || title;
  const displayDescription = settings.subtitle || description;

  // State for filters - Initialize from URL
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const initialSort = searchParams.get('sort');
  const [sortBy, setSortBy] = useState(
     initialSort === 'priceLowToHigh' ? 'price-low-high' :
     initialSort === 'priceHighToLow' ? 'price-high-low' :
     initialSort === 'bestRating' ? 'rating' :
     initialSort === 'newest' ? 'newest' :
     'best-selling'
  );

  const [filters, setFilters] = useState<FilterState>({
    collections: searchParams.getAll('collections') || [],
    priceRange: [0, Number(searchParams.get('maxprice')) || 3000],
    skinTypes: searchParams.getAll('skintype') || [],
    ingredients: searchParams.getAll('ingredients') || [],
  });
  
  // Debounce filters to avoid excessive URL updates
  const debouncedFilters = useDebounce(filters, 500);
  const debouncedSortBy = useDebounce(sortBy, 500);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const productsPerPage = 12;

  // Available filter options
  const skinTypes = ['Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'];
  const ingredients = ['Hyaluronic Acid', 'Vitamin C', 'Retinol', 'Niacinamide', 'Peptides', 'AHA', 'BHA', 'Ceramides', 'Zinc'];

  // Map frontend sort to backend sort keys
  const getBackendSort = (sort: string) => {
    switch (sort) {
      case 'price-low-high': return 'priceLowToHigh';
      case 'price-high-low': return 'priceHighToLow';
      case 'rating': return 'bestRating';
      case 'newest': return 'newest';
      case 'best-selling': return 'bestSelling';
      default: return 'bestSelling';
    }
  };

  // Sync state with URL using router.push
  useEffect(() => {
    const params = new URLSearchParams();
    
    params.set('page', currentPage.toString());
    params.set('limit', productsPerPage.toString());
    params.set('sort', getBackendSort(debouncedSortBy));
    params.set('maxprice', debouncedFilters.priceRange[1].toString());

    debouncedFilters.collections.forEach(c => params.append('collections', c));
    debouncedFilters.skinTypes.forEach(s => params.append('skintype', s));
    debouncedFilters.ingredients.forEach(i => params.append('ingredients', i));

    // Sort params to ensure consistent URL matching with server/header
    params.sort();

    // Only push if the query string has actually changed to avoid redundant pushes
    const queryString = params.toString();
    if (searchParams.toString() !== queryString) {
         router.push(`${pathname}?${queryString}`, { scroll: false });
    }
  }, [debouncedFilters, debouncedSortBy, currentPage, pathname, router]); // Intentionally removed searchParams from deps to avoid loops

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Reset page when filters change (using debounced values)
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilters, debouncedSortBy]);




  return (
    <div className="min-h-screen bg-[#171717] text-white">
      {/* Header */}
      <div className="bg-[#171717] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">{displayTitle}</h1>
          <p className="text-gray-300">{displayDescription}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile filter button */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700"
            >
              <Filter size={16} />
              <span>{showMobileFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                aria-label="Grid view"
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                aria-label="List view"
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Sidebar - Reusable Filter Component */}
          <FilterComponent
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            collections={collections}
            skinTypes={skinTypes}
            ingredients={ingredients}
            showMobileFilters={showMobileFilters}
            setShowMobileFilters={setShowMobileFilters}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Desktop sort and view */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <p className="text-gray-400">
                Showing {(currentPage - 1) * productsPerPage + 1}-{Math.min(currentPage * productsPerPage, meta?.total || 0)} of{' '}
                {meta?.total || 0} products
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <span className="mr-2 text-gray-400">View:</span>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-l ${viewMode === 'grid' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                    aria-label="Grid view"
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-r ${viewMode === 'list' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                    aria-label="List view"
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {false ? ( // isLoading is no longer available here, handled by Suspense or just quick transition
               <div className="flex justify-center items-center h-64">
                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A574]"></div>
               </div>
            ) : products && products.length > 0 ? (
              <div
                className={`${viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'}`}
              >
                {products.map((product: any) => (
                  viewMode === 'grid' ? (
                    <ProductCard key={product._id} product={{
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.images_urls?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80',
                        category: product.categories || [],
                        rating: product.averageRating || 0,
                        reviewCount: product.totalReviews || 0,
                        isBestSeller: product.isFeatured,
                        description: product.description,
                        originalPrice: product.discountPrice,
                        skinType: product.skintype ? [product.skintype] : [],
                        ingredients: product.ingredients || [],
                        product_link: product.product_link
                    }} />
                  ) : (
                    <ProductListItem key={product._id} product={product} />
                  )
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-300">No products found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}

            {/* Pagination */}
              {meta && meta.totalPage > 1 && (
              <div className="flex justify-center mt-10">
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md text-gray-400 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &laquo;
                  </button>
                  
                  {Array.from({ length: Math.min(5, meta.totalPage) }, (_, i) => {
                    // Show first page, last page, current page, and pages around current page
                    if (meta.totalPage <= 5) {
                      // Show all pages if 5 or fewer
                      return i + 1;
                    } else if (currentPage <= 3) {
                      // Show first 4 pages and "..."
                      if (i < 4) return i + 1;
                      if (i === 4) return '...';
                      if (i === 5) return meta.totalPage;
                    } else if (currentPage >= meta.totalPage - 2) {
                      // Show last 4 pages and "..."
                      if (i === 0) return 1;
                      if (i === 1) return '...';
                      return meta.totalPage - 4 + i;
                    } else {
                      // Show pages around current page
                      if (i === 0) return 1;
                      if (i === 1) return '...';
                      if (i === 3) return '...';
                      if (i === 4) return meta.totalPage;
                      return currentPage - 2 + i;
                    }
                  }).map((page, i) =>
                    page === '...' ? (
                      <span key={i} className="px-3 py-1 text-gray-500">
                        {page}
                      </span>
                    ) : (
                      <button
                        key={i}
                        onClick={() => paginate(Number(page))}
                        className={`w-10 h-10 rounded-md flex items-center justify-center ${
                          currentPage === page
                            ? 'bg-[#d4a674] text-white'
                            : 'text-gray-400 hover:bg-gray-800'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  
                  <button
                    onClick={() => paginate(Math.min(meta.totalPage, currentPage + 1))}
                    disabled={currentPage === meta.totalPage}
                    className="p-2 rounded-md text-gray-400 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &raquo;
                  </button>
                </nav>
              </div>
              )}

          </div>
        </div>
      </div>
    </div>
  );
}
