import { Package, TrendingUp, Star } from 'lucide-react'

interface CategoryHeroProps {
  category: string
  totalProducts: number
}

export default function CategoryHero({ category, totalProducts }: CategoryHeroProps) {
  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getCategoryDescription = (category: string) => {
    const descriptions: Record<string, string> = {
      smartphones: "Discover the latest smartphones with cutting-edge technology and innovative features",
      laptops: "High-performance laptops for work, gaming, and creative professionals",
      fragrances: "Luxury fragrances and premium scents from top brands worldwide",
      skincare: "Premium skincare and beauty products for radiant, healthy skin",
      groceries: "Fresh groceries and organic products for your daily needs",
      "home-decoration": "Beautiful home decoration and accessories to transform your space",
      furniture: "Modern furniture pieces to create your perfect living environment",
      tops: "Trendy tops and fashion wear for every style and occasion",
      "womens-dresses": "Elegant dresses for every occasion, from casual to formal",
      "womens-shoes": "Stylish footwear collection for the modern woman",
      "mens-shirts": "Premium shirts and formal wear for the contemporary man",
      "mens-shoes": "Quality footwear for men, from casual to professional",
      "mens-watches": "Luxury timepieces and watches for the discerning gentleman",
      "womens-watches": "Elegant watches and timepieces for women",
      "womens-bags": "Designer bags and accessories for every style",
      "womens-jewellery": "Beautiful jewelry and accessories to complete your look",
      sunglasses: "Stylish sunglasses and eyewear for protection and fashion",
      automotive: "Auto parts and accessories for your vehicle needs",
      motorcycle: "Motorcycle gear and accessories for riders",
      lighting: "Modern lighting solutions to illuminate your space",
    }

    return descriptions[category] || "Discover amazing products in this category"
  }

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16 lg:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Category badge */}
          <div className="inline-flex items-center glass rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-6 animate-fade-in">
            <Package className="mr-2 h-4 w-4" />
            <span className="text-balance">Premium Quality Products</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 animate-slide-up text-balance">
            {formatCategoryName(category)}
          </h1>

          {/* Description */}
          <p
            className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed animate-slide-up text-pretty"
            style={{ animationDelay: "0.2s" }}
          >
            {getCategoryDescription(category)}
          </p>

          {/* Stats */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center space-x-2 text-gray-600">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium">{totalProducts}+ Products Available</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="font-medium">Top Rated Collection</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
