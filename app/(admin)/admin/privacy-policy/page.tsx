'use client';

import React, { useState, useEffect } from 'react';
import JoditComponent from '@/app/components/dashboard/JoditComponent';
import Swal from 'sweetalert2';
import { useGetPrivacyQuery, useUpdatePrivacyMutation } from '@/app/store/api/privacyApi';

import { revalidatePrivacy } from '@/app/actions/revalidate';

export default function PrivacyPolicyPage() {
    const [content, setContent] = useState('');
    const { data: privacyData, isLoading } = useGetPrivacyQuery({});
    const [updatePrivacy, { isLoading: isUpdating }] = useUpdatePrivacyMutation();

    useEffect(() => {
        if (privacyData?.data?.PrivacyPolicy) {
            setContent(privacyData.data.PrivacyPolicy);
        }
    }, [privacyData]);

    const handleSave = async () => {
        try {
            await updatePrivacy({ requestData: { PrivacyPolicy: content } }).unwrap();
            await revalidatePrivacy();
            Swal.fire({
                title: 'Success!',
                text: 'Privacy Policy Saved!',
                icon: 'success',
                confirmButtonColor: '#D4A574',
                background: '#171717',
                color: '#fff'
            });
        } catch (error: any) {
            Swal.fire({
                title: 'Error!',
                text: error?.data?.message || 'Failed to save changes.',
                icon: 'error',
                confirmButtonColor: '#D4A574',
                background: '#171717',
                color: '#fff'
            });
        }
    };

    if (isLoading) {
         return <div className="text-white p-8">Loading...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-200">Privacy Policy</h1>
                    <p className="text-neutral-400">Edit your privacy policy content</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] transition-colors disabled:opacity-50"
                >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6 shadow-lg border border-neutral-800">
                <div className="text-neutral-900">
                    <JoditComponent content={content} setContent={setContent} />
                </div>
            </div>
        </div>
    );
}
