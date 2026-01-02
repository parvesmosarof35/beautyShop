'use client';

import React, { useState, useMemo } from 'react';
import { FiSearch, FiEye } from 'react-icons/fi';
import Link from 'next/link';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '@/app/store/api/orderApi';
import Swal from 'sweetalert2';

const OrdersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: ordersData, isLoading, isError } = useGetAllOrdersQuery({});
    const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

    const orders = Array.isArray(ordersData?.data?.orders) ? ordersData.data.orders : [];

    // Filter orders based on search term
    const filteredOrders = useMemo(() => {
        if (!Array.isArray(orders)) return [];
        if (!searchTerm) return orders;

        const search = searchTerm.toLowerCase();
        return orders.filter((order: any) =>
            order._id?.toLowerCase().includes(search) ||
            order.customerId?.toLowerCase().includes(search) ||
            order.status?.toLowerCase().includes(search) ||
            order.items?.some((item: any) => item.name?.toLowerCase().includes(search))
        );
    }, [orders, searchTerm]);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const res = await updateOrderStatus({ orderId, status: newStatus }).unwrap();

            if (res?.success) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Order status updated",
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#171717',
                    color: '#fff',
                    toast: true
                });
            }
        } catch (err: any) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err?.data?.message || "Failed to update order status",
                background: '#171717',
                color: '#fff',
                confirmButtonColor: '#D4A574'
            });
        }
    };

    const getStatusBadgeClass = (status: string) => {
        const statusLower = status?.toLowerCase();
        switch (statusLower) {
            case 'delivered':
                return 'bg-green-900/30 text-green-400';
            case 'shipped':
            case 'shipping':
                return 'bg-blue-900/30 text-blue-400';
            case 'processing':
            case 'pending':
                return 'bg-yellow-900/30 text-yellow-400';
            case 'cancelled':
            case 'canceled':
                return 'bg-red-900/30 text-red-400';
            default:
                return 'bg-gray-900/30 text-gray-400';
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateTotal = (items: any[]) => {
        if (!items || items.length === 0) return 0;
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A574] mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading orders...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Failed to load orders</h2>
                    <p className="text-gray-400">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-200">Orders</h1>
                    <p className="text-sm text-neutral-400 mt-1">
                        {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
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
                            placeholder="Search by order ID, customer ID, status, or product name..."
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
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-neutral-400">
                                        {searchTerm ? 'No orders found matching your search' : 'No orders available'}
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders?.map((order: any) => (
                                    <tr key={order?._id} className="hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-[#D4A574] font-inter">
                                            #{order?._id?.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-neutral-200 font-mono">
                                                {order?.customerId ? `#${order.customerId.slice(-8).toUpperCase()}` : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative inline-block">
                                                <select
                                                    value={order?.status || 'pending'}
                                                    onChange={(e) => handleStatusChange(order?._id, e.target.value)}
                                                    disabled={isUpdating}
                                                    className={`appearance-none px-4 py-2 pr-8 rounded-lg text-xs font-semibold uppercase tracking-wide cursor-pointer transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg ${order?.status === 'delivered' ? 'bg-green-500/20 text-green-300 border-green-500/50 hover:bg-green-500/30' :
                                                            order?.status === 'shipped' ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 hover:bg-blue-500/30' :
                                                                order?.status === 'processing' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50 hover:bg-yellow-500/30' :
                                                                    order?.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border-red-500/50 hover:bg-red-500/30' :
                                                                        'bg-gray-500/20 text-gray-300 border-gray-500/50 hover:bg-gray-500/30'
                                                        }`}
                                                    style={{
                                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23D4A574' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                                        backgroundPosition: 'right 0.5rem center',
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundSize: '1.5em 1.5em',
                                                    }}
                                                >
                                                    <option value="pending" className="bg-neutral-800 text-gray-300">⏳ Pending</option>
                                                    <option value="processing" className="bg-neutral-800 text-yellow-300">⚙️ Processing</option>
                                                    <option value="shipped" className="bg-neutral-800 text-blue-300">🚚 Shipped</option>
                                                    <option value="delivered" className="bg-neutral-800 text-green-300">✅ Delivered</option>
                                                    <option value="cancelled" className="bg-neutral-800 text-red-300">❌ Cancelled</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-400">
                                            {order.items?.length || 0} items
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-neutral-200 font-inter">
                                            ${calculateTotal(order.items).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order._id}`}
                                                className="text-neutral-400 hover:text-[#D4A574] transition-colors inline-flex items-center gap-1"
                                            >
                                                <FiEye />
                                                <span className="text-xs">View</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
