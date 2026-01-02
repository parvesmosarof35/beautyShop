'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaSearch, FaChevronDown, FaChevronUp, FaHeadphones, FaComment, FaEnvelope } from 'react-icons/fa';
// import { useGetAllFaqQuery } from '@/app/store/api/faqApi';

export default function FAQContent({ faqs = [] }: { faqs?: any[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // const { data: faqData, isLoading, isError } = useGetAllFaqQuery({ searchTerm: 'general', page: 1, limit: 50 });
  // const faqs = faqData?.data?.allFaqList || []; 

  // if (isLoading) {
  //   return <div className="text-center py-20 text-gray-400">Loading FAQs...</div>;
  // }
  
  // if (isError) {
  //   return <div className="text-center py-20 text-red-500">Failed to load FAQs.</div>;
  // }

  const filteredFaqs = faqs.filter((faq: any) => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#171717]">
      {/* Header Section */}
      <div className="bg-[#383838] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Find answers to common questions about our products, services, and policies.
          </p>
          
          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full py-4 pl-12 pr-6 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-100 mb-2">General Questions</h2>
          <p className="text-gray-100">Most frequently asked questions about our services</p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center bg-[#383838] hover:bg-[#171717] transition-colors"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-medium text-gray-100">{faq.question}</span>
                {activeIndex === index ? (
                  <FaChevronUp className="text-[#d4a574]" />
                ) : (
                  <FaChevronDown className="text-[#d4a574]" />
                )}
              </button>
              {activeIndex === index && (
                <div className="px-6 py-4 bg-[#171717]">
                  <p className="text-gray-100">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#383838] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-[#171717] rounded-2xl shadow-sm p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-[#d4a574] rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHeadphones className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-3">Still Have Questions?</h2>
          <p className="text-gray-100 max-w-2xl mx-auto mb-8">
            Can't find the answer you're looking for? Our support team is here to help you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
          
            <Link href="/contact">
            <button className="border border-[#d4a574] text-[#d4a574]  px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
              <FaEnvelope /> Email Support
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
