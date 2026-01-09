'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiShoppingBag, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import CartItem from './CartItem';
import { 
  useGetMyCartQuery, 
  useUpdateCartItemQuantityMutation, 
  useRemoveFromCartMutation, 
  useClearMyCartMutation 
} from '../../store/api/cartApi';
import { useCreateCheckoutSessionMutation } from '../../store/api/orderApi';
import Swal from 'sweetalert2';

export default function CartPage() {
  const { data: cartData, isLoading } = useGetMyCartQuery({});
  const [updateQuantity, { isLoading: isUpdating }] = useUpdateCartItemQuantityMutation();
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [clearCart, { isLoading: isClearing }] = useClearMyCartMutation();
  const [createCheckoutSession, { isLoading: isCreatingCheckout }] = useCreateCheckoutSessionMutation();

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
    email: ''
  });
  const [notes, setNotes] = useState('');

  const cartItems = cartData?.data?.items || [];
  const meta = cartData?.data?.summary;
  
  // Calculate cart summary from API or fallback to calculation
  const subtotal = meta?.subtotal || cartItems.reduce((sum: number, item: any) => sum + ((item.product_id?.price || 0) * item.quantity), 0);
  const itemCount = meta?.itemCount || cartItems.length;
  const shipping = subtotal > 0 ? (subtotal > 50 ? 0 : 10) : 0; // Free shipping over $50
  const discount = 0; 
  const total = subtotal + shipping - discount;

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
      await updateQuantity({ productId, quantity: newQuantity }).unwrap();
    } catch (err: any) {
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.data?.message || 'Failed to update quantity',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          background: '#171717',
          color: '#fff'
      });
    }
  };

  const handleRemoveItem = async (productId: string) => {
    // Show confirmation dialog? Or just remove. 
    // Usually removal is instant but nice to have confirm for big actions? 
    // User requested "delete product /:productid".
    try {
        await removeFromCart(productId).unwrap();
        Swal.fire({
            icon: 'success',
            title: 'Removed from cart',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            background: '#171717',
            color: '#fff'
        });
    } catch (err: any) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.data?.message || 'Failed to remove item',
            background: '#171717',
            color: '#fff'
        });
    }
  };

  const handleClearCart = async () => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d4a674',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, clear it!',
        background: '#171717',
        color: '#fff'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await clearCart({}).unwrap();
                Swal.fire({
                    title: 'Cleared!',
                    text: 'Your cart has been cleared.',
                    icon: 'success',
                    background: '#171717',
                    color: '#fff',
                    confirmButtonColor: '#d4a674'
                });
            } catch (err: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err?.data?.message || 'Failed to clear cart',
                    background: '#171717',
                    color: '#fff'
                });
            }
        }
    });
  };

  const handleCheckout = async () => {
    // Validate shipping address
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.country || !shippingAddress.phone || !shippingAddress.email) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all shipping details including phone number and email.',
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#d4a674'
      });
      return;
    }

    try {
        const response = await createCheckoutSession({
            shippingAddress,
            notes,
            currency: 'usd'
        }).unwrap();

        if (response?.data?.paymentUrl) {
            window.location.href = response.data.paymentUrl;
        } else {
             Swal.fire({
                icon: 'error',
                title: 'Checkout Failed',
                text: 'No checkout URL received from server.',
                background: '#171717',
                color: '#fff',
                confirmButtonColor: '#d4a674'
              });
        }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Checkout Failed',
        text: err?.data?.message || 'Something went wrong while processing your request.',
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#d4a674'
      });
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-[#171717] text-white flex items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A574]"></div>
        </div>
    );
  }

  return (
    <div className="flex-1 min-h-[60vh]">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold mb-6 text-white">Shopping Cart</h1>
      </div>

      <main className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-800 inline-flex items-center justify-center w-20 h-20 rounded-full mb-4">
              <FiShoppingBag className="text-3xl text-gray-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-white">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">
              You haven't added any items to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#d4a674] text-black font-medium px-6 py-3 rounded-md hover:bg-[#c49560] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-[#171717] rounded-lg p-6">
                <div className="hidden md:flex pb-4 border-b border-gray-700 mb-6">
                  <div className="w-1/3 text-gray-400 font-medium">PRODUCT</div>
                  <div className="w-1/4 text-gray-400 font-medium">PRICE</div>
                  <div className="w-1/4 text-gray-400 font-medium">QUANTITY</div>
                  <div className="w-1/6 text-right text-gray-400 font-medium">TOTAL</div>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item: any) => (
                    <CartItem 
                      key={item._id} 
                      // Mapping API response structure to CartItem expected structure
                      // CartItem expects: id, name, price, originalPrice, image, color, size, quantity
                      // API provides: product_id { _id, name, price, images_urls }, quantity
                      item={{
                        id: item.product_id?._id, // Use product_id for updates/removals
                        name: item.product_id?.name || 'Unknown Product',
                        price: item.product_id?.price || 0,
                        originalPrice: item.product_id?.discountPrice,
                        image: item.product_id?.images_urls?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80',
                        quantity: item.quantity,
                        
                      }}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <Link 
                    href="/products" 
                    className="flex items-center text-[#d4a674] hover:text-[#c49560] transition-colors"
                  >
                    <FiArrowLeft className="mr-2" /> Continue Shopping
                  </Link>
                  
                  <button 
                    className="px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
                    onClick={handleClearCart}
                    disabled={isClearing}
                  >
                    {isClearing ? 'Clearing...' : 'Clear Cart'}
                  </button>
                </div>
              </div>

              {/* Promo Code */}
              {/* <div className="mt-6 bg-[#171717] rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-white">Promo Code</h3>
                <p className="text-gray-400 text-sm mb-4">Enter your promo code if you have one</p>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Enter promo code"
                    className="flex-1 bg-[#2a2a2a] border border-gray-600 rounded-l-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674]"
                  />
                  <button className="bg-[#d4a674] text-black font-medium px-6 py-2 rounded-r-md hover:bg-[#c49560] transition-colors">
                    Apply
                  </button>
                </div>
              </div> */}
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-[#171717] rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-6 text-white">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg font-medium mb-2 text-white">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm mb-2">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-gray-400 text-sm mb-2">
                      <span>Discount</span>
                      <span className="text-green-500">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-700 my-4"></div>
                  <div className="flex justify-between text-xl font-semibold mb-6 text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4 text-white">Shipping Details</h3>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Street Address"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                      className="w-full bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674]"
                    />
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="City"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        className="w-1/2 bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674]"
                      />
                      <input 
                        type="text" 
                        placeholder="State"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        className="w-1/2 bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674]"
                      />
                    </div>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="Postal Code"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                        className="w-1/2 bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674]"
                      />
                      <input 
                        type="text" 
                        placeholder="Country"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                        className="w-1/2 bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674]"
                      />
                    </div>
                    <div className="flex gap-4">
                        <input 
                            type="tel" 
                            placeholder="Phone Number"
                            value={shippingAddress.phone}
                            onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                            className="w-1/2 bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674]"
                        />
                         <input 
                            type="email" 
                            placeholder="Email Address"
                            value={shippingAddress.email}
                            onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                            className="w-1/2 bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674]"
                        />
                    </div>
                    <textarea 
                      placeholder="Order Notes (Optional)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674] h-24 resize-none"
                    />
                  </div>
                </div>

                <button 
                  className="w-full bg-[#d4a674] text-black font-medium py-3 rounded-md hover:bg-[#c49560] transition-colors mb-4 disabled:opacity-50 flex justify-center items-center"
                  onClick={handleCheckout}
                  disabled={isCreatingCheckout}
                >
                  {isCreatingCheckout ? (
                     <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mr-2"></div>
                  ) : null}
                  Proceed to Checkout
                </button>

                <div className="text-center text-sm text-gray-400">
                  or <Link href="/products" className="text-[#d4a674] hover:underline">Continue Shopping</Link>
                </div>

                {/* <div className="mt-8 space-y-4">
                  <div className="flex items-start">
                    <FiTruck className="text-[#d4a674] mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-white">Free Shipping</h4>
                      <p className="text-sm text-gray-400">Free shipping on all orders over $100</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiRefreshCw className="text-[#d4a674] mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-white">Easy Returns</h4>
                      <p className="text-sm text-gray-400">30-day return policy</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiShield className="text-[#d4a674] mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-white">Secure Checkout</h4>
                      <p className="text-sm text-gray-400">Your payment information is secure</p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}