'use client';

import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';

type FilterState = {
  collections: string[];
  priceRange: [number, number];
  skinTypes: string[];
  ingredients: string[];
};

type FilterComponentProps = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  sortBy: string;
  setSortBy: (value: string) => void;
  collections: any[];
  skinTypes: string[];
  ingredients: string[];
  showMobileFilters: boolean;
  setShowMobileFilters: (value: boolean) => void;
};

export default function FilterComponent({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  collections,
  skinTypes,
  ingredients,
  showMobileFilters,
  setShowMobileFilters
}: FilterComponentProps) {

  const handleCollectionChange = (collectionId: string) => {
    setFilters(prev => ({
      ...prev,
      collections: prev.collections.includes(collectionId)
        ? []
        : [collectionId],
    }));
  };

  const handleSkinTypeChange = (skinType: string) => {
    setFilters(prev => ({
      ...prev,
      skinTypes: prev.skinTypes.includes(skinType)
        ? prev.skinTypes.filter(t => t !== skinType)
        : [...prev.skinTypes, skinType],
    }));
  };

  const handleIngredientChange = (ingredient: string) => {
    setFilters(prev => ({
      ...prev,
      ingredients: prev.ingredients.includes(ingredient)
        ? prev.ingredients.filter(i => i !== ingredient)
        : [...prev.ingredients, ingredient],
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: value as [number, number],
    }));
  };

  const renderFilterSection = (title: string, items: any[], onChange: (item: string) => void, selectedItems: string[], idKey?: string, labelKey?: string) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-white mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map(item => {
            const value = idKey ? item[idKey] : item;
            const label = labelKey ? item[labelKey] : item;
            return (
              <label key={value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(value)}
                  onChange={() => onChange(value)}
                  className="rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-300">{label}</span>
              </label>
            )
        })}
      </div>
    </div>
  );

  return (
    <div
      className={`${showMobileFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0 bg-[#292929] p-6 rounded-lg h-fit`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button 
            onClick={() => setFilters({ collections: [], priceRange: [0, 3000], skinTypes: [], ingredients: [] })}
            className="text-sm text-[#d4a574] hover:text-[#d4a574]"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-6">
        {/* Sort By */}
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Sort By</h3>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full bg-white border border-gray-600 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
          >
            <option value="best-selling">Best Selling</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Collections */}
        {renderFilterSection('Collections', collections, handleCollectionChange, filters.collections, '_id', 'name')}

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-3">Price Range</h3>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="3000"
              step="60"
              value={filters.priceRange[1]}
              onChange={e =>
                handlePriceRangeChange([filters.priceRange[0], parseInt(e.target.value)])
              }
              className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-[#d4a674]"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Skin Type */}
        {renderFilterSection('Skin Type', skinTypes, handleSkinTypeChange, filters.skinTypes)}

        {/* Key Ingredients */}
        {renderFilterSection(
          'Key Ingredients',
          ingredients,
          handleIngredientChange,
          filters.ingredients
        )}

        <button
          onClick={() => setShowMobileFilters(false)}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors md:hidden"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
