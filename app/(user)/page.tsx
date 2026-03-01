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

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

// Import components with dynamic imports for better performance
const HeroSection = dynamic(() => import('../components/HeroSection'), { ssr: true });
const ArtOfPureBeauty = dynamic(() => import('../components/ArtOfPureBeauty'), { ssr: true });
const FeaturedCollection = dynamic(() => import('../components/FeaturedCollection'), { ssr: true });
const LunelPromise = dynamic(() => import('../components/LunelPromise'), { ssr: true });
const CollectionSection = dynamic(() => import('../components/CollectionSection'), { ssr: true });
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

async function getCollections() {
  try {
    const res = await fetch(`${getBaseUrl()}collection?limit=100`, {
      next: { tags: ['collections'] },
      cache: 'force-cache'
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    return [];
  }
}

async function getSettings() {
  try {
    const res = await fetch(`${getBaseUrl()}setting/find_by_socal_media_links_address_phone_email_texts`, {
      next: { tags: ['settings'] },
      cache: 'force-cache'
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data?.data || null;
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return null;
  }
}

export default async function Home() {
  const [products, collections, settings] = await Promise.all([
    getFeaturedProducts(),
    getCollections(),
    getSettings()
  ]);

  const collectionSettings = settings?.homepageCollections || {};

  return (
    <>
      <HeroSection />
      <CollectionSection
        collections={collections}
        title={collectionSettings.title}
        subtitle={collectionSettings.subtitle}
      />
      <ArtOfPureBeauty />
      <FeaturedCollection products={products} />
      <LunelPromise />
    </>
  );
}