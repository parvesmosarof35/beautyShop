import BlogContent from './BlogContent';
import { Metadata } from 'next';
import { getBaseUrl } from '@/app/store/config/envConfig';

export const metadata: Metadata = {
  title: 'Blog | LUNEL Beauty',
  description: 'Read the latest insights on beauty, skincare routines, and ingredient science from LUNEL Beauty experts.',
};

async function getBlogs(page: number = 1, searchTerm: string = '') {
  const params = new URLSearchParams();
  params.set('searchTerm', searchTerm);
  params.set('page', page.toString());
  params.set('limit', '9');

  // Sort params to ensure consistent cache keys
  params.sort();

  try {
    const res = await fetch(`${getBaseUrl()}blogs/find_by_all_blogs?${params.toString()}`, {
      next: { tags: ['blog'] },
      cache: 'force-cache'
    });
    
    if (!res.ok) return { allBlogs: [], meta: null };
    
    const data = await res.json();
    return {
        allBlogs: data?.data?.allBlogsList || [],
        meta: data?.data?.meta
    };
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return { allBlogs: [], meta: null };
  }
}

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string, searchTerm?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1;
  const searchTerm = resolvedSearchParams.searchTerm || '';
  const { allBlogs, meta } = await getBlogs(page, searchTerm);
  return <BlogContent allBlogs={allBlogs} meta={meta} currentPage={page} />;
}