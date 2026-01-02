'use client';

import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function ChangePasswordPage() {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // API logic here
        Swal.fire({
            title: 'Success!',
            text: 'Password changed successfully!',
            icon: 'success',
            confirmButtonColor: '#D4A574',
        });
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4A574]">
                    <FiLock className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-neutral-200">Change Password</h1>
                <p className="text-neutral-400 mt-2">Update your account security</p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Current Password</label>
                        <div className="relative">
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-[#D4A574]"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                            >
                                {showCurrent ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showNew ? 'text' : 'password'}
                                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-[#D4A574]"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                            >
                                {showNew ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-[#D4A574]"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                            >
                                {showConfirm ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] transition-colors font-medium">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}
