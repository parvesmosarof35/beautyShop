import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';

interface PageHeadingProps {
  title: string;
  subtitle?: string;
}

function PageHeading({ title, subtitle }: PageHeadingProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
    </div>
  );
}

export default PageHeading;
