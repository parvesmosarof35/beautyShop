'use client';

interface FilterState {
  categories: string[];
  skinTypes: string[];
  ingredients: string[];
  priceRange: [number, number];
  sortBy: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  availableCategories: string[];
  availableSkinTypes: string[];
  availableIngredients: string[];
  minPrice: number;
  maxPrice: number;
}

export function FilterSidebar({
  filters,
  onFilterChange,
  availableCategories,
  availableSkinTypes,
  availableIngredients,
  minPrice,
  maxPrice,
}: FilterSidebarProps) {
  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange({ categories: newCategories });
  };

  const handleSkinTypeChange = (skinType: string) => {
    const newSkinTypes = filters.skinTypes.includes(skinType)
      ? filters.skinTypes.filter((s) => s !== skinType)
      : [...filters.skinTypes, skinType];
    onFilterChange({ skinTypes: newSkinTypes });
  };

  const handleIngredientChange = (ingredient: string) => {
    const newIngredients = filters.ingredients.includes(ingredient)
      ? filters.ingredients.filter((i) => i !== ingredient)
      : [...filters.ingredients, ingredient];
    onFilterChange({ ingredients: newIngredients });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newPriceRange = [...filters.priceRange] as [number, number];
    newPriceRange[index] = Number(e.target.value);
    onFilterChange({ priceRange: newPriceRange });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sortBy: e.target.value as any });
  };

  return (
    <div className="w-full space-y-8 p-6 bg-[#292929] rounded-lg text-white">
      {/* Sort By */}
      <div>
        <h3 className="text-lg font-medium mb-3 text-white">Sort By</h3>
        <select
          value={filters.sortBy}
          onChange={handleSortChange}
          className="w-full p-2 rounded-md bg-[#292929] border border-[#d4a574] text-white focus:border-[#d4a574] focus:ring-1 focus:ring-[#d4a574]"
        >
          <option value="best-selling">Best Selling</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-medium mb-3 text-white">Categories</h3>
        <div className="space-y-2">
          {availableCategories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="rounded border-gray-400 text-[#d4a574] focus:ring-[#d4a574] h-4 w-4 bg-gray-700"
              />
              <span className="text-gray-200">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-medium mb-3 text-white">Price Range</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-400">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
          <div className="px-2">
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(e, 0)}
              className="w-full"
            />
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(e, 1)}
              className="w-full mt-4"
            />
          </div>
        </div>
      </div>

      {/* Skin Type */}
      <div>
        <h3 className="text-lg font-medium mb-3 text-white">Skin Type</h3>
        <div className="space-y-2">
          {availableSkinTypes.map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.skinTypes.includes(type)}
                onChange={() => handleSkinTypeChange(type)}
                className="rounded border-gray-400 text-[#d4a574] focus:ring-[#d4a574] h-4 w-4 bg-gray-700"
              />
              <span className="text-gray-200">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Key Ingredients */}
      <div>
        <h3 className="text-lg font-medium mb-3 text-white">Key Ingredients</h3>
        <div className="space-y-2">
          {availableIngredients.map((ingredient) => (
            <label key={ingredient} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.ingredients.includes(ingredient)}
                onChange={() => handleIngredientChange(ingredient)}
                className="rounded border-gray-400 text-[#d4a574] focus:ring-[#d4a574] h-4 w-4 bg-gray-700"
              />
              <span className="text-gray-200">{ingredient}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
