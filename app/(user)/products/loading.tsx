export default function Loading() {
  return (
    <div className="min-h-screen bg-[#171717] text-white">
      {/* Header Skeleton */}
      <div className="bg-[#171717] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#2b2b2b]">
        <div className="max-w-7xl mx-auto text-center animate-pulse">
          <div className="h-10 w-64 bg-[#2b2b2b] rounded mx-auto mb-4"></div>
          <div className="h-4 w-96 bg-[#2b2b2b] rounded mx-auto"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Skeleton - Hidden on mobile, visible md+ */}
          <div className="hidden md:block w-64 flex-shrink-0 space-y-8">
             {/* Filter Groups */}
             {[1, 2, 3].map((group) => (
               <div key={group}>
                 <div className="h-6 w-32 bg-[#2b2b2b] rounded mb-4"></div>
                 <div className="space-y-3">
                   {[1, 2, 3, 4].map((item) => (
                     <div key={item} className="flex items-center">
                       <div className="h-4 w-4 bg-[#2b2b2b] rounded mr-3"></div>
                       <div className="h-4 w-24 bg-[#2b2b2b] rounded"></div>
                     </div>
                   ))}
                 </div>
               </div>
             ))}
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6">
              <div className="h-4 w-48 bg-[#2b2b2b] rounded"></div>
              <div className="flex space-x-2">
                 <div className="h-9 w-9 bg-[#2b2b2b] rounded"></div>
                 <div className="h-9 w-9 bg-[#2b2b2b] rounded"></div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#383838] rounded-lg overflow-hidden h-[400px] border border-gray-700">
                  {/* Image */}
                  <div className="h-64 w-full bg-[#2b2b2b]"></div>
                  {/* Content */}
                  <div className="p-5 space-y-4">
                    <div className="h-3 w-24 bg-[#2b2b2b] rounded"></div>
                    <div className="h-6 w-full bg-[#2b2b2b] rounded"></div>
                    <div className="h-3 w-full bg-[#2b2b2b] rounded"></div>
                    
                    <div className="flex justify-between items-center mt-4">
                       <div className="h-6 w-20 bg-[#2b2b2b] rounded"></div>
                       <div className="h-8 w-8 bg-[#2b2b2b] rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
