'use client';

import Link from 'next/link';
import { FiPackage, FiUsers, FiDollarSign, FiPieChart, FiSettings } from 'react-icons/fi';
// @ts-ignore
import UserGrowthChart from '@/app/components/dashboard/UserGrowthChart';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
};

const StatCard = ({ title, value, icon }: StatCardProps) => (
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
              <div className="text-2xl font-semibold text-neutral-200 font-inter">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const RecentOrders = () => (
  <div className="bg-neutral-900 shadow-lg border border-neutral-800 sm:rounded-lg overflow-hidden h-[450px] flex flex-col">
    <div className="px-4 py-5 sm:px-6 border-b border-neutral-800">
      <h3 className="text-lg leading-6 font-medium text-neutral-200">Recent Orders</h3>
      <p className="mt-1 text-sm text-neutral-400">A list of recent orders placed by customers.</p>
    </div>
    <div className="flex-1 overflow-y-auto">
      <ul className="divide-y divide-neutral-800">
        {[
          { id: '#LUN-001', customer: 'John Doe', status: 'Delivered', total: '$129.99', date: '2023-06-15' },
          { id: '#LUN-002', customer: 'Jane Smith', status: 'Shipped', total: '$89.99', date: '2023-06-14' },
          { id: '#LUN-003', customer: 'Robert Johnson', status: 'Processing', total: '$199.99', date: '2023-06-14' },
          { id: '#LUN-004', customer: 'Emily Davis', status: 'Delivered', total: '$149.99', date: '2023-06-13' },
          { id: '#LUN-005', customer: 'Michael Wilson', status: 'Cancelled', total: '$59.99', date: '2023-06-12' },
          { id: '#LUN-006', customer: 'Sarah Brown', status: 'Processing', total: '$75.00', date: '2023-06-11' },
          { id: '#LUN-007', customer: 'David Lee', status: 'Shipped', total: '$210.50', date: '2023-06-10' },
        ].map((order) => (
          <li key={order.id} className="px-6 py-4 hover:bg-neutral-800/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#D4A574] truncate">{order.id}</p>
                  <p className="mt-1 text-sm text-neutral-400">{order.customer}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className={`text-sm font-medium ${order.status === 'Delivered' ? 'text-green-500' :
                      order.status === 'Shipped' ? 'text-blue-500' :
                        order.status === 'Processing' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                    {order.status}
                  </p>
                  <p className="text-sm text-neutral-500">{order.date}</p>
                </div>
                <div className="text-right w-20">
                  <p className="text-sm font-medium text-neutral-200">{order.total}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-neutral-900 border-t border-neutral-800 px-4 py-3 sm:px-6 text-right">
      <Link href="/admin/orders" className="text-sm font-medium text-[#D4A574] hover:text-[#b88b5c]">
        View all
      </Link>
    </div>
  </div>
);

const RecentUsers = () => (
  <div className="bg-neutral-900 shadow-lg border border-neutral-800 sm:rounded-lg overflow-hidden h-[450px] flex flex-col">
    <div className="px-4 py-5 sm:px-6 border-b border-neutral-800">
      <h3 className="text-lg leading-6 font-medium text-neutral-200">Recent Users</h3>
      <p className="mt-1 text-sm text-neutral-400">New users registered recently.</p>
    </div>
    <div className="flex-1 overflow-y-auto">
      <ul className="divide-y divide-neutral-800">
        {[
          { id: 1, name: 'Alice Walker', email: 'alice@example.com', date: '2023-06-15' },
          { id: 2, name: 'David Chen', email: 'david@example.com', date: '2023-06-14' },
          { id: 3, name: 'Sarah Jones', email: 'sarah@example.com', date: '2023-06-14' },
          { id: 4, name: 'Michael Brown', email: 'michael@example.com', date: '2023-06-13' },
          { id: 5, name: 'Emma Wilson', email: 'emma@example.com', date: '2023-06-12' },
          { id: 6, name: 'James Taylor', email: 'james@example.com', date: '2023-06-11' },
          { id: 7, name: 'Laura Martinez', email: 'laura@example.com', date: '2023-06-10' },
        ].map((user) => (
          <li key={user.id} className="px-6 py-4 hover:bg-neutral-800/50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-[#D4A574]">
                <FiUsers />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-200 truncate">{user.name}</p>
                <p className="text-sm text-neutral-500 truncate">{user.email}</p>
              </div>
              <div className="text-right text-sm text-neutral-500">
                {user.date}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-neutral-900 border-t border-neutral-800 px-4 py-3 sm:px-6 text-right">
      <Link href="/admin/customers" className="text-sm font-medium text-[#D4A574] hover:text-[#b88b5c]">
        View all
      </Link>
    </div>
  </div>
);

export default function DashboardPage() {
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
          value="24,780"
          icon={<FiDollarSign className="h-6 w-6" />}
        />
        <StatCard
          title="Total Orders"
          value="1,245"
          icon={<FiPackage className="h-6 w-6" />}
        />
        <StatCard
          title="Total Customers"
          value="845"
          icon={<FiUsers className="h-6 w-6" />}
        />
        <StatCard
          title="Total Collections"
          value="15"
          icon={<FiPieChart className="h-6 w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <UserGrowthChart />
        </div>

        {/* Recent Orders Section - occupying 1 column */}
        <div className="lg:col-span-1">
          <RecentOrders />
        </div>
      </div>

      {/* Recent Users */}
      <div className="mt-8">
        <RecentUsers />
      </div>
    </>
  );
}
