'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiPlus, FiTrash2, FiEdit2, FiChevronLeft, FiChevronRight, FiX, FiLoader, FiUpload } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { revalidateFeaturedProducts, revalidateProducts } from '@/app/actions/revalidate';
import {
    useGetAllProductsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
} from '@/app/store/api/productApi';

interface Product {
    _id: string;
    name: string;
    description: string;
    categories: string[] | string; // API returns array, simplified for compatibility
    price: number;
    stock_quantity: number;
    images_urls: string[];
    sku: string;
    isFeatured: boolean;
    skintype?: string;
    ingredients?: string[];
}

const ProductsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [searchTerm, setSearchTerm] = useState('');

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]); // For NEW images only

    // API hooks
    const { data: productsData, isLoading, error } = useGetAllProductsQuery({
        page: currentPage,
        limit: itemsPerPage,
    });

    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    // Extract products from API response
    const products: Product[] = productsData?.data || [];
    const totalItems = productsData?.meta?.total || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Search Filter (client-side)
    const filteredProducts = products.filter((product: Product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                await deleteProduct(id).unwrap();
                await revalidateFeaturedProducts();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Product has been deleted successfully.',
                    icon: 'success',
                    confirmButtonColor: '#D4A574',
                    background: '#171717',
                    color: '#e5e5e5',
                });
            } catch (err) {
                console.error('Failed to delete product:', err);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete product. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#D4A574',
                    background: '#171717',
                    color: '#e5e5e5',
                });
            }
        }
    };


    const handlePageChange = (pageFn: (prev: number) => number) => {
        setCurrentPage(prev => {
            const newPage = pageFn(prev);
            if (newPage < 1 || newPage > totalPages) return prev;
            return newPage;
        });
    };

    const openEditModal = (product: Product) => {
        setEditingProduct({ ...product });
        // We don't load existing images into 'imagePreviews' because those are for NEW files.
        // We will render existing images from editingProduct.images_urls
        setImagePreviews([]);
        setSelectedImageFiles([]);
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setEditingProduct((prev) => {
             if (!prev) return null;
             return {
                ...prev,
                [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' ? parseFloat(value) : value)
             };
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const currentTotal = (editingProduct?.images_urls?.length || 0) + selectedImageFiles.length + newFiles.length;
            
            if (currentTotal > 8) {
                Swal.fire({
                    icon: 'error',
                    title: 'Limit Exceeded',
                    text: 'You can only have a maximum of 8 images per product.',
                    background: '#171717',
                    color: '#e5e5e5',
                    confirmButtonColor: '#D4A574',
                });
                return;
            }

            setSelectedImageFiles(prev => [...prev, ...newFiles]);

            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeNewImage = (index: number) => {
        setSelectedImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct || !editingProduct._id) return;

        const formData = new FormData();
        formData.append('name', editingProduct.name || '');
        formData.append('description', editingProduct.description || '');
        formData.append('price', editingProduct.price?.toString() || '0');
        formData.append('stock_quantity', editingProduct.stock_quantity?.toString() || '0');
        formData.append('sku', editingProduct.sku || '');
        formData.append('isFeatured', String(editingProduct.isFeatured || false));
        
        if (Array.isArray(editingProduct.categories)) {
             editingProduct.categories.forEach(cat => formData.append('categories[]', cat));
        } else if (editingProduct.categories) {
             formData.append('categories', editingProduct.categories);
        }

        // Append all selected files
        selectedImageFiles.forEach((file) => {
            formData.append('images', file);
        });

        try {
            await updateProduct({
                id: editingProduct._id,
                formData: formData,
            }).unwrap();

            await Promise.all([
                revalidateFeaturedProducts(),
                revalidateProducts()
            ]);

            setIsEditModalOpen(false);
            Swal.fire({
                title: 'Updated!',
                text: 'Product has been updated successfully.',
                icon: 'success',
                confirmButtonColor: '#D4A574',
                background: '#171717',
                color: '#e5e5e5',
                timer: 2000,
            });
        } catch (err) {
            console.error('Failed to update product:', err);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update product. Please try again.',
                icon: 'error',
                confirmButtonColor: '#D4A574',
                background: '#171717',
                color: '#e5e5e5',
            });
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-200">Products</h1>
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
                {/* Toolbar */}
                <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row gap-4 justify-between bg-neutral-900">
                    <div className="relative max-w-md w-full">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#D4A574]"
                        />
                    </div>
                    <Link href="/admin/products/new" className="px-4 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] flex items-center gap-2 transition-colors">
                        <FiPlus className="w-4 h-4" /> Add Product
                    </Link>
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
                        Failed to load products. Please try again.
                    </div>
                )}

                {/* Table */}
                {!isLoading && !error && (
                    <>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left">
                                <thead className="bg-neutral-950 text-neutral-400 text-xs uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Stock</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800">
                                    {filteredProducts.map((product: Product) => (
                                        <tr key={product._id} className="hover:bg-neutral-800/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-neutral-800 flex-shrink-0 relative overflow-hidden">
                                                        {product.images_urls?.[0] ? (
                                                            <Image src={product.images_urls[0]} alt={product.name} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-xs text-neutral-500">Img</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-neutral-200">{product.name}</p>
                                                        <p className="text-xs text-neutral-500">ID: #{product._id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-400">
                                                {Array.isArray(product.categories) ? product.categories.join(', ') : product.categories}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-neutral-200 font-inter">${product.price}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    product.stock_quantity > 0 
                                                    ? 'bg-green-900/30 text-green-400' 
                                                    : 'bg-red-900/30 text-red-400'
                                                }`}>
                                                    {product.stock_quantity} in stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    product.isFeatured 
                                                    ? 'bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30' 
                                                    : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                                                }`}>
                                                    {product.isFeatured ? 'Featured' : 'Standard'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(product)}
                                                        className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                                                    >
                                                        <FiEdit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        disabled={isDeleting}
                                                        className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                                                No products found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-neutral-800 bg-neutral-900 flex justify-between items-center">
                            <p className="text-sm text-neutral-500">
                                Showing <span className="font-medium text-neutral-200">{products.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span> to <span className="font-medium text-neutral-200">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-medium text-neutral-200">{totalItems}</span> results
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

            {/* Edit Modal */}
            {isEditModalOpen && editingProduct && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-neutral-800 flex justify-between items-center sticky top-0 bg-neutral-900 z-10">
                            <h2 className="text-xl font-bold text-neutral-200">Edit Product</h2>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-neutral-400 hover:text-white transition-colors"
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-2">Product Images (Max 8)</label>
                                
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    {/* Existing Images */}
                                    {editingProduct.images_urls?.map((url, idx) => (
                                        <div key={`existing-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-800 group">
                                            <Image src={url} alt={`Existing ${idx}`} fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                               <span className="text-xs text-white">Existing</span>
                                               {/* Optional delete button if API supported it */}
                                            </div>
                                        </div>
                                    ))}

                                    {/* New Images */}
                                    {imagePreviews.map((url, idx) => (
                                        <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-700 group">
                                            <Image src={url} alt={`New ${idx}`} fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FiX size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Button */}
                                    {((editingProduct.images_urls?.length || 0) + selectedImageFiles.length) < 8 && (
                                        <label className="aspect-square rounded-lg border-2 border-dashed border-neutral-700 hover:border-[#D4A574] flex flex-col items-center justify-center cursor-pointer transition-colors text-neutral-500 hover:text-[#D4A574]">
                                            <FiUpload className="w-6 h-6 mb-2" />
                                            <span className="text-xs">Add Image</span>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                multiple 
                                                className="hidden" 
                                                onChange={handleImageChange} 
                                            />
                                        </label>
                                    )}
                                </div>
                                <p className="text-xs text-neutral-500">
                                    {((editingProduct.images_urls?.length || 0) + selectedImageFiles.length)} / 8 images selected
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editingProduct.name || ''}
                                    onChange={handleEditChange}
                                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D4A574]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={editingProduct.description || ''}
                                    onChange={handleEditChange}
                                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D4A574]"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-1">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        step="0.01"
                                        value={editingProduct.price || ''}
                                        onChange={handleEditChange}
                                        className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D4A574]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-1">Stock</label>
                                    <input
                                        type="number"
                                        name="stock_quantity"
                                        value={editingProduct.stock_quantity || ''}
                                        onChange={handleEditChange}
                                        className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D4A574]"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    id="isFeatured"
                                    checked={editingProduct.isFeatured || false}
                                    onChange={handleEditChange}
                                    className="w-4 h-4 rounded border-neutral-800 text-[#D4A574] focus:ring-[#D4A574] bg-neutral-950"
                                />
                                <label htmlFor="isFeatured" className="text-sm font-medium text-neutral-400 cursor-pointer select-none">
                                    Featured Product
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">SKU</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={editingProduct.sku || ''}
                                    onChange={handleEditChange}
                                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D4A574]"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-neutral-900 py-4 border-t border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-neutral-400 hover:text-neutral-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-6 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] transition-colors font-medium shadow-lg shadow-[#D4A574]/20 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isUpdating && <FiLoader className="w-4 h-4 animate-spin" />}
                                    Update Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;