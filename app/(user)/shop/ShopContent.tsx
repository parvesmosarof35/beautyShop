'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaTh, FaThList } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
// import { useGetAllProductsQuery } from '@/app/store/api/productsApi';
// import { useGetAllCollectionsQuery } from '@/app/store/api/collectionApi';
import { useAddToCartMutation } from '@/app/store/api/cartApi';
import { useAuthState } from '@/app/store/hooks';
import Swal from 'sweetalert2';

const ProductCard = ({ product, viewMode = 'grid' }: { product: any, viewMode?: 'grid' | 'list' }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthState();

  const handleCardClick = () => {
    router.push(`/products/${product._id}`);
  };

  const [addToCart, { isLoading }] = useAddToCartMutation();

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

  const renderStars = () => {
    const stars = [];
    const rating = product.averageRating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-[#D4A574]" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-[#D4A574]" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-[#D4A574]" />);
      }
    }

    return stars;
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleCardClick}
        className="bg-[#2b2b2b] rounded-lg overflow-hidden flex flex-col md:flex-row shadow-sm transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
      >
        <div className="relative w-full md:w-48 h-48 flex-shrink-0">
          <Image 
            src={product.images_urls?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80'} 
            alt={product.name}
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-lg text-white mb-1">{product.name}</h3>
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {renderStars()}
            </div>
            <span className="text-sm text-gray-400">({product.totalReviews || 0})</span>
          </div>
          <div className="flex items-baseline mb-3">
             <p className="font-bold text-lg text-white">${product.price.toFixed(2)}</p>
             {product.discountPrice && (
                 <p className="ml-2 text-sm text-gray-400 line-through">${product.discountPrice.toFixed(2)}</p>
             )}
          </div>
          <p className="text-gray-300 mb-4 line-clamp-2">
            {product.description}
          </p>
          <button 
             onClick={handleAddToCart}
             disabled={isLoading}
             className="bg-[#D4A574] text-white/80 px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center self-start disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1.5"></div>
            ) : ( 
                <FaShoppingCart className="mr-1.5" size={12} /> 
            )}
            Add to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="bg-[#2b2b2b] rounded-lg overflow-hidden shadow-sm transition-transform duration-300 hover:scale-105 cursor-pointer"
    >
      <div className="relative h-48">
        <Image 
          src={product.images_urls?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80'} 
          alt={product.name} 
          width={300}
          height={200}
          className="w-full h-full object-cover"
        />
        {product.isFeatured && (
           <span className="absolute top-2 right-2 bg-[#D4A574] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Featured</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-white mb-1 line-clamp-1">{product.name}</h3>
        <div className="flex items-center mb-2">
          <div className="flex mr-1">
            {renderStars()}
          </div>
          <span className="text-xs text-gray-400">({product.totalReviews || 0})</span>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col">
              <span className="font-bold text-white">${product.price.toFixed(2)}</span>
              {product.discountPrice && (
                  <span className="text-xs text-gray-400 line-through">${product.discountPrice.toFixed(2)}</span>
              )}
          </div>
          <button 
              onClick={handleAddToCart}
              disabled={isLoading}
              className="bg-[#D4A574] text-white px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1"></div>
            ) : (
                <FaShoppingCart className="mr-1" />
            )}
             Add
          </button>
        </div>
      </div>
    </div>
  );
};

interface ShopContentProps {
  initialProducts: any[];
  initialMeta: any;
  collections: any[];
  initialParams: {
    page?: string;
    sort?: string;
    collection?: string;
  };
}

