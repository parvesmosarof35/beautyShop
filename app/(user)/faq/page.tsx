import FAQContent from './FAQContent';
import { Metadata } from 'next';
import { getBaseUrl } from '@/app/store/config/envConfig';

export const metadata: Metadata = {
  title: 'FAQ | LUNEL Beauty',
  description: 'Find answers to frequently asked questions about LUNEL Beauty products, shipping, orders, and returns.',
};

async function getFaqs() {
  try {
    const res = await fetch(`${getBaseUrl()}faq/findB_by_all_faq?searchTerm=general&page=1&limit=50`, {
      next: { tags: ['faq'] },
      cache: 'force-cache'
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data?.data?.allFaqList || [];
  } catch (error) {
    console.error('Failed to fetch FAQs:', error);
    return [];
  }
}

export default async function FAQPage() {
  const faqs = await getFaqs();
  return <FAQContent faqs={faqs} />;
}