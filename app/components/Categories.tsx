import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp } from 'lucide-react'
import type { Category } from "@/lib/types"

interface CategoriesProps {
  categories: Category[]
}

// Category images and descriptions mapping
const categoryData: Record<string, { image: string; description: string; color: string }> = {
  smartphones: {
    image: "/placeholder.svg?height=300&width=400&text=Latest+Smartphones",
    description: "Latest smartphones with cutting-edge technology",
    color: "from-blue-500 to-cyan-500",
  },
  laptops: {
    image: "/placeholder.svg?height=300&width=400&text=Premium+Laptops",
    description: "High-performance laptops for work and gaming",
    color: "from-gray-600 to-gray-800",
  },
  fragrances: {
    image: "/placeholder.svg?height=300&width=400&text=Luxury+Fragrances",
    description: "Luxury fragrances and premium scents",
    color: "from-pink-500 to-rose-500",
  },
  skincare: {
    image: "/placeholder.svg?height=300&width=400&text=Skincare+Products",
    description: "Premium skincare and beauty products",
    color: "from-green-400 to-emerald-500",
  },
  groceries: {
    image: "/placeholder.svg?height=300&width=400&text=Fresh+Groceries",
    description: "Fresh groceries and organic products",
    color: "from-orange-400 to-yellow-500",
  },
  "home-decoration": {
    image: "/placeholder.svg?height=300&width=400&text=Home+Decor",
    description: "Beautiful home decoration and accessories",
    color: "from-purple-500 to-indigo-500",
  },
  furniture: {
    image: "/placeholder.svg?height=300&width=400&text=Modern+Furniture",
    description: "Modern furniture for every room",
    color: "from-amber-600 to-orange-600",
  },
  tops: {
    image: "/placeholder.svg?height=300&width=400&text=Fashion+Tops",
    description: "Trendy tops and fashion wear",
    color: "from-red-500 to-pink-500",
  },
  "womens-dresses": {
    image: "/placeholder.svg?height=300&width=400&text=Women's+Dresses",
    description: "Elegant dresses for every occasion",
    color: "from-violet-500 to-purple-500",
  },
  "womens-shoes": {
    image: "/placeholder.svg?height=300&width=400&text=Women's+Shoes",
    description: "Stylish shoes and footwear",
    color: "from-teal-500 to-cyan-500",
  },
  "mens-shirts": {
    image: "/placeholder.svg?height=300&width=400&text=Men's+Shirts",
    description: "Premium shirts for modern men",
    color: "from-slate-600 to-gray-700",
  },
  "mens-shoes": {
    image: "/placeholder.svg?height=300&width=400&text=Men's+Shoes",
    description: "Quality footwear for men",
    color: "from-stone-600 to-neutral-700",
  },
  "mens-watches": {
    image: "/placeholder.svg?height=300&width=400&text=Men's+Watches",
    description: "Luxury watches and timepieces",
    color: "from-yellow-600 to-amber-600",
  },
  "womens-watches": {
    image: "/placeholder.svg?height=300&width=400&text=Women's+Watches",
    description: "Elegant watches for women",
    color: "from-rose-500 to-pink-600",
  },
  "womens-bags": {
    image: "/placeholder.svg?height=300&width=400&text=Women's+Bags",
    description: "Designer bags and accessories",
    color: "from-indigo-500 to-blue-600",
  },
  "womens-jewellery": {
    image: "/placeholder.svg?height=300&width=400&text=Women's+Jewelry",
    description: "Beautiful jewelry and accessories",
    color: "from-yellow-500 to-amber-500",
  },
  sunglasses: {
    image: "/placeholder.svg?height=300&width=400&text=Sunglasses",
    description: "Stylish sunglasses and eyewear",
    color: "from-gray-700 to-black",
  },
  automotive: {
    image: "/placeholder.svg?height=300&width=400&text=Automotive",
    description: "Auto parts and accessories",
    color: "from-red-600 to-red-800",
  },
  motorcycle: {
    image: "/placeholder.svg?height=300&width=400&text=Motorcycle",
    description: "Motorcycle gear and accessories",
    color: "from-orange-600 to-red-600",
  },
  lighting: {
    image: "/placeholder.svg?height=300&width=400&text=Lighting",
    description: "Modern lighting solutions",
    color: "from-yellow-400 to-orange-500",
  },
}

export default function Categories({ categories }: CategoriesProps) {
  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Get product counts for categories (simulate since API doesn't provide exact counts)
  const categoriesWithData = categories.slice(0, 12).map((category, index) => {
    // Simulate product counts
    const productCount = Math.floor(Math.random() * 500) + 50
    const data = categoryData[category.slug] || {
      image: "/placeholder.svg?height=300&width=400",
      description: "Discover amazing products",
      color: "from-gray-500 to-gray-700",
    }

    return {
      ...category,
      productCount,
      ...data,
      isPopular: index < 4, // Mark first 4 as popular
    }
  })

  if (categoriesWithData.length === 0) {
    return (
      <section id="categories" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="shimmer inline-block bg-gray-200 rounded-lg w-16 h-16 mb-4"></div>
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="categories" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-balance">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Explore our diverse collection of premium products across multiple categories, each carefully curated for
            quality and style.
          </p>
        </div>

        {/* Featured Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categoriesWithData.slice(0, 6).map((category, index) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              <Card
                className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden cursor-pointer animate-slide-up hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={formatCategoryName(category.name)}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading={index < 3 ? "eager" : "lazy"}
                    />

                    {/* Gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-70 transition-opacity duration-300`}
                    ></div>

                    {/* Popular badge */}
                    {category.isPopular && (
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center glass rounded-full px-3 py-1 shadow-lg">
                          <TrendingUp className="w-4 h-4 text-orange-500 mr-1" />
                          <span className="text-xs font-bold text-gray-900">Popular</span>
                        </div>
                      </div>
                    )}

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2 group-hover:transform group-hover:translate-y-[-4px] transition-transform duration-300 text-balance">
                        {formatCategoryName(category.name)}
                      </h3>
                      <p className="text-sm opacity-90 mb-3 line-clamp-2 text-pretty">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category.productCount}+ Products</span>
                        <div className="flex items-center text-sm font-semibold group-hover:transform group-hover:translate-x-1 transition-transform duration-300">
                          Shop Now
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Additional Categories Grid */}
        {categoriesWithData.length > 6 && (
          <>
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-balance">More Categories</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
              {categoriesWithData.slice(6, 12).map((category, index) => (
                <Link key={category.slug} href={`/category/${category.slug}`}>
                  <Card
                    className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 cursor-pointer animate-slide-up hover:-translate-y-1"
                    style={{ animationDelay: `${(index + 6) * 0.05}s` }}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="relative overflow-hidden rounded-lg mb-3">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={formatCategoryName(category.name)}
                          width={200}
                          height={150}
                          className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-40 group-hover:opacity-50 transition-opacity duration-300`}
                        ></div>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 text-balance">
                        {formatCategoryName(category.name)}
                      </h4>
                      <p className="text-xs text-gray-500">{category.productCount}+ items</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <div className="glass rounded-2xl p-8 lg:p-12 max-w-2xl mx-auto border border-gray-200">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 text-balance">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-gray-600 mb-6 text-pretty">
              Use our "All Products" dropdown in the navigation above to search through our complete catalog.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