export default function ShopContent({ initialProducts = [], initialMeta, collections = [], initialParams }: ShopContentProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Use state synced with props for immediate feedback, though URL is source of truth
  const [sortBy, setSortBy] = useState(initialParams.sort || 'popularity');
  const [selectedCollectionId, setSelectedCollectionId] = useState(initialParams.collection || '');
  const [currentPage, setCurrentPage] = useState(parseInt(initialParams.page || '1'));

  const productsPerPage = 12;
  const products = initialProducts;
  const meta = initialMeta;
  const totalPages = meta?.totalPage || 1;
  const totalProducts = meta?.total || 0;

  // Sync state with props when they change (e.g. back/forward navigation)
  useEffect(() => {
    setSortBy(initialParams.sort || 'popularity');
    setSelectedCollectionId(initialParams.collection || '');
    setCurrentPage(parseInt(initialParams.page || '1'));
  }, [initialParams]);

  const updateFilters = (updates: { sort?: string; collection?: string; page?: number }) => {
     const newParams = new URLSearchParams();
     
     const newSort = updates.sort !== undefined ? updates.sort : sortBy;
     const newCollection = updates.collection !== undefined ? updates.collection : selectedCollectionId;
     const newPage = updates.page !== undefined ? updates.page : currentPage;

     // Reset page to 1 if sort or collection changes (unless page implies explicit pagination)
     // Actually, if we change filter, usually reset page. If we paginate, keep filters.
     const finalPage = (updates.page !== undefined) ? updates.page : 1; 

     if (newSort && newSort !== 'popularity') newParams.set('sort', newSort);
     if (newCollection) newParams.set('collection', newCollection);
     if (finalPage > 1) newParams.set('page', finalPage.toString());

     router.push(`/shop?${newParams.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setSortBy(val); // optimistic
      updateFilters({ sort: val, page: 1 });
  };
  
  const handleCollectionChange = (id: string) => {
      setSelectedCollectionId(id); // optimistic
      updateFilters({ collection: id, page: 1 });
  };

  const paginate = (pageNumber: number) => {
      setCurrentPage(pageNumber); // optimistic
      updateFilters({ page: pageNumber });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#171717]">
  
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 bg-[#171717]">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">All Products</h1>
              <p className="text-sm text-gray-400">
                Showing {products.length > 0 ? (currentPage - 1) * productsPerPage + 1 : 0}-{Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} results
              </p>
              
              {/* Category Filters (Collections) */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                    onClick={() => handleCollectionChange('')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCollectionId === ''
                        ? 'bg-[#D4A574] text-black'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    All Products
                  </button>
                {collections.map((collection: any) => (
                  <button
                    key={collection._id}
                    onClick={() => handleCollectionChange(collection._id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCollectionId === collection._id
                        ? 'bg-[#D4A574] text-black'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {collection.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center">
                <span className="text-sm text-gray-900 mr-2">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff9494] focus:border-transparent"
                >
                  <option value="popularity">Sort by popularity</option>
                  <option value="newest">Sort by latest</option>
                  <option value="price-low">Sort by price: low to high</option>
                  <option value="price-high">Sort by price: high to low</option>
                  <option value="rating">Sort by average rating</option>
                </select>
              </div>
              
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'}`}
                  aria-label="Grid view"
                >
                  <FaTh className={viewMode === 'grid' ? 'text-[#ff9494]' : 'text-gray-500'} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'}`}
                  aria-label="List view"
                >
                  <FaThList className={viewMode === 'list' ? 'text-[#ff9494]' : 'text-gray-500'} />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
               <div className="col-span-full text-center py-10 text-gray-400">No products found</div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product: any) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
            </div>
          ) : (
            <div className="space-y-6">
                  {products.map((product: any) => (
                    <ProductCard key={product._id} product={product} viewMode="list" />
                  ))}
            </div>
          )}

          {/* View More Button (Functional as Next Page) */}
          {currentPage < totalPages && (
            <div className="mt-10 text-center">
                <button 
                className="bg-[#2b2b2b] text-white px-8 py-3 rounded-full text-sm font-medium border-2 border-white/20 hover:border-[#D4A574] hover:bg-[#D4A574] hover:text-black transition-all duration-300"
                onClick={() => {
                    paginate(currentPage + 1);
                }}
                >
                View More
                </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-1">
                <button 
                  onClick={() => paginate(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full hover:bg-gray-100 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &laquo;
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`w-10 h-10 rounded-full ${currentPage === pageNum ? 'bg-[#ff9494] text-white' : 'hover:bg-gray-100 hover:text-black'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full hover:bg-gray-100 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &raquo;
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>
      
    </div>
  );
}
