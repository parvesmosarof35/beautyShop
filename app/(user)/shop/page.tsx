import ShopContent from './ShopContent';
import { Metadata } from 'next';
import { getBaseUrl } from '@/app/store/config/envConfig';

export const metadata: Metadata = {
  title: 'Shop | LUNEL Beauty',
  description: 'Shop our full collection of beauty products. Find your perfect match in skincare, makeup, and more.',
};

async function getProducts(searchParams: any) {
  const params = new URLSearchParams();

  // Set defaults
  if (!searchParams.limit) params.set('limit', '12');
  else params.set('limit', searchParams.limit);

  if (!searchParams.page) params.set('page', '1');
  else params.set('page', searchParams.page);

  if (!searchParams.sort) params.set('sort', 'bestSelling');
  else params.set('sort', getBackendSort(searchParams.sort));

  if (searchParams.collection) {
    params.append('collections', searchParams.collection);
  }

  // Sort params to ensure consistent cache keys
  params.sort();

  try {
    const res = await fetch(`${getBaseUrl()}product?${params.toString()}`, {
      next: { tags: ['product'] },
      cache: 'force-cache'
    });
    
    if (!res.ok) return { products: [], meta: null };
    
    const data = await res.json();
    return {
        products: data?.data || [],
        meta: data?.meta
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { products: [], meta: null };
  }
}

async function getCollections() {
  try {
    const res = await fetch(`${getBaseUrl()}collection`, {
      next: { tags: ['collection'] },
      cache: 'force-cache'
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    return [];
  }
}

// Helper to map frontend sort to backend sort keys (duplicated from ShopContent for server usage)
const getBackendSort = (sort: string) => {
  switch (sort) {
    case 'price-low': return 'priceLowToHigh';
    case 'price-high': return 'priceHighToLow';
    case 'rating': return 'bestRating';
    case 'newest': return 'newest';
    case 'popularity': return 'bestSelling';
    default: return 'bestSelling';
  }
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ page?: string, sort?: string, collection?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const { products, meta } = await getProducts(resolvedSearchParams);
  const collections = await getCollections();
  
  return (
    <ShopContent 
      initialProducts={products} 
      initialMeta={meta} 
      collections={collections}
      initialParams={resolvedSearchParams}
    />
  );
}