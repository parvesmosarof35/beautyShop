'use client';

import { FaLeaf, FaHeart, FaFlask, FaRecycle, FaSearch, FaUsers, FaVial } from 'react-icons/fa';
import Image from 'next/image';
const AboutPageContent = ({ aboutUsContent }: { aboutUsContent: string }) => {
    
    return (
        <div className="bg-white">
            
            {/* Hero Section */}
            <section className="relative h-[70vh] w-full">
                <div className="absolute inset-0">
                    <Image
                        src="/images/a-hero.png"
                        alt="Lunel Beauty"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
                <div className="relative z-10 h-full flex items-center">
                    <div className="container mx-auto px-4 text-center text-white">
                        <h1 className="text-5xl md:text-6xl font-serif font-light mb-6">About Lunel</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto">Crafting beauty with nature's finest ingredients since 2015</p>
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-20 bg-[#1a1a1a] text-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-start gap-12">
                        {/* Left Column - Text Content (Dynamic) */}
                        <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
                                <div className="prose prose-invert prose-lg text-gray-300">
                                   <div dangerouslySetInnerHTML={{ __html: aboutUsContent || '<p>About us content comming soon.</p>' }} />
                                </div>

                             {/* Stats Section - Keeping static as it's layout specific, unless API provides it? Assuming text only for now. */}
                            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-800">
                                <div>
                                    <p className="text-4xl font-bold text-[#d4a674]">98%</p>
                                    <p className="text-base text-gray-400">Natural Ingredients</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-bold text-[#d4a674]">5+</p>
                                    <p className="text-base text-gray-400">Years Research</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-bold text-[#d4a674]">50K+</p>
                                    <p className="text-base text-gray-400">Happy Customers</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Image */}
                        <div className="md:w-2/5 h-[600px] relative rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 sticky top-24">
                            <Image
                                src="/images/a1.png"
                                alt="Lumière Dermatology Skincare Products"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>
           

            {/* Mission & Values */}
            {/* Our Values Section */}
            <section className="py-20 bg-black text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <p className="text-amber-200 text-lg mb-3">Our Values</p>
                        <h2 className="text-4xl md:text-5xl font-serif font-light">What Drives Us Forward</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {/* Clean Ingredients */}
                        <div className="bg-[#1a1a1a] p-8 rounded-lg text-center transition-transform duration-300 hover:scale-105">
                            <div className="w-16 h-16 rounded-full bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium mb-3">Clean Ingredients</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">We use only the purest, most effective ingredients nature has to offer.</p>
                        </div>

                        {/* Research-Based */}
                        <div className="bg-[#1a1a1a] p-8 rounded-lg text-center transition-transform duration-300 hover:scale-105">
                            <div className="w-16 h-16 rounded-full bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium mb-3">Research-Based</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">Every formula is backed by extensive scientific research and testing.</p>
                        </div>

                        {/* Eco Conscious */}
                        <div className="bg-[#1a1a1a] p-8 rounded-lg text-center transition-transform duration-300 hover:scale-105">
                            <div className="w-16 h-16 rounded-full bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium mb-3">Eco Conscious</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">We're committed to sustainability and reducing our environmental impact.</p>
                        </div>

                        {/* Inclusive Beauty */}
                        <div className="bg-[#1a1a1a] p-8 rounded-lg text-center transition-transform duration-300 hover:scale-105">
                            <div className="w-16 h-16 rounded-full bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium mb-3">Inclusive Beauty</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">We celebrate diversity and create products for all skin types and tones.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience The Difference Section */}
            <section className="py-20 bg-black text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">
                        Experience The <span className="text-[#d4a674]">Difference</span>
                    </h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join thousands who have discovered the perfect balance of science and nature. Your skin deserves the best.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-[#d4a674] text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-[#d4a674]/10 transition-colors duration-300">
                            Shop Now
                        </button>
                        <button className="border-2 border-[#d4a674] text-[#d4a674] px-8 py-3 rounded-full font-medium hover:bg-[#d4a674]/10 transition-colors duration-300">
                            Contact Us
                        </button>
                    </div>
                </div>
            </section>
            
                                      
        </div>
    );
};

export default AboutPageContent;
