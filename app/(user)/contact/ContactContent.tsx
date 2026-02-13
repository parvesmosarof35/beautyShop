'use client';

import { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaTiktok,FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { useCreateContactMutation } from '@/app/store/api/contactApi';
import { useGetSettingsQuery } from '@/app/store/api/settingsApi';
import Swal from 'sweetalert2';

export default function ContactContent() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
    });

    const { data: settingsData } = useGetSettingsQuery({});
    const settings = settingsData?.data || {};

    const socialLinks = [
        { 
            name: 'Instagram', 
            href: settings.instagram?.url || '#', 
            icon: <FaInstagram />,
            isActive: settings.instagram?.isActive ?? true
        },
        { 
            name: 'Facebook', 
            href: settings.facebook?.url || '#', 
            icon: <FaFacebookF />,
            isActive: settings.facebook?.isActive ?? true
        },
        { 
            name: 'TikTok', 
            href: settings.tiktok?.url || '#', 
            icon: <FaTiktok />,
            isActive: settings.tiktok?.isActive ?? false
        },
        { 
            name: 'Twitter', 
            href: settings.twitterx?.url || '#', 
            icon: <FaXTwitter />,
            isActive: settings.twitterx?.isActive ?? true
        },
        { 
            name: 'WhatsApp', 
            href: settings.whatsapp?.url || '#', 
            icon: <FaWhatsapp />,
            isActive: settings.whatsapp?.isActive ?? true
        },
    ];

    const [createContact, { isLoading }] = useCreateContactMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const payload = {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                question: formData.subject ? `[${formData.subject}] ${formData.message}` : formData.message
            };

            const res = await createContact(payload).unwrap();

            if (res) {
                Swal.fire({
                    icon: 'success',
                    title: 'Message Sent!',
                    text: 'We have received your message and will get back to you shortly.',
                    background: '#171717',
                    color: '#fff',
                    confirmButtonColor: '#D4A574'
                });
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Sending Failed',
                text: error?.data?.message || 'Something went wrong. Please try again later.',
                background: '#171717',
                color: '#fff',
                confirmButtonColor: '#D4A574'
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#171717]">
            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-100 mb-4">Get in Touch</h1>
                    <p className="text-lg text-gray-100 max-w-2xl mx-auto">
                        We're here to help and answer any question you might have. We look forward to hearing from you.
                    </p>
                </div>

                <div className="bg-[#383838] rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Contact Form */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-100 mb-6">Send us a message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="First Name"
                                            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Last Name"
                                            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                                        required
                                    >
                                        <option value="" disabled hidden>Select Subject</option>
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Support">Support</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="Feedback">Feedback</option>
                                    </select>
                                </div>
                                <div>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="Write your message here..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#D4A574] text-white py-3 px-6 rounded-md transition duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? 'Sending...' : (
                                        <>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 transform rotate-60"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                style={{ transform: 'rotate(60deg)' }}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                />
                                            </svg>
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-100 mb-6">Contact Information</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-[#d4a674] p-3 rounded-full">
                                            <FaMapMarkerAlt className="h-5 w-5 text-gray-100" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-100">Our Location</h3>
                                            <p className="text-gray-100">
                                                {/* 123 Business Street, Suite 100<br />New York, NY 10001 */}
                                                {settings.address?.url || '123 Business Street, Suite 100, New York, NY 10001'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-[#d4a674] p-3 rounded-full">
                                            <FaPhoneAlt className="h-5 w-5 text-gray-100" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-100">Phone Number</h3>
                                            <p className="text-gray-100">
                                                {/* +1 (555) 123-4567<br />+1 (555) 987-6543 */}
                                                {settings.phone?.url || '+1 (555) 123-4567'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-[#d4a674] p-3 rounded-full">
                                            <FaEnvelope className="h-5 w-5 text-gray-100" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-100">Email Address</h3>
                                            <p className="text-gray-100">
                                                {/* info@example.com<br />support@example.com */}
                                                {settings.email?.url || 'info@example.com'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-medium text-gray-100 mb-4">Follow Us</h3>
                                <div className="flex space-x-4">
                                    {socialLinks.map((social) => (
                                        social.isActive && (
                                            <a
                                                key={social.name}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-gray-100 p-3 rounded-full text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
                                            >
                                                {social.icon}
                                            </a>
                                        )
                                    ))}
                                </div>
                            </div>

                            {/* <div className="bg-[#d4a574] p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-black mb-2 font-bold">Quick Response</h3>
                                <p className="text-black mb-4">We typically respond to all inquiries within 24 hours on business days.</p>
                                <p className="text-sm text-black">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                <p className="text-sm text-black">Saturday - Sunday: Closed</p>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            </main>
          
        </div>
    );
}
