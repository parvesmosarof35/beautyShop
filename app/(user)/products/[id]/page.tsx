import ProductDetailsContent from './ProductDetailsContent';
import { Metadata } from 'next';
import { getBaseUrl } from '@/app/store/config/envConfig';

type Props = {
  params: Promise<{ id: string }>
};

// Fetch single product
async function getProduct(id: string) {
  try {
    const res = await fetch(`${getBaseUrl()}product/${id}`, {
      next: { tags: ['product'] },
      cache: 'force-cache'
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

// Fetch related products
async function getRelatedProducts(id: string) {
  try {
    const res = await fetch(`${getBaseUrl()}product/getrelatedproducts/${id}?page=1&limit=3`, {
       next: { tags: ['product'] },
       cache: 'force-cache'
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error('Failed to fetch related products:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: 'Product Not Found | LUNEL Beauty',
    };
  }
  
  return {
    title: `${product.name} | LUNEL Beauty`,
    description: product.description?.substring(0, 160) || 'Shop this amazing product at LUNEL Beauty.',
    openGraph: {
        images: product.images_urls?.[0] ? [product.images_urls[0]] : []
    }
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  const relatedProducts = await getRelatedProducts(id);

  if (!product) {
      // We can also let the Client Component handle the 'not found' state better or return 404 here
      // But passing null to Client Component allows keeping consistent layout if desired
      // For now, let's keep consistent with valid return type for props
       return <ProductDetailsContent product={null} relatedProducts={[]} />;
  }

  return (
    <ProductDetailsContent 
        product={product} 
        relatedProducts={relatedProducts} 
    />
  );
}
