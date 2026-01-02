'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiLock, FiShield, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuthState } from '@/app/store/hooks';
import { useGetMyProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from '@/app/store/api/authApi';
import Swal from 'sweetalert2';

export default function ProfilePage() {
    const { user: authUser } = useAuthState();
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

    // API Hooks
    const { data: profileData, refetch } = useGetMyProfileQuery(undefined);
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

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

    // ... (keep useEffect for profile data)
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
        e.preventDefault();
        
        try {
            const formData = new FormData();
            
            // Append text data as JSON string in 'data' field
            const textData = {
                fullname,
                phoneNumber,
                address,
                male: 'Male' // Assuming default
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

    return (
        <div className="max-w-5xl mx-auto pb-10">
            {/* ... (keep header and sidebar) */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-200">Account Settings</h1>
                <p className="text-neutral-400 mt-1">Manage your profile and security preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar - Profile Card & Nav */}
                <div className="lg:col-span-1 space-y-6">
                    {/* User Card */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#D4A574]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative w-28 h-28 mb-4">
                            <div className="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 text-4xl overflow-hidden border-4 border-neutral-800 group-hover:border-[#D4A574]/50 transition-colors shadow-xl">
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
                        <h2 className="text-lg font-bold text-neutral-200">{fullname || 'Admin User'}</h2>
                        <p className="text-xs text-[#D4A574] uppercase tracking-wider font-medium mt-1">{email === 'admin@example.com' ? 'Super Admin' : 'Administrator'}</p>
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
                        {activeTab === 'profile' ? (
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
                                            <textarea rows={4} className="w-full bg-transparent border-0 text-neutral-400 focus:ring-0 p-0 text-sm resize-none" placeholder="Write a short bio about yourself..." defaultValue="Experienced administrator managing the platform since 2024."></textarea>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        ) : (
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
                    </div>
                </div>
            </div>
        </div>
    );
}
