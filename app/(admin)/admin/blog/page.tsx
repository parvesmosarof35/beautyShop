'use client';

import React, { useState } from 'react';
import { FiSearch, FiPlus, FiTrash2, FiEdit2, FiX, FiImage, FiType, FiFileText } from 'react-icons/fi';
import { useGetAllBlogsQuery, useCreateBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation } from '@/app/store/api/blogApi';
import { revalidateBlog } from '@/app/actions/revalidate';
import Swal from 'sweetalert2';
import Image from 'next/image';

export default function BlogPage() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<any>(null);

    // API Hooks
    const { data: blogData, isLoading, refetch } = useGetAllBlogsQuery({ 
        searchTerm: searchTerm, 
        page, 
        limit: 10 
    });
    const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
    const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
    const [deleteBlog] = useDeleteBlogMutation();

    // Form State
    const [formData, setFormData] = useState({
        blogTitle: '',
        content: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const handleOpenModal = (blog?: any) => {
        if (blog) {
            setEditingBlog(blog);
            setFormData({
                blogTitle: blog.blogTitle,
                content: blog.content
            });
            setPreviewUrl(blog.photo || '');
        } else {
            setEditingBlog(null);
            setFormData({ blogTitle: '', content: '' });
            setPreviewUrl('');
        }
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const data = new FormData();
            data.append('data', JSON.stringify({
                blogTitle: formData.blogTitle,
                content: formData.content
            }));
            
            if (selectedFile) {
                data.append('file', selectedFile);
            }

            let res;
            if (editingBlog) {
                res = await updateBlog({ id: editingBlog._id, formData: data }).unwrap();
                await revalidateBlog();
            } else {
                res = await createBlog(data).unwrap();
                await revalidateBlog();
            }

            if (res?.success || res?.status) {
                Swal.fire({
                    icon: 'success',
                    title: editingBlog ? 'Blog Updated' : 'Blog Created',
                    text: `Successfully ${editingBlog ? 'updated' : 'created'} blog post`,
                    background: '#171717',
                    color: '#fff',
                    confirmButtonColor: '#D4A574'
                });
                setIsModalOpen(false);
                refetch();
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Operation Failed',
                text: error?.data?.message || 'Something went wrong',
                background: '#171717',
                color: '#fff',
                confirmButtonColor: '#D4A574'
            });
        }
    };

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
                await deleteBlog(id).unwrap();
                await revalidateBlog();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Blog post has been deleted.',
                    icon: 'success',
                    background: '#171717',
                    color: '#fff',
                    confirmButtonColor: '#D4A574'
                });
                refetch();
            } catch (error: any) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete blog post.',
                    icon: 'error',
                    background: '#171717',
                    color: '#fff',
                    confirmButtonColor: '#D4A574'
                });
            }
        }
    };

    const allBlogs = blogData?.data?.allBlogsList || [];
    const meta = blogData?.data?.meta;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-200">Blog Management</h1>
                    <p className="text-neutral-400">Create and manage blog posts</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] flex items-center gap-2 transition-colors shadow-lg shadow-[#D4A574]/20"
                >
                    <FiPlus /> Create Post
                </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
                {/* Search Bar */}
                <div className="p-4 border-b border-neutral-800 bg-neutral-900">
                    <div className="relative max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#D4A574] transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {isLoading ? (
                        <div className="col-span-full text-center py-8 text-neutral-500">Loading blogs...</div>
                    ) : allBlogs.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-neutral-500">No blog posts found.</div>
                    ) : (
                        allBlogs.map((blog: any) => (
                            <div key={blog._id} className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden group hover:border-[#D4A574]/30 transition-all">
                                <div className="relative h-48 w-full bg-neutral-900">
                                    {blog.photo ? (
                                        <Image 
                                            src={blog.photo} 
                                            alt={blog.blogTitle}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-700">
                                            <FiImage className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleOpenModal(blog)}
                                            className="p-2 bg-neutral-900/80 backdrop-blur-sm text-white rounded-lg hover:bg-[#D4A574] transition-colors"
                                        >
                                            <FiEdit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(blog._id)}
                                            className="p-2 bg-neutral-900/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-500 transition-colors"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-neutral-200 line-clamp-1 mb-2">{blog.blogTitle}</h3>
                                    <p className="text-sm text-neutral-400 line-clamp-3">{blog.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {meta && meta.totalPage > 1 && (
                    <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-end gap-2 bg-neutral-900">
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

            {/* Create/Update Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-300 transition-colors"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                        
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-neutral-200">{editingBlog ? 'Edit Blog Post' : 'Create New Post'}</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-500 uppercase mb-2">Cover Image</label>
                                <div className="w-full h-48 border-2 border-dashed border-neutral-800 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#D4A574]/50 transition-colors">
                                    {previewUrl ? (
                                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-neutral-600">
                                            <FiImage className="w-8 h-8 mb-2" />
                                            <span className="text-sm">Click to upload image</span>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    {previewUrl && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <span className="text-white text-sm font-medium">Change Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-neutral-500 uppercase">Title</label>
                                <div className="relative">
                                    <FiType className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.blogTitle}
                                        onChange={(e) => setFormData({...formData, blogTitle: e.target.value})}
                                        className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#D4A574]"
                                        placeholder="Enter blog title"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-neutral-500 uppercase">Content</label>
                                <div className="relative">
                                    <FiFileText className="absolute left-3 top-4 text-neutral-500" />
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                        className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#D4A574] resize-none"
                                        placeholder="Write your blog content here..."
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="w-full py-3 bg-[#D4A574] text-white rounded-xl hover:bg-[#b88b5c] font-medium shadow-lg shadow-[#D4A574]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isCreating || isUpdating ? 'Saving...' : (editingBlog ? 'Update Post' : 'Publish Post')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}