'use client';

import React, { useEffect, useState } from 'react';
import { useGetSettingsQuery, useUpdateHomePageSection2Mutation, useUpdateSettingsMutation } from '@/app/store/api/settingsApi';
import Swal from 'sweetalert2';
import { FiSave, FiLoader, FiUpload, FiImage, FiPlus, FiTrash2 } from 'react-icons/fi';
import { NavbarLink } from '@/app/store/api/settingsApi';
import { revalidateFeaturedProducts, revalidateProducts, revalidateSettings } from '@/app/actions/revalidate';

const WebSettingsPage = () => {
  const { data: settingsData, isLoading } = useGetSettingsQuery({});
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
  const [updateHomePageSection2, { isLoading: isUpdatingSection2 }] = useUpdateHomePageSection2Mutation();

  const [section2Files, setSection2Files] = useState<{
    imageone?: File;
    imagetwo?: File;
    imagethree?: File;
  }>({});
  const [previews, setPreviews] = useState<{
    imageone?: string;
    imagetwo?: string;
    imagethree?: string;
  }>({});

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
    homepageCollections: { title: '', subtitle: '' },
    footertext: { logobelowtext: '', footerbottomtext: '' },
    productpage: { title: '', subtitle: '' },
    productdetails: { Gotodetailstext: '', relatedproducttext: '' },
    navbarlinks: [] as NavbarLink[],
  });

  useEffect(() => {
    if (settingsData) {
      // Merge with defaults to ensure all fields exist.
      setFormData(prev => ({ ...prev, ...settingsData }));
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

  const handleNavbarLinkChange = (index: number, field: keyof NavbarLink, value: any) => {
    setFormData(prev => {
      const newLinks = [...prev.navbarlinks];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prev, navbarlinks: newLinks };
    });
  };

  const addNavbarLink = () => {
    setFormData(prev => ({
      ...prev,
      navbarlinks: [...prev.navbarlinks, { title: '', url: '', isActive: true }]
    }));
  };

  const removeNavbarLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      navbarlinks: prev.navbarlinks.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (field: 'imageone' | 'imagetwo' | 'imagethree', file: File) => {
    setSection2Files(prev => ({ ...prev, [field]: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews(prev => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Update general settings
      await updateSettings(formData).unwrap();

      // Update Homepage Section 2 with files if any
      const section2Data = new FormData();
      section2Data.append('title', formData.homepagesection2.title);
      section2Data.append('subtitle', formData.homepagesection2.subtitle);

      if (section2Files.imageone) section2Data.append('imageone', section2Files.imageone);
      if (section2Files.imagetwo) section2Data.append('imagetwo', section2Files.imagetwo);
      if (section2Files.imagethree) section2Data.append('imagethree', section2Files.imagethree);

      await updateHomePageSection2(section2Data).unwrap();

      Swal.fire({
        title: 'Success!',
        text: 'Settings updated successfully.',
        icon: 'success',
        confirmButtonColor: '#D4A574',
        background: '#171717',
        color: '#e5e5e5',
        timer: 2000,
      });
      await revalidateFeaturedProducts();
      await revalidateProducts();
      await revalidateSettings();
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
    )
  };

  return (
    <div className="pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-200">Web Settings</h1>
          <p className="text-neutral-400">Manage social links, contact info, and page content.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isUpdating || isUpdatingSection2}
          className="px-6 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#D4A574]/10"
        >
          {isUpdating || isUpdatingSection2 ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
          {isUpdating || isUpdatingSection2 ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Navbar Links Section */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-neutral-200">Navbar Links</h2>
              <p className="text-sm text-neutral-400">Configure the main navigation menu items.</p>
            </div>
            <button
              type="button"
              onClick={addNavbarLink}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg border border-neutral-700 transition-colors text-sm"
            >
              <FiPlus className="w-4 h-4" />
              Add Link
            </button>
          </div>

          <div className="space-y-4">
            {formData.navbarlinks.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-neutral-800 rounded-xl text-neutral-500">
                No navbar links added yet. Click "Add Link" to start.
              </div>
            ) : (
              formData.navbarlinks.map((link, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 bg-neutral-950 border border-neutral-800 rounded-xl items-end sm:items-center">
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1 uppercase tracking-wider">Title</label>
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => handleNavbarLinkChange(index, 'title', e.target.value)}
                        placeholder="e.g. Products"
                        className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4A574] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1 uppercase tracking-wider">URL</label>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleNavbarLinkChange(index, 'url', e.target.value)}
                        placeholder="e.g. /products"
                        className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4A574] text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 h-full">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">{link.isActive ? 'Active' : 'Inactive'}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={link.isActive}
                          onChange={(e) => handleNavbarLinkChange(index, 'isActive', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4A574]"></div>
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeNavbarLink(index)}
                      className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Remove Link"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

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
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-200 mb-4">Homepage Section 2 (Collections)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Title</label>
              <input
                type="text"
                value={formData.homepageCollections?.title || ''}
                onChange={(e) => handleChange('homepageCollections', 'title', e.target.value)}
                placeholder="Curated Collections"
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A574]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Subtitle</label>
              <input
                type="text"
                value={formData.homepageCollections?.subtitle || ''}
                onChange={(e) => handleChange('homepageCollections', 'subtitle', e.target.value)}
                placeholder="Explore our meticulously crafted ranges..."
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A574]"
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-200 mb-4">Homepage Section 3 (Art of Pure Beauty)</h2>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {['imageone', 'imagetwo', 'imagethree'].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-400 capitalize">{field.replace('image', 'Image ')}</label>
                    <div className="relative group aspect-square rounded-lg border-2 border-dashed border-neutral-800 bg-neutral-950 flex flex-col items-center justify-center overflow-hidden hover:border-[#D4A574]/50 transition-colors">
                      {previews[field as keyof typeof previews] || (formData.homepagesection2 as any)?.[field] ? (
                        <>
                          <img
                            src={previews[field as keyof typeof previews] || (formData.homepagesection2 as any)?.[field]}
                            alt={field}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <FiUpload className="text-white w-6 h-6" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-neutral-600">
                          <FiImage className="w-8 h-8 mb-2" />
                          <span className="text-xs">Upload</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileChange(field as any, e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-200 mb-4">Homepage Section 4 (Featured Collection)</h2>
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