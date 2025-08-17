"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/app/contexts/CartContext"

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { addItem } = useCart()

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      addItem(product)

      // Show a brief success animation
      const button = e.currentTarget as HTMLElement
      const originalText = button.textContent

      button.textContent = "Added!"
      button.classList.add("animate-pulse", "bg-green-600")

      setTimeout(() => {
        button.textContent = originalText
        button.classList.remove("animate-pulse", "bg-green-600")
      }, 1000)
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const getBadge = (product: Product) => {
    if (product.discountPercentage > 20) return { text: "Hot Deal", color: "bg-red-500" }
    if (product.rating > 4.5) return { text: "Top Rated", color: "bg-green-500" }
    if (product.stock < 10) return { text: "Limited", color: "bg-orange-500" }
    return { text: "Popular", color: "bg-blue-500" }
  }

  if (products.length === 0) {
    return (
      <section id="featured-products" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="shimmer inline-block bg-gray-200 rounded-lg w-16 h-16 mb-4"></div>
            <p className="text-gray-600">Loading amazing products...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="featured-products" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-balance">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
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
                className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white overflow-hidden animate-slide-up hover:-translate-y-2"
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
                      <span
                        className={`${badge.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm`}
                      >
                        {badge.text}
                      </span>
                    </div>

                    {/* Discount badge */}
                    {product.discountPercentage > 0 && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm">
                          -{Math.round(product.discountPercentage)}%
                        </span>
                      </div>
                    )}

                    {/* Hover overlay with glass effect */}
                    <div className="absolute inset-0 glass opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex justify-center">
                        <Button
                          size="sm"
                          className="shadow-lg bg-white text-gray-900 hover:bg-gray-100 backdrop-blur-sm px-6"
                          onClick={(e) => handleAddToCart(product, e)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Quick Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
                      <h3
                        className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors text-balance"
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
                            className={`w-4 h-4 ${
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

                    <Button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">Discover more amazing products in our navigation menu above!</p>
        </div>
      </div>
    </section>
  )
}
