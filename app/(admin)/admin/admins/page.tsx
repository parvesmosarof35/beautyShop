'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiSearch, FiFilter, FiMoreVertical, FiShield, FiPlus, FiTrash2, FiX, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { useGetAllAdminsQuery, useCreateAdminMutation, useDeleteAdminMutation } from '@/app/store/api/adminApi';
import { useGetMyProfileQuery } from '@/app/store/api/authApi';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const AdminsPage = () => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Auth & API Hooks
    const { data: myProfile, isLoading: isProfileLoading } = useGetMyProfileQuery(undefined);
    const userRole = myProfile?.data?.role;

    const { data: adminsData, isLoading, refetch } = useGetAllAdminsQuery({ page, limit: 10 });
    const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
    const [deleteAdmin] = useDeleteAdminMutation();

    // Protect Route
    useEffect(() => {
        if (!isProfileLoading && userRole !== 'superAdmin') {
            router.push('/admin/dashboard');
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'Only Super Admins can access this page.',
                 background: '#171717',
                color: '#fff',
                confirmButtonColor: '#D4A574'
            });
        }
    }, [userRole, isProfileLoading, router]);

    // Form State - Role is strictly 'admin'
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        role: 'admin', 
        isVerify: true
    });

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Ensure strictly creating 'admin' only
            const payload = { ...formData, role: 'admin' };
            
            const res = await createAdmin(payload).unwrap();
            if (res?.success || res?.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'Admin Created',
                    text: 'Successfully created new admin account',
                    background: '#171717',
                    color: '#fff',
                    confirmButtonColor: '#D4A574'
                });
                setIsModalOpen(false);
                setFormData({ fullname: '', email: '', password: '', role: 'admin', isVerify: true });
                refetch();
            }
        } catch (error: any) {
             console.error('Create admin error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Creation Failed',
                text: error?.data?.message || 'Something went wrong',
                background: '#171717',
                color: '#fff',
                confirmButtonColor: '#D4A574'
            });
        }
    };

    const handleDeleteAdmin = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#D4A574',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            background: '#171717',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await deleteAdmin(id).unwrap();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Admin account has been deleted.',
                    icon: 'success',
                    background: '#171717',
                    color: '#fff',
                    confirmButtonColor: '#D4A574'
                });
                refetch();
            } catch (error: any) {
                Swal.fire({
                    title: 'Error!',
                    text: error?.data?.message || 'Failed to delete admin.',
                    icon: 'error',
                    background: '#171717',
                    color: '#fff',
                    confirmButtonColor: '#D4A574'
                });
            }
        }
    };

    const allAdmins = adminsData?.data?.all_admin || [];
    const meta = adminsData?.data?.meta;

    if (isProfileLoading || (userRole !== 'superAdmin' && !adminsData)) {
        return <div className="text-white p-6">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-200">Admins & Superadmin</h1>
                    <p className="text-neutral-400">Manage administrative access</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] flex items-center gap-2 transition-colors shadow-lg shadow-[#D4A574]/20"
                >
                    <FiPlus /> Add Admin
                </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
                {/* Search Bar */}
                <div className="p-4 border-b border-neutral-800 bg-neutral-900">
                    <div className="relative max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search admins..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#D4A574] transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-950 text-neutral-400 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Admin</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                                        Loading admins...
                                    </td>
                                </tr>
                            ) : allAdmins.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                                        No admins found.
                                    </td>
                                </tr>
                            ) : (
                                allAdmins.map((admin: any) => (
                                    <tr key={admin._id} className="hover:bg-neutral-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-[#D4A574] overflow-hidden border border-neutral-700 relative">
                                                    {admin.photo ? (
                                                        <Image src={admin.photo} alt={admin.fullname} fill className="object-cover" />
                                                    ) : (
                                                        <FiShield className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-neutral-200">{admin.fullname || 'Admin User'}</p>
                                                    <p className="text-xs text-neutral-500">{admin.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                admin.role === 'superAdmin' 
                                                    ? 'bg-[#D4A574]/20 text-[#D4A574]' 
                                                    : 'bg-blue-500/10 text-blue-400'
                                            }`}>
                                                {admin.role === 'superAdmin' ? 'Super Admin' : 'Admin'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-400">
                                            {admin.phoneNumber || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {/* Only show delete button if NOT Super Admin */}
                                            {admin.role !== 'superAdmin' && (
                                                <button 
                                                    onClick={() => handleDeleteAdmin(admin._id)}
                                                    className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete Admin"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {meta && meta.totalPage > 1 && (
                    <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-end gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-3 py-1 text-sm bg-neutral-800 text-neutral-400 rounded hover:bg-neutral-700 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-neutral-500">Page {page} of {meta.totalPage}</span>
                        <button
                            disabled={page === meta.totalPage}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3 py-1 text-sm bg-neutral-800 text-neutral-400 rounded hover:bg-neutral-700 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Create Admin Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-300 transition-colors"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                        
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-neutral-200">Add New Admin</h2>
                            <p className="text-sm text-neutral-500 mt-1">Create a new administrative account</p>
                        </div>

                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-neutral-500 uppercase">Full Name</label>
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullname}
                                        onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                                        className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#D4A574]"
                                        placeholder="Enter full name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-neutral-500 uppercase">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#D4A574]"
                                        placeholder="admin@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-neutral-500 uppercase">Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#D4A574]"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {/* Role selection is HIDDEN and defaults to 'admin' logic-side */}
                             <div className="space-y-1.5">
                                <label className="text-xs font-medium text-neutral-500 uppercase">Role</label>
                                <div className="w-full bg-neutral-950 border border-neutral-800 text-neutral-500 rounded-xl px-4 py-3 cursor-not-allowed">
                                    Admin (Standard)
                                </div>
                                <p className="text-[10px] text-neutral-600">Only standard admins can be created.</p>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="w-full py-3 bg-[#D4A574] text-white rounded-xl hover:bg-[#b88b5c] font-medium shadow-lg shadow-[#D4A574]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isCreating ? 'Creating...' : 'Create Admin Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminsPage;
