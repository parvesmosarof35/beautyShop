
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#171717] py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="mb-16 text-center animate-pulse">
        <div className="h-4 w-32 bg-[#2b2b2b] mx-auto rounded mb-4"></div>
        <div className="h-10 w-2/3 md:w-1/2 bg-[#2b2b2b] mx-auto rounded mb-6"></div>
        <div className="max-w-2xl mx-auto flex justify-center py-4">
             <div className="h-10 w-full max-w-md bg-[#2b2b2b] rounded-full"></div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#2b2b2b] rounded-2xl overflow-hidden shadow-lg border border-[#333] animate-pulse">
            <div className="h-64 bg-[#333]"></div>
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <div className="h-4 w-24 bg-[#333] rounded"></div>
                <div className="h-4 w-24 bg-[#333] rounded"></div>
              </div>
              <div className="h-8 w-3/4 bg-[#333] rounded mb-3"></div>
              <div className="h-4 w-full bg-[#333] rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-[#333] rounded mb-6"></div>
              <div className="h-4 w-20 bg-[#D4A574]/20 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
