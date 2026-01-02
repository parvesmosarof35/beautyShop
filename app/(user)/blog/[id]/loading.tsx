import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#171717] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-[#D4A574] transition-colors mb-8 pointer-events-none">
            <FiArrowLeft className="mr-2" /> Back to Blogs
        </Link>

        <article className="bg-[#262626] border border-[#333] rounded-2xl overflow-hidden shadow-xl animate-pulse">
          {/* Image Skeleton */}
          <div className="h-64 md:h-96 w-full bg-[#333]"></div>

          <div className="p-8 md:p-12">
            {/* Meta Skeleton */}
            <div className="flex items-center gap-6 mb-6">
              <div className="h-4 w-32 bg-[#333] rounded"></div>
              <div className="h-4 w-24 bg-[#333] rounded"></div>
            </div>

            {/* Title Skeleton */}
            <div className="h-10 w-3/4 bg-[#333] rounded mb-8"></div>

            {/* Content Skeleton */}
            <div className="space-y-4">
              <div className="h-4 w-full bg-[#333] rounded"></div>
              <div className="h-4 w-full bg-[#333] rounded"></div>
              <div className="h-4 w-5/6 bg-[#333] rounded"></div>
              <div className="h-4 w-full bg-[#333] rounded"></div>
              <div className="h-32 w-full bg-[#333] rounded my-8"></div>
              <div className="h-4 w-full bg-[#333] rounded"></div>
              <div className="h-4 w-4/5 bg-[#333] rounded"></div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
