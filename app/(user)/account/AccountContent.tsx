'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiLock, FiShield, FiPackage, FiCalendar, FiBox, FiX, FiPrinter, FiEye, FiEyeOff, FiStar } from 'react-icons/fi';
import { useAuthState } from '@/app/store/hooks';
import { useGetMyProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from '@/app/store/api/authApi';
import { useGetMyOrdersQuery } from '@/app/store/api/orderApi';
import { useCreateReviewMutation } from '@/app/store/api/reviewsApi';
import Swal from 'sweetalert2';




export default function AccountContent() {
    const { user: authUser } = useAuthState();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'orders'>('profile');
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewOrderItems, setReviewOrderItems] = useState<any[]>([]);
    const [selectedProductIndex, setSelectedProductIndex] = useState(0);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');

    // API Hooks
    const { data: profileData, refetch } = useGetMyProfileQuery(undefined);
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
    const { data: ordersData, isLoading: isLoadingOrders } = useGetMyOrdersQuery(authUser?.id || '');
    const [createReview, { isLoading: isSubmittingReview }] = useCreateReviewMutation();

    const orders = Array.isArray(ordersData?.data?.orders) ? ordersData.data.orders : [];

    // Form State
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Visibility State
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // ... (keep useEffect and handleFileChange)
    useEffect(() => {
        if (profileData?.data) {
            const userData = profileData.data;
            setFullname(userData.fullname || '');
            setEmail(userData.email || '');
            setPhoneNumber(userData.phoneNumber || '');
            setAddress(userData.address || '');
            setPhoto(userData.photo || null);
        }
    }, [profileData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPhoto(URL.createObjectURL(file)); // Preview
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        // ... (keep existing implementation)
        e.preventDefault();

        try {
            const formData = new FormData();

            // Append text data as JSON string in 'data' field
            const textData = {
                fullname,
                phoneNumber,
                address,
                male: 'Male' // Assuming default or add field if needed
            };
            formData.append('data', JSON.stringify(textData));

            // Append file if selected
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const res = await updateProfile(formData).unwrap();

            if (res?.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated',
                    text: res.message || 'Successfully updated profile',
                    background: '#171717',
                    color: '#fff',
                    confirmButtonColor: '#D4A574'
                });
                refetch();
            }
        } catch (error: any) {
            console.error('Update failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error?.data?.message || 'Something went wrong',
                background: '#171717',
                color: '#fff',
                confirmButtonColor: '#D4A574'
            });
        }
    };

    const handleUpdatePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please fill in all password fields',
                background: '#171717',
                color: '#fff',
                confirmButtonColor: '#D4A574'
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'New passwords do not match',
                background: '#171717',
                color: '#fff',
                confirmButtonColor: '#D4A574'
            });
            return;
        }

        try {
            const res = await changePassword({ oldpassword: oldPassword, newpassword: newPassword }).unwrap();
            if (res?.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Updated',
                    text: res.message || 'Successfully updated password',
                    background: '#171717',
                    color: '#fff',
                    confirmButtonColor: '#D4A574'
                });
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error: any) {
            console.error('Password update failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error?.data?.message || 'Something went wrong',
                background: '#171717',
                color: '#fff',
                confirmButtonColor: '#D4A574'
            });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleOpenReviewModal = (orderItems: any[]) => {
        setReviewOrderItems(orderItems);
        setSelectedProductIndex(0);
        setReviewRating(5);
        setReviewComment('');
        setShowReviewModal(true);
    };

    const handleSubmitReview = async () => {
        if (!reviewComment.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Comment Required',
                text: 'Please write a comment for your review',
                background: '#171717',
                color: '#fff',
                confirmButtonColor: '#D4A574'
            });
            return;
        }

        try {
            const selectedProduct = reviewOrderItems[selectedProductIndex];
            const res = await createReview({
                product_id: selectedProduct.productId,
                rating: reviewRating,
                comment: reviewComment
            }).unwrap();

            if (res?.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Review Submitted',
                    text: res.message || 'Thank you for your review!',
                    background: '#171717',
                    color: '#fff',
                    confirmButtonColor: '#D4A574'
                });
                setShowReviewModal(false);
                setReviewComment('');
                setReviewRating(5);
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error?.data?.message || 'Failed to submit review',
                background: '#171717',
                color: '#fff',
                confirmButtonColor: '#D4A574'
            });
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-10 pt-10 px-4 md:px-0">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-200">Account Settings</h1>
                <p className="text-neutral-400 mt-1">Manage your profile, orders, and security preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar - Profile Card & Nav */}
                <div className="lg:col-span-1 space-y-6">
                    {/* User Card */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#D4A574]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative w-28 h-28 mb-4">
                            <div className="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 text-4xl overflow-hidden border-4 border-neutral-800 group-hover:border-[#D4A574]/50 transition-colors shadow-xl relative">
                                {photo ? (
                                    <Image src={photo} alt="Profile" fill className="object-cover" />
                                ) : (
                                    <FiUser />
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-1 right-1 p-2 bg-[#D4A574] text-white rounded-full hover:bg-[#b88b5c] shadow-lg transition-transform hover:scale-105"
                            >
                                <FiCamera className="w-4 h-4" />
                            </button>
                        </div>
                        <h2 className="text-lg font-bold text-neutral-200">{fullname || 'User Name'}</h2>
                        <p className="text-xs text-[#D4A574] uppercase tracking-wider font-medium mt-1">{email || 'user@example.com'}</p>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all ${activeTab === 'profile'
                                ? 'bg-[#D4A574]/10 text-[#D4A574] border-l-4 border-[#D4A574]'
                                : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 border-l-4 border-transparent'
                                }`}
                        >
                            <FiUser className="w-5 h-5" />
                            Profile Details
                        </button>
                        <hr className="border-neutral-800" />
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all ${activeTab === 'orders'
                                ? 'bg-[#D4A574]/10 text-[#D4A574] border-l-4 border-[#D4A574]'
                                : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 border-l-4 border-transparent'
                                }`}
                        >
                            <FiPackage className="w-5 h-5" />
                            My Orders
                        </button>
                        <hr className="border-neutral-800" />
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all ${activeTab === 'security'
                                ? 'bg-[#D4A574]/10 text-[#D4A574] border-l-4 border-[#D4A574]'
                                : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 border-l-4 border-transparent'
                                }`}
                        >
                            <FiShield className="w-5 h-5" />
                            Security & Password
                        </button>
                    </nav>
                </div>

                {/* Right Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl min-h-[500px]">
                        {activeTab === 'profile' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
                                    <h3 className="text-xl font-bold text-neutral-200">Personal Information</h3>
                                    <button
                                        onClick={handleUpdateProfile}
                                        disabled={isUpdating}
                                        className="px-4 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] transition-colors text-sm font-medium shadow-lg shadow-[#D4A574]/20 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isUpdating ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" onSubmit={handleUpdateProfile}>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Full Name</label>
                                        <div className="relative group">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#D4A574] transition-colors"><FiUser /></span>
                                            <input
                                                type="text"
                                                value={fullname}
                                                onChange={(e) => setFullname(e.target.value)}
                                                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574] transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Email Address</label>
                                        <div className="relative group">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#D4A574] transition-colors"><FiMail /></span>
                                            <input
                                                type="email"
                                                value={email}
                                                readOnly
                                                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Phone Number</label>
                                        <div className="relative group">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#D4A574] transition-colors"><FiPhone /></span>
                                            <input
                                                type="text"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574] transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Location</label>
                                        <div className="relative group">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#D4A574] transition-colors"><FiMapPin /></span>
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574] transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 pt-6">
                                        <div className="bg-neutral-950/50 rounded-xl p-4 border border-neutral-800">
                                            <h4 className="text-sm font-semibold text-neutral-300 mb-2">Bio</h4>
                                            <textarea rows={4} className="w-full bg-transparent border-0 text-neutral-400 focus:ring-0 p-0 text-sm resize-none" placeholder="Write a short bio about yourself..." defaultValue="Beauty enthusiast and skincare lover."></textarea>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="border-b border-neutral-800 pb-6">
                                    <h3 className="text-xl font-bold text-neutral-200">Change Password</h3>
                                    <p className="text-sm text-neutral-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
                                </div>

                                <form className="max-w-xl space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Current Password</label>
                                        <div className="relative group">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#D4A574] transition-colors"><FiLock /></span>
                                            <input
                                                type={showOldPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574] transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowOldPassword(!showOldPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                                            >
                                                {showOldPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">New Password</label>
                                        <div className="relative group">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#D4A574] transition-colors"><FiLock /></span>
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574] transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                                            >
                                                {showNewPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Confirm New Password</label>
                                        <div className="relative group">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#D4A574] transition-colors"><FiLock /></span>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574] transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                                            >
                                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-neutral-500 mt-2">Make sure it's at least 6 characters</p>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="button"
                                            onClick={handleUpdatePassword}
                                            disabled={isChangingPassword}
                                            className="px-6 py-3 bg-[#D4A574] text-white rounded-xl hover:bg-[#b88b5c] transition-colors font-medium shadow-lg shadow-[#D4A574]/20 w-full sm:w-auto disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isChangingPassword ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="border-b border-neutral-800 pb-6">
                                    <h3 className="text-xl font-bold text-neutral-200">My Orders</h3>
                                    <p className="text-sm text-neutral-500 mt-1">View and track your recent orders.</p>
                                </div>

                                {isLoadingOrders ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D4A574]"></div>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl">
                                        <FiBox className="mx-auto h-10 w-10 text-neutral-600 mb-3" />
                                        <h3 className="text-lg font-medium text-neutral-300">No orders found</h3>
                                        <p className="text-neutral-500 mt-1">You haven't placed any orders yet.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto pb-2">
                                        <table className="w-full text-left border-collapse min-w-[600px]">
                                            <thead>
                                                <tr className="border-b border-neutral-800 text-xs text-neutral-500 uppercase tracking-wider">
                                                    <th className="py-4 px-4 font-semibold whitespace-nowrap">Order ID</th>
                                                    <th className="py-4 px-4 font-semibold whitespace-nowrap">Date</th>
                                                    <th className="py-4 px-4 font-semibold whitespace-nowrap">Status</th>
                                                    <th className="py-4 px-4 font-semibold whitespace-nowrap">Total</th>
                                                    <th className="py-4 px-4 font-semibold whitespace-nowrap">Items</th>
                                                    <th className="py-4 px-4 font-semibold text-right whitespace-nowrap">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-neutral-300">
                                                {orders.map((order: any) => (
                                                    <tr key={order._id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                                                        <td className="py-4 px-4 font-medium text-white whitespace-nowrap">
                                                            #{order._id?.slice(-8).toUpperCase()}
                                                        </td>
                                                        <td className="py-4 px-4 text-neutral-400 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <FiCalendar className="w-3 h-3" />
                                                                {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'confirmed' ? 'bg-green-900/30 text-green-400 border-green-800' :
                                                                order.status?.toLowerCase() === 'processing' || order.status?.toLowerCase() === 'pending' ? 'bg-blue-900/30 text-blue-400 border-blue-800' :
                                                                    order.status?.toLowerCase() === 'shipped' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' :
                                                                        'bg-red-900/30 text-red-400 border-red-800'
                                                                }`}>
                                                                {order.status || 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 font-medium text-[#D4A574] whitespace-nowrap">
                                                            ${order.totalAmount?.toFixed(2) || '0.00'}
                                                        </td>
                                                        <td className="py-4 px-4 text-neutral-400 max-w-xs truncate">
                                                            {order.items?.length || 0} items
                                                        </td>
                                                        <td className="py-4 px-4 text-right whitespace-nowrap">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => setSelectedOrder(order)}
                                                                    className="text-sm text-neutral-400 hover:text-white transition-colors underline"
                                                                >
                                                                    View Details
                                                                </button>
                                                                {order.status?.toLowerCase() === 'delivered' && order.items?.length > 0 && (
                                                                    <button
                                                                        onClick={() => handleOpenReviewModal(order.items)}
                                                                        className="px-3 py-1.5 bg-[#D4A574] text-white text-xs rounded-lg hover:bg-[#b88b5c] transition-colors flex items-center gap-1.5"
                                                                    >
                                                                        <FiStar className="w-3 h-3" />
                                                                        Review
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1e1e1e] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in relative">
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white bg-neutral-800/50 hover:bg-neutral-800 rounded-full transition-colors print:hidden"
                        >
                            <FiX className="w-5 h-5" />
                        </button>

                        <div className="p-8 print:p-0">
                            {/* Invoice Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-neutral-800 pb-6 print:border-black">
                                <div>
                                    <h2 className="text-2xl font-bold text-white print:text-black">Order Invoice</h2>
                                    <p className="text-neutral-400 mt-1 print:text-gray-600">{selectedOrder.id}</p>
                                </div>
                                <div className="mt-4 md:mt-0 text-right">
                                    <p className="text-[#D4A574] font-bold text-lg print:text-black">{selectedOrder.total}</p>
                                    <p className="text-sm text-neutral-400 print:text-gray-600">{selectedOrder.date}</p>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800 print:border-gray-300 print:bg-transparent">
                                        <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide mb-3 print:text-black">Customer Details</h4>
                                        <div className="space-y-1 text-sm text-neutral-400 print:text-gray-800">
                                            <p className="text-white font-medium print:text-black">{profileData?.data?.fullname || 'User Name'}</p>
                                            <p>{email || 'user@example.com'}</p>
                                            <p>{phoneNumber || ''}</p>
                                        </div>
                                    </div>
                                    <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800 print:border-gray-300 print:bg-transparent">
                                        <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide mb-3 print:text-black">Shipping Address</h4>
                                        <div className="space-y-1 text-sm text-neutral-400 print:text-gray-800">
                                            <p>{address || '123 Beauty Lane, New York, NY'}</p>
                                            <p>United States</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide mb-3 print:text-black">Order Items</h4>
                                    <div className="border border-neutral-800 rounded-xl overflow-hidden print:border-gray-300">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-neutral-900 print:bg-gray-100">
                                                <tr>
                                                    <th className="py-3 px-4 font-semibold text-white print:text-black">Item</th>
                                                    <th className="py-3 px-4 font-semibold text-right text-white print:text-black">Qty</th>
                                                    <th className="py-3 px-4 font-semibold text-right text-white print:text-black">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-800 print:divide-gray-300">
                                                {selectedOrder.items?.map((item: any, index: number) => (
                                                    <tr key={index} className="text-neutral-300 print:text-gray-800">
                                                        <td className="py-3 px-4">{item.name || item}</td>
                                                        <td className="py-3 px-4 text-right">{item.quantity || 1}</td>
                                                        <td className="py-3 px-4 text-right">${item.price?.toFixed(2) || 'N/A'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-800 print:hidden">
                                <button
                                    onClick={handlePrint}
                                    className="flex-1 px-4 py-3 bg-[#D4A574] text-white rounded-xl hover:bg-[#b88b5c] transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <FiPrinter className="w-5 h-5" />
                                    Print Invoice
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1e1e1e] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in relative">
                        <button
                            onClick={() => setShowReviewModal(false)}
                            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white bg-neutral-800/50 hover:bg-neutral-800 rounded-full transition-colors"
                        >
                            <FiX className="w-5 h-5" />
                        </button>

                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Write a Review</h2>
                            <p className="text-neutral-400 text-sm mb-6">Share your experience with this product</p>

                            {/* Product Selection */}
                            {reviewOrderItems.length > 1 ? (
                                <div className="mb-6">
                                    <label className="text-sm font-semibold text-neutral-300 mb-3 block">Select Product to Review</label>
                                    <select
                                        value={selectedProductIndex}
                                        onChange={(e) => {
                                            setSelectedProductIndex(Number(e.target.value));
                                            setReviewRating(5);
                                            setReviewComment('');
                                        }}
                                        className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574] transition-all"
                                    >
                                        {reviewOrderItems.map((item, index) => (
                                            <option key={index} value={index}>
                                                {item.name} - ${item.price.toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : null}

                            {/* Product Info */}
                            <div className="mb-6 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
                                <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Reviewing Product</p>
                                <h3 className="text-lg font-semibold text-white">{reviewOrderItems[selectedProductIndex]?.name}</h3>
                                <p className="text-sm text-[#D4A574] mt-1">${reviewOrderItems[selectedProductIndex]?.price.toFixed(2)}</p>
                            </div>

                            {/* Star Rating */}
                            <div className="mb-6">
                                <label className="text-sm font-semibold text-neutral-300 mb-3 block">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <FiStar
                                                className={`w-8 h-8 ${star <= reviewRating
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-600'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-neutral-500 mt-2">
                                    {reviewRating === 5 ? 'Excellent!' :
                                        reviewRating === 4 ? 'Good' :
                                            reviewRating === 3 ? 'Average' :
                                                reviewRating === 2 ? 'Below Average' : 'Poor'}
                                </p>
                            </div>

                            {/* Comment */}
                            <div className="mb-6">
                                <label className="text-sm font-semibold text-neutral-300 mb-3 block">Your Review</label>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Tell us about your experience with this product..."
                                    rows={5}
                                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574] transition-all resize-none"
                                />
                                <p className="text-xs text-neutral-500 mt-2">
                                    {reviewComment.length} characters
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="flex-1 px-4 py-3 bg-neutral-800 text-neutral-300 rounded-xl hover:bg-neutral-700 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={isSubmittingReview}
                                    className="flex-1 px-4 py-3 bg-[#D4A574] text-white rounded-xl hover:bg-[#b88b5c] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmittingReview ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Review'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
