'use client';

import React, { useEffect, useState } from 'react';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/app/store/api/settingsApi';
import Swal from 'sweetalert2';
import { FiSave, FiLoader } from 'react-icons/fi';

const WebSettingsPage = () => {
  const { data: settingsData, isLoading } = useGetSettingsQuery({});
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  const [formData, setFormData] = useState({
    instagram: { url: '', isActive: true },
    facebook: { url: '', isActive: true },
    tiktok: { url: '', isActive: true },
    twitterx: { url: '', isActive: true },
    whatsapp: { url: '', isActive: true },
    address: { url: '', isActive: true },
    phone: { url: '', isActive: true },
    email: { url: '', isActive: true },
    homepagesection2: { title: '', subtitle: '' },
    homepagesection3: { title: '', subtitle: '', buttontext: '' },
    footertext: { logobelowtext: '', footerbottomtext: '' },
    productpage: { title: '', subtitle: '' },
    productdetails: { Gotodetailstext: '', relatedproducttext: '' },
  });

  useEffect(() => {
    if (settingsData?.data) {
      // Merge with defaults to ensure all fields exist. Assuming data is in data.data or directly in data
      // API response structure usually has 'data' property
        setFormData(prev => ({ ...prev, ...settingsData.data }));
    }
  }, [settingsData]);

  const handleChange = (section: string, field: string, value: any) => {
    setFormData(prev => {
        const sectionData = (prev as any)[section] || {};
      return {
      ...prev,
      [section]: {
        ...sectionData,
        [field]: value
      }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData).unwrap();
      Swal.fire({
        title: 'Success!',
        text: 'Settings updated successfully.',
        icon: 'success',
        confirmButtonColor: '#D4A574',
        background: '#171717',
        color: '#e5e5e5',
        timer: 2000,
      });
    } catch (err) {
      console.error('Failed to update settings:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update settings. Please try again.',
        icon: 'error',
        confirmButtonColor: '#D4A574',
        background: '#171717',
        color: '#e5e5e5',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FiLoader className="w-8 h-8 text-[#D4A574] animate-spin" />
      </div>
    );
  }

  // Helper to render URL/Active inputs
  const renderLinkInput = (section: string, label: string, placeholder: string) => {
      const isFieldActive = (formData[section as keyof typeof formData] as any)?.isActive;
      const fieldUrl = (formData[section as keyof typeof formData] as any)?.url || '';
      
      return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-medium text-neutral-300 capitalize">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">{isFieldActive ? 'Active' : 'Inactive'}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isFieldActive || false}
              onChange={(e) => handleChange(section, 'isActive', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4A574]"></div>
          </label>
        </div>
      </div>
      <input
        type="text"
        value={fieldUrl}
        onChange={(e) => handleChange(section, 'url', e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A574] text-sm"
        placeholder={placeholder}
      />
    </div>
  )};

  return (
    <div className="pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
             <div>
                 <h1 className="text-2xl font-bold text-neutral-200">Web Settings</h1>
                 <p className="text-neutral-400">Manage social links, contact info, and page content.</p>
             </div>
             <button
                 onClick={handleSubmit}
                 disabled={isUpdating}
                 className="px-6 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#D4A574]/10"
             >
                 {isUpdating ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                 {isUpdating ? 'Saving...' : 'Save Changes'}
             </button>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Social Media Section */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-200 mb-4 border-b border-neutral-800 pb-2">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderLinkInput('instagram', 'Instagram', 'https://instagram.com/yourpage')}
            {renderLinkInput('facebook', 'Facebook', 'https://facebook.com/yourpage')}
            {renderLinkInput('tiktok', 'TikTok', 'https://tiktok.com/@yourprofile')}
            {renderLinkInput('twitterx', 'Twitter / X', 'https://twitter.com/yourpage')}
            {renderLinkInput('whatsapp', 'WhatsApp', '+1234567890')}
          </div>
        </section>

        {/* Contact Info Section */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-200 mb-4 border-b border-neutral-800 pb-2">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderLinkInput('address', 'Address', '123 Main St, City, Country')}
            {renderLinkInput('phone', 'Phone', '+1234567890')}
            {renderLinkInput('email', 'Email', 'info@example.com')}
          </div>
        </section>

        {/* Homepage Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-neutral-200 mb-4">Homepage Section 2</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.homepagesection2?.title || ''}
                            onChange={(e) => handleChange('homepagesection2', 'title', e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A574]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Subtitle</label>
                        <textarea
                            value={formData.homepagesection2?.subtitle || ''}
                            onChange={(e) => handleChange('homepagesection2', 'subtitle', e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A574]"
                            rows={3}
                        />
                    </div>
                </div>
            </section>

            <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-neutral-200 mb-4">Homepage Section 3</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.homepagesection3?.title || ''}
                            onChange={(e) => handleChange('homepagesection3', 'title', e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A574]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Subtitle</label>
                        <textarea
                            value={formData.homepagesection3?.subtitle || ''}
                            onChange={(e) => handleChange('homepagesection3', 'subtitle', e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A574]"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Button Text</label>
                        <input
                            type="text"
                            value={formData.homepagesection3?.buttontext || ''}
                            onChange={(e) => handleChange('homepagesection3', 'buttontext', e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A574]"
                        />
                    </div>
                </div>
            </section>
        </div>

        {/* Global Text Settings */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-200 mb-4">Global Text Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Footer</h3>
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Logo Below Text</label>
                        <textarea
                            value={formData.footertext?.logobelowtext || ''}
                            onChange={(e) => handleChange('footertext', 'logobelowtext', e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A574]"
                            rows={2}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Footer Bottom Text</label>
                        <input
                            type="text"
                            value={formData.footertext?.footerbottomtext || ''}
                            onChange={(e) => handleChange('footertext', 'footerbottomtext', e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A574]"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Product Pages</h3>
                     <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Products Page Title</label>
                        <input
                            type="text"
                            value={formData.productpage?.title || ''}
                            onChange={(e) => handleChange('productpage', 'title', e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A574]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Products Page Subtitle</label>
                        <input
                            type="text"
                            value={formData.productpage?.subtitle || ''}
                            onChange={(e) => handleChange('productpage', 'subtitle', e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A574]"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Details Button Text</label>
                        <input
                            type="text"
                            value={formData.productdetails?.Gotodetailstext || ''}
                            onChange={(e) => handleChange('productdetails', 'Gotodetailstext', e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A574]"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Related Products Title</label>
                        <input
                            type="text"
                            value={formData.productdetails?.relatedproducttext || ''}
                            onChange={(e) => handleChange('productdetails', 'relatedproducttext', e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A574]"
                        />
                    </div>
                </div>
            </div>
        </section>

      </form>
    </div>
  );
};

export default WebSettingsPage;