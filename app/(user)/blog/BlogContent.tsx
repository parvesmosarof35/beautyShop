'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogContent({ allBlogs = [], meta, currentPage = 1 }: { allBlogs?: any[], meta?: any, currentPage?: number }) {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Debounce search to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
        if (searchTerm) {
            router.push(`/blog?searchTerm=${searchTerm}&page=1`);
        }
    }, 500);
    if (!searchTerm) {
        router.push(`/blog?page=1`);
    }
    return () => clearTimeout(timer);
  }, [searchTerm, router]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-[#171717] py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-100 mb-4">Latest Insights</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          Discover expert advice, industry trends, and the latest updates from our team.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchTerm}
                onChange={handleSearch}
                className="w-full bg-[#262626] border border-[#333] text-gray-200 rounded-full pl-12 pr-6 py-3 focus:outline-none focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574] transition-all"
            />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {allBlogs.length === 0 ? (
            <div className="text-center py-16 bg-[#262626] rounded-2xl border border-[#333]">
                <h3 className="text-xl font-medium text-gray-300">No articles found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allBlogs.map((blog: any) => (
                    <Link href={`/blog/${blog._id}`} key={blog._id} className="group flex flex-col h-full">
                        <article className="bg-[#262626] border border-[#333] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-[#D4A574]/30 h-full flex flex-col">
                            <div className="relative h-56 w-full overflow-hidden">
                                <Image 
                                    src={blog.photo || 'https://via.placeholder.com/800x600?text=No+Image'} 
                                    alt={blog.blogTitle}
                                    fill
                                    className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                            </div>
                            
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                    <span className="flex items-center gap-1">
                                        <FiCalendar className="w-3.5 h-3.5" />
                                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                
                                <h2 className="text-xl font-bold text-gray-100 mb-3 line-clamp-2 group-hover:text-[#D4A574] transition-colors">
                                    {blog.blogTitle}
                                </h2>
                                
                                <div className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow" dangerouslySetInnerHTML={{ __html: blog.content }} />
                                
                                <div className="mt-auto pt-4 border-t border-[#333]">
                                    <span className="text-[#D4A574] text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                                        Read More <FiArrowRight />
                                    </span>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        )}

        {meta && meta.totalPage > 1 && (
            <div className="mt-12 flex justify-center gap-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => router.push(`/blog?page=${currentPage - 1}`)}
                    className="px-4 py-2 bg-[#262626] text-gray-300 rounded-lg hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>
                <div className="flex items-center px-4 text-gray-500 font-medium">
                    Page {currentPage} of {meta.totalPage}
                </div>
                <button
                    disabled={currentPage === meta.totalPage}
                    onClick={() => router.push(`/blog?page=${currentPage + 1}`)}
                    className="px-4 py-2 bg-[#262626] text-gray-300 rounded-lg hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
