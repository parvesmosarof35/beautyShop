import { getBaseUrl } from '@/app/store/config/envConfig';

async function getPrivacy() {
  try {
    const res = await fetch(`${getBaseUrl()}setting/find_by_privacy_policyss`, {
      next: { tags: ['privacy'] },
      cache: 'force-cache'
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.error('Failed to fetch privacy policy:', error);
    return null;
  }
}

export default async function PrivacyPolicy() {
  const privacyData = await getPrivacy();
  
  return (
    <div className="min-h-screen bg-[#171717] text-gray-100">
      
      {/* Hero Section */}
      <div className="bg-[#383838] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-white">Privacy Policy</h1>
          <p className="text-lg max-w-3xl mx-auto text-gray-300">
             Our commitment to your privacy
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
         <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <div dangerouslySetInnerHTML={{ __html: privacyData?.PrivacyPolicy || '<p>No privacy policy content available.</p>' }} />
         </div>
      </div>

    </div>
  );
}