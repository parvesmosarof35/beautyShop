'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiCreditCard, FiSmartphone } from 'react-icons/fi';
import { FaApple, FaGoogle, FaStripe } from 'react-icons/fa';
import {
    useGetMyCartQuery,
} from '../../store/api/cartApi';
import {
    useCreateCheckoutSessionMutation,
    useCreateCheckoutSessionGooglePayMutation,
    useCreateCheckoutSessionApplePayMutation,
    useCreateCheckoutSessionMultipleMutation
} from '../../store/api/orderApi';
import Swal from 'sweetalert2';

export default function CheckoutPage() {
    const { data: cartData, isLoading: isCartLoading } = useGetMyCartQuery({});
    const [createCheckoutSession, { isLoading: isCreatingCard }] = useCreateCheckoutSessionMutation();
    const [createCheckoutGoogle, { isLoading: isCreatingGoogle }] = useCreateCheckoutSessionGooglePayMutation();
    const [createCheckoutApple, { isLoading: isCreatingApple }] = useCreateCheckoutSessionApplePayMutation();
    const [createCheckoutMultiple, { isLoading: isCreatingMultiple }] = useCreateCheckoutSessionMultipleMutation();

    const isCreatingCheckout = isCreatingCard || isCreatingGoogle || isCreatingApple || isCreatingMultiple;

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
    const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'apple', 'google', 'stripe'

    const cartItems = cartData?.data?.items || [];
    const meta = cartData?.data?.summary;

    const subtotal = meta?.subtotal || cartItems.reduce((sum: number, item: any) => sum + ((item.product_id?.price || 0) * item.quantity), 0);
    const itemCount = meta?.itemCount || cartItems.length;
    const shipping = subtotal > 0 ? (subtotal > 50 ? 0 : 10) : 0;
    const discount = 0;
    const total = subtotal + shipping - discount;

    const handlePlaceOrder = async () => {
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
            let response;
            const commonPayload = {
                shippingAddress,
                notes,
                currency: 'usd'
            };

            if (paymentMethod === 'card') {
                response = await createCheckoutSession(commonPayload).unwrap();
            } else if (paymentMethod === 'apple') {
                response = await createCheckoutApple(commonPayload).unwrap();
            } else if (paymentMethod === 'google') {
                response = await createCheckoutGoogle(commonPayload).unwrap();
            } else if (paymentMethod === 'stripe') {
                response = await createCheckoutMultiple({
                    ...commonPayload,
                    paymentMethodType: 'multiple'
                }).unwrap();
            }

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

    if (isCartLoading) {
        return (
            <div className="min-h-screen bg-[#171717] text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A574]"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-[60vh] bg-[#1a1a1a] text-white">
            <div className="container mx-auto px-4 py-8">
                <Link
                    href="/cart"
                    className="flex items-center text-[#d4a674] hover:text-[#c49560] transition-colors mb-6"
                >
                    <FiArrowLeft className="mr-2" /> Return to Cart
                </Link>
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Details & Payment */}
                    <div className="lg:w-2/3 space-y-8">

                        {/* Payment Methods */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4">Payment Method powered by Stripe</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all h-24 ${paymentMethod === 'card' ? 'border-[#d4a674] bg-[#2a2a2a]' : 'border-gray-700 hover:border-gray-500 bg-[#222]'}`}
                                >
                                    <FiCreditCard className="text-2xl mb-2" />
                                    <span className="text-sm font-medium">Card</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('apple')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all h-24 ${paymentMethod === 'apple' ? 'border-[#d4a674] bg-[#2a2a2a]' : 'border-gray-700 hover:border-gray-500 bg-[#222]'}`}
                                >
                                    <FaApple className="text-2xl mb-2" />
                                    <span className="text-sm font-medium">Apple Pay</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('google')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all h-24 ${paymentMethod === 'google' ? 'border-[#d4a674] bg-[#2a2a2a]' : 'border-gray-700 hover:border-gray-500 bg-[#222]'}`}
                                >
                                    <FaGoogle className="text-2xl mb-2" />
                                    <span className="text-sm font-medium">Google Pay</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('stripe')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all h-24 ${paymentMethod === 'stripe' ? 'border-[#d4a674] bg-[#2a2a2a]' : 'border-gray-700 hover:border-gray-500 bg-[#222]'}`}
                                >
                                    <FaStripe className="text-4xl mb-1" />
                                    <span className="text-sm font-medium">Stripe multiple payments</span>
                                </button>
                            </div>
                        </section>

                        {/* Shipping Details */}
                        <section>
                            <h3 className="text-xl font-semibold mb-4">Shipping Details</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    value={shippingAddress.street}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674]"
                                />
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={shippingAddress.city}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                        className="w-1/2 bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674]"
                                    />
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={shippingAddress.state}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                        className="w-1/2 bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674]"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Postal Code"
                                        value={shippingAddress.postalCode}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                        className="w-1/2 bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674]"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        value={shippingAddress.country}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                        className="w-1/2 bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674]"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={shippingAddress.phone}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                        className="w-1/2 bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674]"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={shippingAddress.email}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                                        className="w-1/2 bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674]"
                                    />
                                </div>
                                <textarea
                                    placeholder="Order Notes (Optional)"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d4a674] h-24 resize-none"
                                />
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-[#222] rounded-lg p-6 sticky top-4 border border-gray-800">
                            <h2 className="text-xl font-bold mb-6 text-white">Order Summary</h2>

                            {/* Small item preview could act good here */}
                            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item: any) => (
                                    <div key={item._id} className="flex gap-3 text-sm">
                                        <div className="w-12 h-12 bg-gray-800 rounded flex-shrink-0 overflow-hidden">
                                            <img
                                                src={item.product_id?.images_urls?.[0] || 'https://via.placeholder.com/50'}
                                                alt={item.product_id?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white line-clamp-1">{item.product_id?.name}</p>
                                            <p className="text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-white font-medium">
                                            ${(item.product_id?.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-700 my-4"></div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-base font-medium text-white">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Discount</span>
                                        <span className="text-green-500">-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-700 my-4"></div>
                                <div className="flex justify-between text-xl font-bold text-white">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                className="w-full bg-[#d4a674] text-black font-bold py-3 rounded-md hover:bg-[#c49560] transition-colors disabled:opacity-50 flex justify-center items-center text-lg"
                                onClick={handlePlaceOrder}
                                disabled={isCreatingCheckout}
                            >
                                {isCreatingCheckout ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mr-2"></div>
                                ) : null}
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
