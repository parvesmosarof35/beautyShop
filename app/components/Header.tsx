'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiSearch, FiUser, FiX, FiShoppingBag, FiHeart, FiLogIn, FiLogOut, FiSettings, FiMenu } from 'react-icons/fi';
import { Button } from '@/app/components/ui/button';
import { useAuthState, useAuthActions } from '@/app/store/hooks';
import { useGetSearchProductsQuery } from '@/app/store/api/productsApi';
import { useGetMyCartQuery } from '@/app/store/api/cartApi';
import { useGetMyWishlistQuery } from '@/app/store/api/wishlistApi';
import { useGetAllCollectionsQuery } from '@/app/store/api/collectionApi';
import { FiChevronDown } from 'react-icons/fi';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auth state
  const { isAuthenticated, isAdmin } = useAuthState();
  const { logout } = useAuthActions();

  // Fetch Cart and Wishlist Data
  const { data: cartData } = useGetMyCartQuery(undefined, { skip: !isAuthenticated });
  const { data: wishlistData } = useGetMyWishlistQuery(undefined, { skip: !isAuthenticated });

  const cartItemCount = cartData?.data?.items?.length || 0; 
  const wishlistCount = wishlistData?.data?.length || 0;

  //console.log(isAdmin, "value of isadmin ");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      // Close search results when clicking outside
      const clickedInsideDesktop = searchRef.current && searchRef.current.contains(event.target as Node);
      const clickedInsideMobile = mobileSearchRef.current && mobileSearchRef.current.contains(event.target as Node);
      
      if (!clickedInsideDesktop && !clickedInsideMobile) {
          setSearchResultsOpen(false);
          setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const mobileSearchRef = useRef<HTMLFormElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  const { data: searchResults, isLoading: isSearchLoading } = useGetSearchProductsQuery(debouncedSearchQuery, {
    skip: !debouncedSearchQuery.trim(),
  });

  // Fetch Collections for Dropdown
  const { data: collectionsData } = useGetAllCollectionsQuery({});

  useEffect(() => {
    if (debouncedSearchQuery.trim() && searchResults?.data?.length > 0) {
      setSearchResultsOpen(true);
    } else {
      setSearchResultsOpen(false);
    }
  }, [debouncedSearchQuery, searchResults]);

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
    setSearchResultsOpen(false);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };



  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?searchTerm=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleNavigation = () => {
    setIsMobileMenuOpen(false); // Close mobile menu
    setIsSearchOpen(false);
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Products', href: '/products' },
    { label: 'Shop', href: '/shop' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ];

  // Reusable Search Results Dropdown
  const renderSearchResultsDropdown = () => {
    if (!searchResultsOpen) return null;
    
    return (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
            {isSearchLoading ? (
                <div className="p-4 text-center text-gray-400">Loading...</div>
            ) : (
                searchResults?.data?.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                        {searchResults.data.map((product: any) => (
                            <div
                                key={product._id}
                                onClick={() => handleProductClick(product._id)}
                                className="flex items-center p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0 transition-colors"
                            >
                                <div className="flex-shrink-0 h-10 w-10 relative rounded overflow-hidden mr-3">
                                    {product.images_urls && product.images_urls.length > 0 ? (
                                        <Image
                                            src={product.images_urls[0]}
                                            alt={product.name}
                                            fill
                                            sizes="40px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs text-gray-500">
                                            No Img
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {product.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-400">No products found</div>
                )
            )}
        </div>
    );
  };

  // Reusable Right Controls Component to avoid code duplication
  const renderRightControls = (isMobileView = false) => (
    <div className="flex items-center space-x-4 md:space-x-6">
      {/* Search */}
      <div className={`relative flex items-center justify-center ${!isMobileView ? 'w-10 h-10' : ''}`}>
        {isMobileView ? (
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-white hover:text-white transition-colors"
            aria-label={isSearchOpen ? 'Close search' : 'Open search'}
          >
            <FiSearch className="h-5 w-5" />
          </button>
        ) : (
          isSearchOpen ? (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 lg:w-80 animate-fade-in z-50">
              <form onSubmit={handleSearch} className="relative group" ref={searchRef}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-gray-800 border border-gray-300 text-white text-sm rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-[#d4a674] focus:ring-1 focus:ring-[#d4a674] transition-all duration-300 placeholder-gray-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d4a674] transition-colors hover:text-white"
                  aria-label="Submit search"
                >
                  <FiSearch className="h-4 w-4 text-gray-200" />
                </button>

                {/* Search Results Dropdown */}
                {renderSearchResultsDropdown()}
              </form>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-white transition-colors"
              aria-label="Open search"
            >
              <FiSearch className="h-5 w-5" />
            </button>
          )
        )}
      </div>

      {/* Wishlist */}
      {/* {isAuthenticated && (
        <Link href="/wishlist" className="text-white hover:text-white transition-colors relative" onClick={handleNavigation}>
          <FiHeart className="h-5 w-5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gray-300 text-gray-800 text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {wishlistCount > 9 ? '9+' : wishlistCount}
            </span>
          )}
        </Link>
      )} */}

            {/* Account (Desktop Only) */}
      {!isMobileView && (
        !isAuthenticated ? (
          <Link href="/login" onClick={handleNavigation}>
            <Button variant="outline" className="text-white font-montserrat border-white border hover:bg-white hover:text-black transition-colors h-8 px-4 text-xs">
              Login
            </Button>
          </Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-white hover:text-white transition-colors flex items-center"
              aria-label="User menu"
            >
              <FiUser className="h-5 w-5" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#171717] rounded-md shadow-lg py-1 z-50 border border-gray-800">
                <Link href="/account" className="flex items-center px-4 py-2 text-sm text-gray-100 hover:bg-gray-800" onClick={() => { handleNavigation(); setIsDropdownOpen(false); }}>
                  <FiUser className="mr-2 h-4 w-4" /> My Profile
                </Link>
                {isAdmin && (
                  <Link href="/admin/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-100 hover:bg-gray-800" onClick={() => { handleNavigation(); setIsDropdownOpen(false); }}>
                    <FiSettings className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-800 flex items-center">
                  <FiLogOut className="mr-2 h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        )
      )}

      {/* Cart */}
      {isAuthenticated && (
        <Link href="/cart" className="text-white hover:text-white relative transition-colors" onClick={handleNavigation} aria-label={`Cart with ${cartItemCount} items`}>
          <FiShoppingBag className="h-5 w-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gray-300 text-gray-800 text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {cartItemCount > 9 ? '9+' : cartItemCount}
            </span>
          )}
        </Link>
      )}


    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-[#000000] font-serif backdrop-blur-md shadow-sm min-h-12 transition-all duration-300">
      <div className="container mx-auto px-4 pb-1">
        
        {/* =======================
            MOBILE HEADER 
           ======================= */}
        <div className="md:hidden flex items-center justify-between py-4 bg-[#000000] text-gray-200">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2" aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}>
            {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
          
          <Link href="/" onClick={handleNavigation} className="flex-1 flex justify-center ml-2">
            <div className="relative w-32 h-10">
              <Image src="/images/logo.png" alt="Lunel Beauty" fill sizes="128px" className="object-contain" priority />
            </div>
          </Link>

          {renderRightControls(true)}
        </div>

        {/* Mobile Search Bar (Expandable) */}
        {isSearchOpen && isMobile && (
          <div className="md:hidden px-4 pb-4 animate-fade-in">
             <form onSubmit={handleSearch} className="relative" ref={mobileSearchRef}>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:border-[#d4a674]" autoFocus aria-label="Search" />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-label="Submit search"><FiSearch className="h-5 w-5" /></button>
              {renderSearchResultsDropdown()}
            </form>
          </div>
        )}

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#000000] border-t border-gray-900 animate-slide-in-top">
            <nav className="flex flex-col p-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg transition-colors font-montserrat" onClick={handleNavigation}>{link.label}</Link>
              ))}
              <div className="my-2 border-t border-gray-800"></div>
              {!isAuthenticated ? (
                <Link href="/login" className="px-4 py-3 text-[#d4a674] font-medium hover:bg-gray-900 rounded-lg flex items-center" onClick={handleNavigation}>
                  <FiLogIn className="mr-3 h-5 w-5" /> Login / Register
                </Link>
              ) : (
                <>
                  <Link href="/account" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg flex items-center" onClick={handleNavigation}>
                    <FiUser className="mr-3 h-5 w-5" /> My Profile
                  </Link>
                  {isAdmin && <Link href="/admin/dashboard" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg flex items-center" onClick={handleNavigation}>
                    <FiSettings className="mr-3 h-5 w-5" /> Dashboard
                  </Link>}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-gray-900 rounded-lg flex items-center">
                    <FiLogOut className="mr-3 h-5 w-5" /> Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}


        {/* =======================
            DESKTOP HEADER (Restored Original Layout)
           ======================= */}
        <div className="hidden md:flex flex-col items-center py-4 bg-[#000000] text-gray-200">
          <Link href="/" className="flex items-center -mt-2" onClick={handleNavigation}>
            <div className="relative w-32 h-14 transition-all duration-300 hover:scale-105">
              <Image src="/images/logo.png" alt="Lunel Beauty" width={128} height={40} className="object-contain" style={{ width: 'auto', height: 'auto' }} priority />
            </div>
          </Link>
 
          <div className="w-full flex justify-between items-center px-4 md:px-0 font-montserrat mt-5">
            <nav className="flex justify-center space-x-6 lg:space-x-12 z-50">
              {navLinks.map((link) => (
                link.label === 'Products' ? (
                  <div key={link.href} className="relative group">
                    <Link 
                      href={link.href} 
                      className="text-white hover:text-white transition-colors font-montserrat flex items-center gap-1 py-4" 
                      onClick={handleNavigation}
                    >
                      {link.label}
                      <FiChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    </Link>
                    
                    {/* Hover Dropdown */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                      <div className="py-2">
                        <Link 
                          href="/products" 
                          className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                          onClick={handleNavigation}
                        >
                          All Products
                        </Link>
                        {collectionsData?.data?.map((collection: any) => (
                          <Link
                            key={collection._id}
                            href={`/products?collections=${collection._id}`}
                            className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                            onClick={handleNavigation}
                          >
                            {collection.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link key={link.href} href={link.href} className="text-white hover:text-white transition-colors font-montserrat py-4" onClick={handleNavigation}>{link.label}</Link>
                )
              ))}
            </nav>
            {renderRightControls(false)}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;