import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Heart, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/types"

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const getBadge = (product: Product) => {
    if (product.discountPercentage > 20) return { text: "Hot Deal", color: "bg-red-500" }
    if (product.rating > 4.5) return { text: "Top Rated", color: "bg-green-500" }
    if (product.stock < 10) return { text: "Limited", color: "bg-orange-500" }
    return { text: "Popular", color: "bg-blue-500" }
  }

  if (products.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading amazing products...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Featured Products</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Handpicked selection of premium products, chosen for their exceptional quality, innovation, and customer
            satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 8).map((product, index) => {
            const badge = getBadge(product)
            const originalPrice =
              product.discountPercentage > 0 ? product.price / (1 - product.discountPercentage / 100) : product.price

            return (
              <Card
                key={product.id}
                className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.title}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading={index < 4 ? "eager" : "lazy"}
                    />

                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`${badge.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                        {badge.text}
                      </span>
                    </div>

                    {/* Discount badge */}
                    {product.discountPercentage > 0 && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          -{Math.round(product.discountPercentage)}%
                        </span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary" className="shadow-lg">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="shadow-lg bg-white text-gray-900 hover:bg-gray-100">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Quick Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
                      <h3
                        className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors"
                        title={product.title}
                      >
                        {product.title}
                      </h3>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{product.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({product.stock} in stock)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      {product.discountPercentage > 0 && (
                        <span className="text-lg text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
                      )}
                    </div>

                    {/* Category */}
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      {product.category.replace("-", " ")}
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:shadow-lg bg-transparent"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
