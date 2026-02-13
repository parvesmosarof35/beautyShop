'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { FiUploadCloud, FiX, FiLoader } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useGetAllCollectionsQuery } from '@/app/store/api/collectionApi';
import { revalidateFeaturedProducts, revalidateProducts } from '@/app/actions/revalidate';
import { useCreateProductMutation } from '@/app/store/api/productApi';

// Types based on Schema
type SkinType = "Dry" | "Oily" | "Combination" | "Sensitive" | "Normal";
type Ingredient = "Hyaluronic Acid" | "Vitamin C" | "Retinol" | "Niacinamide" | "Peptides";

const SKIN_TYPES: SkinType[] = ["Dry", "Oily", "Combination", "Sensitive", "Normal"];
const INGREDIENTS: Ingredient[] = ["Hyaluronic Acid", "Vitamin C", "Retinol", "Niacinamide", "Peptides"];

const AddProductPage = () => {
    const router = useRouter();

    // Fetch collections from API
    const { data: collectionsData, isLoading: isLoadingCollections } = useGetAllCollectionsQuery({
        page: 1,
        limit: 100, // Get all collections
    });

    const availableCollections = collectionsData?.data || [];

    // Create product mutation
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        sku: '',
        isFeatured: false,
        skintype: '' as SkinType | '',
        categories: [] as string[],
        ingredients: [] as Ingredient[],
        collection: '', // Changed from collections array to single collection
        product_link: '',
    });

    // Store actual File objects for images
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [categoryInput, setCategoryInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCategoryAdd = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && categoryInput.trim()) {
            e.preventDefault();
            if (!formData.categories.includes(categoryInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    categories: [...prev.categories, categoryInput.trim()]
                }));
            }
            setCategoryInput('');
        }
    };

    const removeCategory = (cat: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c !== cat)
        }));
    };

    const toggleIngredient = (ingredient: Ingredient) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.includes(ingredient)
                ? prev.ingredients.filter(i => i !== ingredient)
                : [...prev.ingredients, ingredient]
        }));
    };

    const toggleCollection = (collectionId: string) => {
        // Set single collection (replace previous selection)
        setFormData(prev => ({
            ...prev,
            collection: collectionId
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + imageFiles.length > 8) {
            Swal.fire({
                title: 'Error!',
                text: 'Maximum 8 images allowed',
                icon: 'error',
                confirmButtonColor: '#D4A574',
                background: '#171717',
                color: '#e5e5e5',
            });
            return;
        }

        // Store File objects
        setImageFiles(prev => [...prev, ...files]);

        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Create FormData for API submission
        const formDataToSend = new FormData();

        // Append basic fields
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('stock_quantity', formData.stock_quantity);
        formDataToSend.append('sku', formData.sku);
        formDataToSend.append('isFeatured', formData.isFeatured.toString());
        if (formData.product_link) {
            formDataToSend.append('product_link', formData.product_link);
        }

        if (formData.skintype) {
            formDataToSend.append('skintype', formData.skintype);
        }

        // Append array items individually (not as JSON strings)
        formData.categories.forEach((category) => {
            formDataToSend.append('categories', category);
        });

        formData.ingredients.forEach((ingredient) => {
            formDataToSend.append('ingredients', ingredient);
        });

        // Append single collection (not an array)
        if (formData.collection) {
            formDataToSend.append('collections', formData.collection);
        }

        // Append image files
        imageFiles.forEach((file) => {
            formDataToSend.append('images', file);
        });

        try {
            await createProduct(formDataToSend).unwrap();
            
            // Revalidate caches
            await Promise.all([
                revalidateFeaturedProducts(),
                revalidateProducts()
            ]);

            Swal.fire({
                title: 'Success!',
                text: 'Product created successfully!',
                icon: 'success',
                confirmButtonColor: '#D4A574',
                background: '#171717',
                color: '#e5e5e5',
                timer: 2000,
            });

            // Navigate back to products page
            router.push('/admin/products');
        } catch (err: any) {
            console.error('Failed to create product:', err);
            Swal.fire({
                title: 'Error!',
                text: err?.data?.message || 'Failed to create product. Please try again.',
                icon: 'error',
                confirmButtonColor: '#D4A574',
                background: '#171717',
                color: '#e5e5e5',
            });
        }
    };










        //  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
        //                 <h3 className="text-lg font-semibold text-neutral-200 mb-4">Specifications</h3>
        //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        //                     {/* Skin Type */}
        //                     <div>
        //                         <label className="block text-sm font-medium text-neutral-400 mb-2">Skin Type</label>
        //                         <select
        //                             name="skintype"
        //                             value={formData.skintype}
        //                             onChange={handleChange}
        //                             className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D4A574]"
        //                         >
        //                             <option value="">Select Skin Type</option>
        //                             {SKIN_TYPES.map(type => (
        //                                 <option key={type} value={type}>{type}</option>
        //                             ))}
        //                         </select>
        //                     </div>
        //                 </div>

        //                 {/* Ingredients */}
        //                 <div className="mt-6">
        //                     <label className="block text-sm font-medium text-neutral-400 mb-2">Key Ingredients</label>
        //                     <div className="flex flex-wrap gap-3">
        //                         {INGREDIENTS.map(ingredient => (
        //                             <button
        //                                 key={ingredient}
        //                                 type="button"
        //                                 onClick={() => toggleIngredient(ingredient)}
        //                                 className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${formData.ingredients.includes(ingredient)
        //                                     ? 'bg-neutral-200 text-neutral-900 border-neutral-200'
        //                                     : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500'
        //                                     }`}
        //                             >
        //                                 {ingredient}
        //                             </button>
        //                         ))}
        //                     </div>
        //                 </div>
        //             </div>












    return (
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-200">Add New Product</h1>
                    <p className="text-neutral-400">Create a new product in your inventory</p>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/products')}
                        disabled={isCreating}
                        className="px-4 py-2 border border-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="px-6 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                        {isCreating && <FiLoader className="w-4 h-4 animate-spin" />}
                        {isCreating ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-neutral-200 mb-4">Product Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D4A574]"
                                    placeholder="e.g. Luxury Face Cream"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Description *</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D4A574]"
                                    placeholder="Detailed product description..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Product Link (Optional)</label>
                                <input
                                    type="text"
                                    name="product_link"
                                    value={formData.product_link}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D4A574]"
                                    placeholder="e.g. https://example.com/product"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">SKU *</label>
                                <input
                                    type="text"
                                    name="sku"
                                    required
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D4A574] uppercase"
                                    placeholder="e.g. SK-1001"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-neutral-200 mb-4">Media (Max 8)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {imagePreviews.map((url: string, index: number) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-800 group">
                                    <Image src={url} alt={`Product ${index}`} fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FiX className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {imagePreviews.length < 8 && (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-lg border-2 border-dashed border-neutral-800 hover:border-neutral-600 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-950/50"
                                >
                                    <FiUploadCloud className="w-8 h-8 text-neutral-500 mb-2" />
                                    <span className="text-xs text-neutral-500">Upload</span>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                    </div>

                    {/* Specifications */}
               
                </div>

                {/* Right Column - Status & Pricing */}
                <div className="space-y-6">
                    {/* Publishing */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-neutral-200 mb-4">Status</h3>
                        <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                            <span className="text-sm text-neutral-300">Featured Product</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4A574]"></div>
                            </label>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-neutral-200 mb-4">Pricing & Inventory</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Price ($) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D4A574]"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Stock Quantity *</label>
                                <input
                                    type="number"
                                    name="stock_quantity"
                                    required
                                    min="0"
                                    value={formData.stock_quantity}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#D4A574]"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Collections */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-neutral-200 mb-4">Collection</h3>
                        {isLoadingCollections ? (
                            <div className="text-center py-4 text-neutral-500">Loading collections...</div>
                        ) : availableCollections.length === 0 ? (
                            <div className="text-center py-4 text-neutral-500">No collections available</div>
                        ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {availableCollections.map((collection: any) => (
                                    <label key={collection._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer">
                                        <input
                                            type="radio"
                                            name="collection"
                                            checked={formData.collection === collection._id}
                                            onChange={() => toggleCollection(collection._id)}
                                            className="bg-neutral-950 border-neutral-700 text-[#D4A574] focus:ring-0 focus:ring-offset-0"
                                        />
                                        <span className="text-sm text-neutral-300">{collection.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AddProductPage;
