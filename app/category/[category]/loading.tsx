export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation skeleton */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-48 h-8 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse"></div>
            <div className="w-96 h-12 bg-gray-200 rounded mx-auto mb-6 animate-pulse"></div>
            <div className="w-full max-w-2xl h-6 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="w-3/4 h-6 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Products skeleton */}
      <div className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="w-64 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
