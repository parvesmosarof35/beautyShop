'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Collection {
    _id: string;
    name: string;
    slug: string;
    image_url: string;
}

const CollectionSection = ({ collections = [], title, subtitle }: { collections?: Collection[], title?: string, subtitle?: string }) => {
    return (
        <section className="py-24 bg-[#3b3b3b] overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center mb-16 gap-6 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-6xl text-white font-serif font-medium mb-6 leading-tight">
                            {title || "Curated Collections"} <br />
                        </h2>
                        <p className="text-lg text-neutral-300 font-serif leading-relaxed">
                            {subtitle || "Explore our meticulously crafted ranges, each designed to address specific needs while providing a sensory experience of pure luxury."}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                    {collections.slice(0, 4).map((collection) => (
                        <Link
                            key={collection._id}
                            href={`/products?collections=${collection._id}`}
                            className="group relative overflow-hidden bg-neutral-900 aspect-square rounded-2xl transition-transform duration-700 hover:-translate-y-2"
                        >
                            <Image
                                src={collection.image_url || 'https://images.unsplash.com/photo-1596462502278-27bf8737523c?auto=format&fit=crop&q=80'}
                                alt={collection.name}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                                <div className="overflow-hidden">
                                    <h3 className="text-2xl text-white font-medium mb-2 transform transition-all duration-500 translate-y-0 group-hover:translate-y-0">
                                        {collection.name}
                                    </h3>
                                </div>
                                <div className="h-0 group-hover:h-8 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                                    <span className="text-white/80 text-sm uppercase tracking-widest font-sans flex items-center gap-2">
                                        Shop Collection <ChevronRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>

                            {/* Decorative Corner */}
                            <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/20 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:top-6 group-hover:right-6" />
                        </Link>
                    ))}
                </div>

                {/* Masonry or second row of collections if more than 4 */}
                {collections.length > 4 && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 mt-4 md:mt-24">
                        {collections.slice(4, 7).map((collection) => (
                            <Link
                                key={collection._id}
                                href={`/products?collections=${collection._id}`}
                                className="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-900 transition-all duration-700"
                            >
                                <Image
                                    src={collection.image_url}
                                    alt={collection.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                    <h3 className="text-3xl text-white font-medium mb-4 drop-shadow-md transform transition-all duration-500 group-hover:scale-110">
                                        {collection.name}
                                    </h3>
                                    <div className="w-12 h-[1px] bg-white transform transition-all duration-500 group-hover:w-24" />
                                    <span className="mt-6 text-white text-xs uppercase tracking-[0.2em] font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        Discover More
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CollectionSection;
