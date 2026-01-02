'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiPackage, FiUsers, FiDollarSign, FiPieChart } from 'react-icons/fi';
// @ts-ignore
import UserGrowthChart from '@/app/components/dashboard/UserGrowthChart';
import {
  useGetDashboardStatsQuery,
  useGetRecentOrdersQuery,
  useGetRecentUsersQuery,
  useGetUserGrowthQuery
} from '@/app/store/api/dashboardStatsApi';
import { RecentOrder, RecentUser } from '@/app/store/api/dashboardStatsApi';
import { Spin } from 'antd';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  isLoading?: boolean;
};

const StatCard = ({ title, value, icon, isLoading }: StatCardProps) => (
  <div className="bg-neutral-900 overflow-hidden shadow-lg border border-neutral-800 rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0 rounded-md p-3 bg-neutral-800 text-[#D4A574]">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-neutral-400 truncate font-inter">{title}</dt>
            <dd className="flex items-baseline">
              {isLoading ? (
                <div className="h-8 w-24 bg-neutral-800 animate-pulse rounded mt-1"></div>
              ) : (
                <div className="text-2xl font-semibold text-neutral-200 font-inter">{value}</div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const RecentOrdersList = ({ orders, isLoading }: { orders: RecentOrder[] | undefined, isLoading: boolean }) => (
  <div className="bg-neutral-900 shadow-lg border border-neutral-800 sm:rounded-lg overflow-hidden h-[450px] flex flex-col">
    <div className="px-4 py-5 sm:px-6 border-b border-neutral-800">
      <h3 className="text-lg leading-6 font-medium text-neutral-200">Recent Orders</h3>
      <p className="mt-1 text-sm text-neutral-400">A list of recent orders placed by customers.</p>
    </div>
    <div className="flex-1 overflow-y-auto">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Spin />
        </div>
      ) : (
        <ul className="divide-y divide-neutral-800">
          {orders?.map((order) => (
            <li key={order.orderNumber} className="px-6 py-4 hover:bg-neutral-800/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#D4A574] truncate">{order.orderNumber}</p>
                    <p className="mt-1 text-sm text-neutral-400">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${order.status === 'delivered' ? 'text-green-500' :
                        order.status === 'shipped' ? 'text-blue-500' :
                          order.status === 'processing' ? 'text-yellow-500' : 
                          order.status === 'cancelled' ? 'text-red-500' : 'text-neutral-400'
                      }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                    <p className="text-sm text-neutral-500">{order.date}</p>
                  </div>
                  <div className="text-right w-20">
                    <p className="text-sm font-medium text-neutral-200">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="bg-neutral-900 border-t border-neutral-800 px-4 py-3 sm:px-6 text-right">
      <Link href="/admin/orders" className="text-sm font-medium text-[#D4A574] hover:text-[#b88b5c]">
        View all
      </Link>
    </div>
  </div>
);

const RecentUsersList = ({ users, isLoading }: { users: RecentUser[] | undefined, isLoading: boolean }) => (
  <div className="bg-neutral-900 shadow-lg border border-neutral-800 sm:rounded-lg overflow-hidden h-[450px] flex flex-col">
    <div className="px-4 py-5 sm:px-6 border-b border-neutral-800">
      <h3 className="text-lg leading-6 font-medium text-neutral-200">Recent Users</h3>
      <p className="mt-1 text-sm text-neutral-400">New users registered recently.</p>
    </div>
    <div className="flex-1 overflow-y-auto">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Spin />
        </div>
      ) : (
        <ul className="divide-y divide-neutral-800">
          {users?.map((user, idx) => (
            <li key={idx} className="px-6 py-4 hover:bg-neutral-800/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-[#D4A574]">
                  <FiUsers />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-200 truncate">{user.name}</p>
                  <p className="text-sm text-neutral-500 truncate">{user.email}</p>
                </div>
                <div className="text-right text-sm text-neutral-500">
                  {user.registrationDate}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="bg-neutral-900 border-t border-neutral-800 px-4 py-3 sm:px-6 text-right">
      <Link href="/admin/customers" className="text-sm font-medium text-[#D4A574] hover:text-[#b88b5c]">
        View all
      </Link>
    </div>
  </div>
);

export default function DashboardPage() {
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: statsData, isLoading: isStatsLoading } = useGetDashboardStatsQuery();
  const { data: ordersData, isLoading: isOrdersLoading } = useGetRecentOrdersQuery(7);
  const { data: usersData, isLoading: isUsersLoading } = useGetRecentUsersQuery(7);
  const { data: growthData, isLoading: isGrowthLoading } = useGetUserGrowthQuery(year);

  const stats = statsData?.data?.summary;
  const recentOrders = ordersData?.data;
  const recentUsers = usersData?.data;
  const growth = growthData?.data;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-200">Dashboard</h1>
        <p className="text-neutral-400">Welcome to your admin dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4 font-inter">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts?.toLocaleString() || "0"}
          icon={<FiDollarSign className="h-6 w-6" />}
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders?.toLocaleString() || "0"}
          icon={<FiPackage className="h-6 w-6" />}
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers?.toLocaleString() || "0"}
          icon={<FiUsers className="h-6 w-6" />}
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Total Collections"
          value={stats?.totalCollections?.toLocaleString() || "0"}
          icon={<FiPieChart className="h-6 w-6" />}
          isLoading={isStatsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <UserGrowthChart 
            data={growth}
            year={year}
            setYear={setYear}
            isLoading={isGrowthLoading}
          />
        </div>

        {/* Recent Orders Section - occupying 1 column */}
        <div className="lg:col-span-1">
          <RecentOrdersList orders={recentOrders} isLoading={isOrdersLoading} />
        </div>
      </div>

      {/* Recent Users */}
      <div className="mt-8">
        <RecentUsersList users={recentUsers} isLoading={isUsersLoading} />
      </div>
    </>
  );
}
