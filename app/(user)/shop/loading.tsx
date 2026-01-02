export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#171717]">
      <div className="container mx-auto px-4 py-8 bg-[#171717] animate-pulse">
        {/* Page Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            {/* Title */}
            <div className="h-8 w-48 bg-[#2b2b2b] rounded mb-3"></div>
            {/* Results count */}
            <div className="h-4 w-64 bg-[#2b2b2b] rounded mb-6"></div>
            
            {/* Category Pills Skeleton */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-9 w-24 bg-[#2b2b2b] rounded-full"></div>
              ))}
            </div>
          </div>
          
          {/* Right Side Controls Skeleton */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Sort Dropdown */}
            <div className="flex items-center">
               <div className="h-5 w-16 bg-[#2b2b2b] rounded mr-2"></div>
               <div className="h-9 w-40 bg-[#2b2b2b] rounded"></div>
            </div>
            
            {/* View Toggle */}
            <div className="h-9 w-20 bg-[#2b2b2b] rounded border border-[#2b2b2b]"></div>
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-[#2b2b2b] rounded-lg overflow-hidden shadow-sm h-[350px]">
              {/* Image */}
              <div className="h-48 w-full bg-[#383838]"></div>
              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-[#383838] rounded"></div>
                {/* Stars */}
                <div className="flex space-x-1">
                   <div className="h-3 w-20 bg-[#383838] rounded"></div>
                </div>
                {/* Price and Button */}
                <div className="flex justify-between items-center mt-4">
                   <div className="h-6 w-16 bg-[#383838] rounded"></div>
                   <div className="h-8 w-16 bg-[#383838] rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
