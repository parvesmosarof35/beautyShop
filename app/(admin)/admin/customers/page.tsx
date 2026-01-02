'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiSearch, FiCheckCircle, FiChevronLeft, FiChevronRight, FiSlash, FiTrash2, FiInfo } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useGetAllUserQuery, useChangeStatusMutation, useDeleteUserMutation } from '../../../store/api/userApi';

const CustomersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const limit = 8;

    // Debounce search term
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Fetch users
    const { data: userData, isLoading, refetch } = useGetAllUserQuery({
        searchTerm: debouncedSearchTerm,
        page,
        limit
    });

    const [changeStatus] = useChangeStatusMutation();
    const [deleteUser] = useDeleteUserMutation();

    const customers = userData?.data?.all_users || [];
    const meta = userData?.data?.meta;

    const toggleBlockStatus = (id: string, currentStatus: string) => {
        const isBlocked = currentStatus === 'blocked';
        const action = isBlocked ? 'Unblock' : 'Block';
        // Payload: true for active (isProgress), false for blocked
        const newStatus = isBlocked ? true : false;

        Swal.fire({
            title: `${action} User?`,
            text: `Are you sure you want to ${action.toLowerCase()} this user?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: isBlocked ? '#10B981' : '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Yes, ${action} user!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await changeStatus({ id, status: newStatus }).unwrap();
                    Swal.fire({
                        title: isBlocked ? 'Unblocked!' : 'Blocked!',
                        text: `User has been ${isBlocked ? 'activated' : 'blocked'}.`,
                        icon: 'success',
                        confirmButtonColor: '#D4A574'
                    });
                    refetch();
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to update user status.',
                        icon: 'error',
                        confirmButtonColor: '#D4A574'
                    });
                }
            }
        });
    };
    
    const handleDelete = (id: string) => {
        Swal.fire({
            title: 'Delete User?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteUser(id).unwrap();
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'User has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#D4A574'
                    });
                    refetch();
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete user.',
                        icon: 'error',
                        confirmButtonColor: '#D4A574'
                    });
                }
            }
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-200">User</h1>
                    <p className="text-neutral-400">Manage your user base</p>
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
                {/* Toolbar */}
                <div className="p-4 border-b border-neutral-800 bg-neutral-900">
                    <div className="max-w-md relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search customers by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#D4A574]"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    {isLoading ? (
                         <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A574]"></div>
                        </div>
                    ) : (
                    <table className="w-full text-left">
                        <thead className="bg-neutral-950 text-neutral-400 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Phone</th>
                            
                                <th className="px-6 py-4">Verified</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {customers.map((customer: any) => (
                                <tr key={customer._id} className="hover:bg-neutral-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {customer.photo ? (
                                                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-neutral-700">
                                                    <Image src={customer.photo} alt={customer.fullname} fill className="object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-[#D4A574] font-bold text-sm border border-neutral-700">
                                                    {customer.fullname?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-neutral-200">{customer.fullname}</p>
                                                <p className="text-xs text-neutral-500">{customer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.role === 'admin'
                                                ? 'bg-purple-900/30 text-purple-400'
                                                : customer.role === 'superAdmin'
                                                ? 'bg-amber-900/30 text-amber-400'
                                                : 'bg-blue-900/30 text-blue-400'
                                            }`}>
                                            {customer.role === 'superAdmin' ? 'Super Admin' : customer.role === 'admin' ? 'Admin' : 'User'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-400">
                                        {customer.phoneNumber || 'N/A'}
                                    </td>
                                    
                                     <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.isVerify
                                                ? 'bg-green-900/30 text-green-400'
                                                : 'bg-yellow-900/30 text-yellow-400'
                                            }`}>
                                            {customer.isVerify ? 'Verified' : 'Unverified'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-400">
                                        {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        {customer.role === 'superAdmin' ? (
                                            <button
                                                onClick={() => Swal.fire({
                                                    title: 'Super Admin',
                                                    text: 'This user has full access and cannot be modified or deleted.',
                                                    icon: 'info',
                                                    confirmButtonColor: '#D4A574'
                                                })}
                                                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors group/btn"
                                                title="View Info"
                                            >
                                                <FiInfo className="w-4 h-4 text-blue-400" />
                                            </button>
                                        ) : (
                                            <>
                                               
                                                <button
                                                    onClick={() => handleDelete(customer._id)}
                                                    className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors group/btn"
                                                    title="Delete User"
                                                >
                                                    <FiTrash2 className="w-4 h-4 group-hover/btn:text-red-500" />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    )}
                </div>

                {/* Pagination */}
                {meta && meta.totalPage > 1 && (
                <div className="p-4 border-t border-neutral-800 bg-neutral-900 flex justify-between items-center">
                    <p className="text-sm text-neutral-500">
                        Showing page <span className="font-medium text-neutral-200">{page}</span> of <span className="font-medium text-neutral-200">{meta.totalPage}</span>
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(meta.totalPage, p + 1))}
                            disabled={page === meta.totalPage}
                            className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default CustomersPage;
