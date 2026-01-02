import AboutPageContent from './AboutPageContent';
import { Metadata } from 'next';
import { getBaseUrl } from '@/app/store/config/envConfig';

export const metadata: Metadata = {
  title: 'About Us | LUNEL Beauty',
  description: 'Learn about the LUNEL Beauty story, our mission for clean beauty, and our commitment to sustainable and effective skincare products.',
};

async function getAboutUs() {
  try {
    const res = await fetch(`${getBaseUrl()}setting/find_by_about_us`, {
      next: { tags: ['aboutUs'] },
      cache: 'force-cache'
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.error('Failed to fetch about us:', error);
    return null;
  }
}

export default async function AboutPage() {
  const aboutData = await getAboutUs();
  return <AboutPageContent aboutUsContent={aboutData?.aboutUs} />;
}