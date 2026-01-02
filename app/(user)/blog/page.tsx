import BlogContent from './BlogContent';
import { Metadata } from 'next';
import { getBaseUrl } from '@/app/store/config/envConfig';

export const metadata: Metadata = {
  title: 'Blog | LUNEL Beauty',
  description: 'Read the latest insights on beauty, skincare routines, and ingredient science from LUNEL Beauty experts.',
};

async function getBlogs(page: number = 1, searchTerm: string = '') {
  try {
    const res = await fetch(`${getBaseUrl()}blogs/find_by_all_blogs?searchTerm=${searchTerm}&page=${page}&limit=9`, {
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

export default async function BlogPage({ searchParams }: { searchParams: { page?: string, searchTerm?: string } }) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const searchTerm = searchParams.searchTerm || '';
  const { allBlogs, meta } = await getBlogs(page, searchTerm);
  return <BlogContent allBlogs={allBlogs} meta={meta} currentPage={page} />;
}