import { FiCalendar, FiUser, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getBaseUrl } from '@/app/store/config/envConfig';

type Props = {
  params: Promise<{ id: string }>
};

async function getBlog(id: string) {
  try {
    const res = await fetch(`${getBaseUrl()}blogs/find_by_specific_blogs/${id}`, {
      next: { tags: ['blog'] },
      cache: 'force-cache'
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.error('Failed to fetch blog:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlog(id);
  
  if (!blog) {
    return {
      title: 'Blog Not Found | LUNEL Beauty',
    };
  }
  
  return {
    title: `${blog.blogTitle} | LUNEL Beauty`,
    description: blog.content?.substring(0, 160) || 'Read our latest blog post.',
  };
}

export default async function BlogDetails({ params }: Props) {
    const { id } = await params;
    const blog = await getBlog(id);

    if (!blog) {
         return (
            <div className="min-h-screen bg-[#171717] flex flex-col justify-center items-center text-gray-300">
                <h2 className="text-2xl font-bold mb-4">Blog not found</h2>
                <Link href="/blog" className="text-[#D4A574] hover:underline flex items-center gap-2">
                    <FiArrowLeft /> Back to Blogs
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#171717] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-[#D4A574] transition-colors mb-8">
                    <FiArrowLeft className="mr-2" /> Back to Blogs
                </Link>

                <article className="bg-[#262626] border border-[#333] rounded-2xl overflow-hidden shadow-xl">
                    <div className="relative h-64 md:h-96 w-full">
                        <Image
                            src={blog.photo || 'https://via.placeholder.com/800x600?text=No+Image'}
                            alt={blog.blogTitle}
                            fill
                            className="object-cover"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-[#262626] via-transparent to-transparent opacity-60" />
                    </div>

                    <div className="p-8 md:p-12">
                         <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
                            <span className="flex items-center gap-2">
                                <FiCalendar className="w-4 h-4 text-[#D4A574]" />
                                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                            </span>
                             {blog.adminId && (
                                <span className="flex items-center gap-2">
                                     <FiUser className="w-4 h-4 text-[#D4A574]" />
                                     {blog.adminId.fullname || "Admin"}
                                </span>
                             )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-8 leading-tight">
                            {blog.blogTitle}
                        </h1>

                        <div
                            className="prose prose-invert prose-lg max-w-none text-gray-300 prose-headings:text-gray-100 prose-a:text-[#D4A574] prose-strong:text-white prose-img:rounded-xl"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </div>
                </article>
            </div>
        </div>
    );
}
