'use client';

import React, { useState } from 'react';
import { FiSearch, FiTrash2, FiMail, FiMessageSquare } from 'react-icons/fi';
import { useGetAllContactQuery, useDeleteContactMutation } from '@/app/store/api/contactApi';
import Swal from 'sweetalert2';

export default function Contact() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    
    // API Hooks
    // Note: The API expects 'searchTerm', 'page', and 'limit'
    const { data: contactData, isLoading, refetch } = useGetAllContactQuery({ 
        searchTerm: searchTerm, 
        page, 
        limit: 10 
    });
    const [deleteContact] = useDeleteContactMutation();

    const handleDelete = async (id: string) => {
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
                await deleteContact(id).unwrap();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Contact message has been deleted.',
                    icon: 'success',
                    background: '#171717',
                    color: '#fff',
                    confirmButtonColor: '#D4A574'
                });
                refetch();
            } catch (error: any) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete contact message.',
                    icon: 'error',
                    background: '#171717',
                    color: '#fff',
                    confirmButtonColor: '#D4A574'
                });
            }
        }
    };

    const allContacts = contactData?.data?.allContactList || [];
    const meta = contactData?.data?.meta;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-200">Contact Messages</h1>
                    <p className="text-neutral-400">Manage inquiries from users</p>
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
                {/* Search Bar */}
                <div className="p-4 border-b border-neutral-800 bg-neutral-900">
                    <div className="relative max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#D4A574] transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-950 text-neutral-400 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Message</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                                        Loading messages...
                                    </td>
                                </tr>
                            ) : allContacts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                                        No messages found.
                                    </td>
                                </tr>
                            ) : (
                                allContacts.map((contact: any) => (
                                    <tr key={contact._id} className="hover:bg-neutral-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-[#D4A574] border border-neutral-700">
                                                     <span className="text-lg font-bold">{contact.name?.charAt(0).toUpperCase() || 'U'}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-neutral-200">{contact.name || 'Unknown User'}</p>
                                                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                                                        <FiMail className="w-3 h-3" />
                                                        {contact.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2 max-w-md">
                                                <FiMessageSquare className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm text-neutral-300 line-clamp-2" title={contact.question}>
                                                    {contact.question}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-400 whitespace-nowrap">
                                            {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : '-'}
                                            <br />
                                            <span className="text-xs text-neutral-600">
                                                {contact.createdAt ? new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(contact._id)}
                                                className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete Message"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
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
        </div>
    );
}
