import dynamic from 'next/dynamic';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | LUNEL Beauty',
  description: 'Welcome to LUNEL Beauty - Discover our premium collection of skincare, makeup, and wellness products designed to enhance your natural beauty.',
  openGraph: {
    title: 'Home | LUNEL Beauty',
    description: 'Welcome to LUNEL Beauty - Discover our premium collection of skincare, makeup, and wellness products.',
  },
};

// Import components with dynamic imports for better performance
const HeroSection = dynamic(() => import('../components/HeroSection'), { ssr: true });
const ArtOfPureBeauty = dynamic(() => import('../components/ArtOfPureBeauty'), { ssr: true });
const FeaturedCollection = dynamic(() => import('../components/FeaturedCollection'), { ssr: true });
const LunelPromise = dynamic(() => import('../components/LunelPromise'), { ssr: true });
import { getBaseUrl } from '../store/config/envConfig';

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${getBaseUrl()}product/getfeaturedproducts`, {
      next: { tags: ['featured-products'] },
      cache: 'force-cache'
    });
    
    if (!res.ok) {
        // Fallback or empty array if fetch fails
        return [];
    }
    
    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <>
      <HeroSection />
      <ArtOfPureBeauty />
      <FeaturedCollection products={products} />
      <LunelPromise />
    </>
  );
}