'use client';

import React, { useState, useEffect } from 'react';
import { useGetSettingsQuery } from '@/app/store/api/settingsApi';
import { useSubscribeMutation } from '@/app/store/api/subscriberApi';
import Swal from 'sweetalert2';
import { FiX } from 'react-icons/fi';

export default function Popup() {
  const { data: settingsData } = useGetSettingsQuery({});
  const [subscribe, { isLoading }] = useSubscribeMutation();
  
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');

  const popuptext = settingsData?.socialMediaLinksAddressPhoneEmailTexts?.popuptext || settingsData?.popuptext;

  useEffect(() => {
    // Only show if the popup is active in settings
    if (popuptext && popuptext.isActive) {
      // Check if user has already successfully subscribed
      if (localStorage.getItem('is_subscribed') === 'true') {
        return;
      }

      // Check if the popup was dismissed recently (within 10 days)
      const dismissedUntil = localStorage.getItem('popup_dismissed_until');
      if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
        return;
      }

      // Show after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [popuptext]);

  const handleClose = () => {
    setIsVisible(false);
    // Set dismissal time for 10 days in the future
    const tenDaysFromNow = Date.now() + 10 * 24 * 60 * 60 * 1000;
    localStorage.setItem('popup_dismissed_until', tenDaysFromNow.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    try {
      const res = await subscribe({ email }).unwrap();
      
      if (res?.success) {
        // Mark as successfully subscribed so they never see it again
        localStorage.setItem('is_subscribed', 'true');
        
        Swal.fire({
          icon: 'success',
          title: 'Subscribed!',
          text: 'Thank you for subscribing to our newsletter.',
          background: '#171717',
          color: '#fff',
          confirmButtonColor: '#D4A574'
        });
        setIsVisible(false); // Hide without setting the 10-day snooze
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err?.data?.message || 'Failed to subscribe',
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
    }
  };

  if (!isVisible || !popuptext) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-scale-up">
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors z-10 bg-neutral-800/50 p-1.5 rounded-full"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-[#D4A574]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4A574]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            {popuptext.title || 'Subscribe to get exclusive offers upto 30% off'}
          </h2>
          <p className="text-neutral-400 mb-8">
            {popuptext.subtitle || 'Get the latest updates and offers directly to your inbox.'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full bg-neutral-800 border border-neutral-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574] transition-all"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D4A574] hover:bg-[#b88b5c] text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Subscribe Now'
              )}
            </button>
          </form>
          
          <button 
            onClick={handleClose}
            className="mt-6 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
