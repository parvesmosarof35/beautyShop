import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
const socialLinks = [
    { name: 'Instagram', href: '#', icon: <FaInstagram /> },
    { name: 'Facebook', href: '#', icon: <FaFacebookF /> },
    { name: 'TikTok', href: '#', icon: <FaTiktok /> },
    { name: 'X', href: '#', icon: <FaXTwitter /> },
];

const footerLinks = [
    {
        title: 'Shop',
        links: [
            { name: 'All Products', href: '/products' },
            { name: 'Latest Arrivals', href: '/shop' },
            { name: 'Best Sellers', href: '/shop?limit=12&page=1&sort=popularity' },
            // { name: 'My Wishlist', href: '/wishlist' },
            // { name: 'My Cart', href: '/cart' },
        ],
    },
    {
        title: 'About',
        links: [
            { name: 'About Us', href: '/about' },
            { name: 'Blog', href: '/blog?limit=9&page=1&searchTerm=' },
            { name: 'Contact Us', href: '/contact' },
        ],
    },
    {
        title: 'Support',
        links: [
            { name: 'FAQs', href: '/faq' },
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms & Conditions', href: '/terms' },
            { name: 'Cookies', href: '/cookies' },
        ],
    },
];

const Footer = () => {
    return (
        <footer className="bg-[#1a1a1a] text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-6">
                            <Link href="/">
                            <div className="relative w-40 h-14 md:w-48 md:h-16 mr-3">
                                    
                                <Image
                                    src="/images/logo.png"
                                    alt="Lunel Beauty"
                                    fill
                                    sizes="(max-width: 768px) 10rem, 12rem"
                                    className="object-contain"
                                />
                            </div>
                            </Link>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Elevating beauty through the art of pure, natural skincare.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="flex items-center justify-center w-10 h-10 rounded-full border border-white text-white hover:bg-white hover:text-gray-900 transition-colors"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href}>
                                            <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                                                {link.name}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-center items-center">
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} Lunel Inc. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        {/* <Link href="/privacy">
                            <span className="text-gray-400 hover:text-white text-sm cursor-pointer">
                                Privacy Policy
                            </span>
                        </Link>
                        <Link href="/terms">
                            <span className="text-gray-400 hover:text-white text-sm cursor-pointer">
                                Terms of Service
                            </span>
                        </Link> */}
                        {/* <Link href="/cookies">
                            <span className="text-gray-400 hover:text-white text-sm cursor-pointer">
                                Cookies
                            </span>
                        </Link> */}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
