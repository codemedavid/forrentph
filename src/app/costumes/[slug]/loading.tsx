export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images and Details */}
          <div className="space-y-6">
            {/* Main Image Skeleton */}
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>

            {/* Thumbnails Skeleton */}
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>

            {/* Costume Info Card Skeleton */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Section */}
          <div className="space-y-6">
            {/* Calendar Card Skeleton */}
            <div className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>

            {/* Pricing Card Skeleton */}
            <div className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>

            {/* Summary Card Skeleton */}
            <div className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-40"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

