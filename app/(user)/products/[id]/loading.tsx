
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
        {/* Back Button Skeleton */}
        <div className="h-6 w-32 bg-[#2b2b2b] rounded mb-8"></div>

        {/* Product Section Skeleton */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images Skeleton */}
          <div className="space-y-4">
            <div className="w-full aspect-square bg-[#2b2b2b] rounded-xl"></div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-[#2b2b2b] rounded-lg"></div>
              ))}
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="flex flex-col">
            <div className="h-10 w-3/4 bg-[#2b2b2b] rounded mb-3"></div>
            <div className="h-20 w-full bg-[#2b2b2b] rounded mb-6"></div>
            <div className="h-8 w-24 bg-[#2b2b2b] rounded mb-6"></div>
            
            {/* Quantity Skeleton */}
            <div className="h-16 w-32 bg-[#2b2b2b] rounded mb-6"></div>

            {/* Buttons Skeleton */}
            <div className="space-y-3">
              <div className="h-14 w-full bg-[#2b2b2b] rounded-lg"></div>
              <div className="h-14 w-full bg-[#2b2b2b] rounded-lg"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
