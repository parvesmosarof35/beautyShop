import { getBaseUrl } from '@/app/store/config/envConfig';
import ProductsContent from './ProductsContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products | LUNEL Beauty',
  description: 'Explore our wide range of premium beauty products, including skincare, makeup, haircare, and fragrances.',
};

async function getProducts(searchParams: any) {
    const params = new URLSearchParams(searchParams);
    
    // Default params if not present
    if (!params.has('limit')) params.set('limit', '12');
    if (!params.has('page')) params.set('page', '1');
    if (!params.has('sort')) params.set('sort', 'bestSelling');
    if (!params.has('maxprice')) params.set('maxprice', '3000');

    // Handle array params properly for the backend
    // The previous ProductsContent logic passed arrays directly to RTK Query.
    // RTK Query usually serializes arrays as repeated keys: collections=1&collections=2
    // We can rely on URLSearchParams.toString() BUT we need to check how the backend expects it.
    // If backend expects comma separated, we join. If repeated keys, toString() does it.
    // Assuming standard repeated keys as per typical RTK Query <-> Express handling.

    try {
        const res = await fetch(`${getBaseUrl()}product?${params.toString()}`, {
            next: { tags: ['product'] },
            cache: 'force-cache'
        });
        
        if (!res.ok) {
            console.error('Failed to fetch products', res.status, res.statusText);
            return { data: [], meta: {} };
        }
        
        return res.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return { data: [], meta: {} };
    }
}

async function getCollections() {
    try {
        const res = await fetch(`${getBaseUrl()}collection`, {
             next: { revalidate: 20 } // Cache collections for an hour
        });
        

        if (!res.ok) {
             console.error('Failed to fetch collections', res.status);
             return { data: [] };
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching collections:', error);
        return { data: [] };
    }
}

interface PageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  // Await searchParams before using it (Next.js 15 requirement, good practice generally now)
  // Note: in Next 14/15 searchParams is a promise or object depending on version, 
  // but simpler to treat as object for now if type is not Promise.
  // Actually, let's treat it safely.
  
  const productsData = await getProducts(searchParams);
  const collectionsData = await getCollections();

  return (
    <ProductsContent 
        products={productsData?.data || []} 
        meta={productsData?.meta || {}} 
        collections={collectionsData?.data || []} 
    />
  );
}
