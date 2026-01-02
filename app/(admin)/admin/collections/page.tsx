'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { FiSearch, FiPlus, FiTrash2, FiEdit2, FiChevronLeft, FiChevronRight, FiImage, FiX, FiLoader } from 'react-icons/fi';
import Swal from 'sweetalert2';
import {
    useGetAllCollectionsQuery,
    useCreateCollectionMutation,
    useUpdateCollectionMutation,
    useDeleteCollectionMutation,
} from '@/app/store/api/collectionApi';

interface Collection {
    _id: string;
    name: string;
    slug: string;
    image_url: string;
    productCount?: number;
}

const CollectionsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // API hooks
    const { data: collectionsData, isLoading, error } = useGetAllCollectionsQuery({
        page: currentPage,
        limit: itemsPerPage,
    });

    const [createCollection, { isLoading: isCreating }] = useCreateCollectionMutation();
    const [updateCollection, { isLoading: isUpdating }] = useUpdateCollectionMutation();
    const [deleteCollection, { isLoading: isDeleting }] = useDeleteCollectionMutation();

    // Extract collections from API response
    const collections = collectionsData?.data || [];
    const totalItems = collectionsData?.meta?.total || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Search Filter (client-side)
    const filteredCollections = collections.filter((collection: Collection) =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#D4A574',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            background: '#171717',
            color: '#e5e5e5',
        });

        if (result.isConfirmed) {
            try {
                await deleteCollection(id).unwrap();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Collection has been deleted successfully.',
                    icon: 'success',
                    confirmButtonColor: '#D4A574',
                    background: '#171717',
                    color: '#e5e5e5',
                });
            } catch (err) {
                console.error('Failed to delete collection:', err);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete collection. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#D4A574',
                    background: '#171717',
                    color: '#e5e5e5',
                });
            }
        }
    };

    const handleOpenModal = (collection: Collection | null = null) => {
        if (collection) {
            setEditingCollection(collection);
            setFormData({ name: collection.name, slug: collection.slug });
            setImagePreview(collection.image_url);
        } else {
            setEditingCollection(null);
            setFormData({ name: '', slug: '' });
            setImagePreview('');
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCollection(null);
        setFormData({ name: '', slug: '' });
        setImagePreview('');
        setImageFile(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('slug', formData.slug);

        if (imageFile) {
            formDataToSend.append('file', imageFile);
        }

        try {
            if (editingCollection) {
                // Update
                await updateCollection({
                    id: editingCollection._id,
                    formData: formDataToSend,
                }).unwrap();

                Swal.fire({
                    title: 'Updated!',
                    text: 'Collection has been updated successfully.',
                    icon: 'success',
                    confirmButtonColor: '#D4A574',
                    background: '#171717',
                    color: '#e5e5e5',
                    timer: 2000,
                });
            } else {
                // Create
                await createCollection(formDataToSend).unwrap();

                Swal.fire({
                    title: 'Created!',
                    text: 'Collection has been created successfully.',
                    icon: 'success',
                    confirmButtonColor: '#D4A574',
                    background: '#171717',
                    color: '#e5e5e5',
                    timer: 2000,
                });
            }
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save collection:', err);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to save collection. Please try again.',
                icon: 'error',
                confirmButtonColor: '#D4A574',
                background: '#171717',
                color: '#e5e5e5',
            });
        }
    };

    const handlePageChange = (pageFn: (prev: number) => number) => {
        setCurrentPage(prev => {
            const newPage = pageFn(prev);
            if (newPage < 1 || newPage > totalPages) return prev;
            return newPage;
        });
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-200">Collections</h1>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] flex items-center gap-2 transition-colors"
                >
                    <FiPlus className="w-4 h-4" /> Add Collection
                </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
                {/* Toolbar */}
                <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row gap-4 justify-between bg-neutral-900">
                    <div className="relative max-w-md w-full">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search collections..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#D4A574]"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <FiLoader className="w-8 h-8 text-[#D4A574] animate-spin" />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="p-6 text-center text-red-400">
                        Failed to load collections. Please try again.
                    </div>
                )}

                {/* Table */}
                {!isLoading && !error && (
                    <>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left">
                                <thead className="bg-neutral-950 text-neutral-400 text-xs uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Image</th>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Items</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800">
                                    {filteredCollections.map((collection: Collection) => (
                                        <tr key={collection._id} className="hover:bg-neutral-800/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="w-16 h-16 rounded-lg bg-neutral-800 flex-shrink-0 relative overflow-hidden border border-neutral-700">
                                                    <Image
                                                        src={collection.image_url || '/images/collection2.webp'}
                                                        alt={collection.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-neutral-200">{collection.name}</p>
                                                <p className="text-xs text-neutral-500">ID: #{collection._id.slice(-6)}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-400">
                                                {collection.productCount || 0} products
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(collection)}
                                                        className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                                                    >
                                                        <FiEdit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(collection._id)}
                                                        disabled={isDeleting}
                                                        className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredCollections.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                                                No collections found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-neutral-800 bg-neutral-900 flex justify-between items-center">
                            <p className="text-sm text-neutral-500">
                                Showing <span className="font-medium text-neutral-200">{collections.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span> to <span className="font-medium text-neutral-200">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-medium text-neutral-200">{totalItems}</span> results
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(p => p - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handlePageChange(p => p + 1)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg shadow-2xl animate-fade-in-up">
                        <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-neutral-200">
                                {editingCollection ? 'Edit Collection' : 'Add Collection'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-neutral-400 hover:text-white transition-colors">
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-neutral-300">Collection Image</label>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-24 h-24 rounded-lg bg-neutral-800 border-2 border-dashed border-neutral-700 flex items-center justify-center overflow-hidden relative cursor-pointer hover:border-neutral-500 transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {imagePreview ? (
                                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                        ) : (
                                            <FiImage className="w-8 h-8 text-neutral-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-sm px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors"
                                        >
                                            Upload Image
                                        </button>
                                        <p className="text-xs text-neutral-500 mt-2">Recommended size: 500x500px. JPG, PNG.</p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-neutral-300">Collection Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g. Summer Essentials"
                                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D4A574] transition-colors"
                                />
                            </div>

                            {/* Slug Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-neutral-300">Collection Slug</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                    placeholder="e.g. summer-essentials"
                                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D4A574] transition-colors"
                                />
                                <p className="text-xs text-neutral-500">URL-friendly identifier (lowercase, hyphens only)</p>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-neutral-400 hover:text-neutral-200 transition-colors"
                                    disabled={isCreating || isUpdating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="px-6 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {(isCreating || isUpdating) && <FiLoader className="w-4 h-4 animate-spin" />}
                                    {editingCollection ? 'Save Changes' : 'Create Collection'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectionsPage;
