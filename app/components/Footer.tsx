import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="size-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <span className="text-2xl font-bold">ShopHub</span>
          </div>

          {/* Description */}
          <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg text-pretty">
            Your trusted destination for premium products at unbeatable prices. Quality guaranteed, satisfaction
            assured.
          </p>

          {/* Stats */}
          <div className="container-queries grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-2xl mx-auto">
            <div className="text-center group">
              <div className="text-3xl font-bold text-blue-400 mb-2 transition-transform group-hover:scale-110">
                50K+
              </div>
              <div className="text-sm text-gray-400">Happy Customers</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-blue-400 mb-2 transition-transform group-hover:scale-110">
                10K+
              </div>
              <div className="text-sm text-gray-400">Products</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-blue-400 mb-2 transition-transform group-hover:scale-110">
                99%
              </div>
              <div className="text-sm text-gray-400">Satisfaction</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-blue-400 mb-2 transition-transform group-hover:scale-110">
                24/7
              </div>
              <div className="text-sm text-gray-400">Support</div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 flex items-center justify-center text-balance">
              © {new Date().getFullYear()} ShopHub. Made with{" "}
              <Heart className="size-4 text-red-500 mx-1 fill-current animate-pulse" />
              for amazing shopping experiences.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
