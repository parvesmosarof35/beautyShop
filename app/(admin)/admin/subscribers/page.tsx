'use client';

import React from 'react';
import { useGetAllSubscribersQuery } from '@/app/store/api/subscriberApi';
import { FiMail, FiCalendar, FiCheckCircle } from 'react-icons/fi';

export default function SubscribersPage() {
  const { data: subscribersData, isLoading } = useGetAllSubscribersQuery();
  const subscribers = subscribersData?.data || [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-200">Subscribers</h1>
        <p className="text-neutral-400 text-sm mt-1">Manage your newsletter subscribers</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D4A574]"></div>
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-400">
              <thead className="text-xs uppercase bg-neutral-800/50 text-neutral-300">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Email Address</th>
                  <th scope="col" className="px-6 py-4 font-medium">Status</th>
                  <th scope="col" className="px-6 py-4 font-medium">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {subscribers.length > 0 ? (
                  subscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-neutral-200 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D4A574]/10 flex items-center justify-center text-[#D4A574]">
                          <FiMail className="w-4 h-4" />
                        </div>
                        {subscriber.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          <FiCheckCircle className="w-3.5 h-3.5" />
                          Subscribed
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-neutral-400">
                          <FiCalendar className="w-4 h-4" />
                          {new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-neutral-500">
                      No subscribers found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
