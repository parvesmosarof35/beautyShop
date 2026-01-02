'use client';

import React, { useState, useMemo } from 'react';
import { FiSearch, FiStar, FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';
import { useGetAllReviewsQuery, useDeleteReviewMutation } from '@/app/store/api/reviewsApi';
import Swal from 'sweetalert2';

const ReviewsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const { data: reviewsData, isLoading, isError } = useGetAllReviewsQuery({ page: currentPage, limit });
    const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
    const reviews = Array.isArray(reviewsData?.data) ? reviewsData.data : [];
    const meta = reviewsData?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

    // Filter reviews based on search term (client-side for current page only)
    const displayedReviews = useMemo(() => {
        if (!Array.isArray(reviews)) return [];
        if (!searchTerm) return reviews;

        const search = searchTerm.toLowerCase();
        return reviews.filter((review: any) =>
            review.user_id?.fullname?.toLowerCase().includes(search) ||
            review.user_id?.email?.toLowerCase().includes(search) ||
            review.product_id?.name?.toLowerCase().includes(search) ||
            review.comment?.toLowerCase().includes(search)
        );
    }, [reviews, searchTerm]);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FiStar
                key={index}
                className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                    }`}
            />
        ));
    };

    const handleDeleteReview = async (reviewId: string, productName: string) => {
        const result = await Swal.fire({
            title: 'Delete Review?',
            html: `Are you sure you want to delete the review for <strong>${productName}</strong>?<br/>This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
            background: '#171717',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                const res = await deleteReview(reviewId).unwrap();

                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: res?.message || 'Review has been deleted successfully',
                    background: '#171717',
                    color: '#fff',
                    confirmButtonColor: '#D4A574'
                });
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Delete Failed',
                    text: error?.data?.message || 'Failed to delete review',
                    background: '#171717',
                    color: '#fff',
                    confirmButtonColor: '#D4A574'
                });
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A574] mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading reviews...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Failed to load reviews</h2>
                    <p className="text-gray-400">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-200">Customer Reviews</h1>
                    <p className="text-sm text-neutral-400 mt-1">
                        {searchTerm
                            ? `${displayedReviews.length} ${displayedReviews.length === 1 ? 'review' : 'reviews'} found on this page`
                            : `Showing ${reviews.length} of ${meta.total} reviews`
                        }
                    </p>
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
                {/* Search Bar */}
                <div className="p-4 border-b border-neutral-800">
                    <div className="relative max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search by customer, product, or comment..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#D4A574]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-950 text-neutral-400 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Comment</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {displayedReviews.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                                        {searchTerm ? 'No reviews found matching your search on this page' : 'No reviews available'}
                                    </td>
                                </tr>
                            ) : (
                                displayedReviews.map((review: any) => (
                                    <tr key={review._id} className="hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                                                    {review.product_id?.images_urls?.[0] ? (
                                                        <Image
                                                            src={review.product_id.images_urls[0]}
                                                            alt={review.product_id?.name || 'Product'}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                                            <FiStar className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-neutral-200">
                                                        {review.product_id?.name || 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-neutral-500">
                                                        ${review.product_id?.price || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-neutral-200">
                                                {review.user_id?.fullname || 'Anonymous'}
                                            </div>
                                            <div className="text-xs text-neutral-500">
                                                {review.user_id?.email || ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-0.5">
                                                    {renderStars(review.rating || 0)}
                                                </div>
                                                <span className="text-sm font-semibold text-neutral-300">
                                                    {review.rating || 0}/5
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-neutral-300 line-clamp-2 max-w-md">
                                                {review.comment || 'No comment'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">
                                            {formatDate(review.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDeleteReview(review._id, review.product_id?.name || 'this product')}
                                                disabled={isDeleting}
                                                className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed p-2 hover:bg-red-500/10 rounded-lg"
                                                title="Delete review"
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
                {meta.totalPage > 1 && (
                    <div className="p-4 border-t border-neutral-800 flex items-center justify-between">
                        <div className="text-sm text-neutral-400">
                            Showing page {meta.page} of {meta.totalPage} ({meta.total} total reviews)
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                                Previous
                            </button>
                            <div className="flex gap-1">
                                {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                            ? 'bg-[#D4A574] text-white'
                                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(meta.totalPage, prev + 1))}
                                disabled={currentPage === meta.totalPage}
                                className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsPage;
