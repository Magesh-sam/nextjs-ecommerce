"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ShoppingCart, ChevronLeft, ChevronRight, Grid, List } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/app/contexts/CartContext"

interface ProductGridProps {
  products: Product[]
  category: string
  currentPage: number
  totalPages: number
  totalProducts: number
}

export default function ProductGrid({ products, category, currentPage, totalPages, totalProducts }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("default")
  const { addItem } = useCart()

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(product)
    // Show a brief success animation
    const button = e.currentTarget as HTMLElement
    button.classList.add("animate-pulse")
    setTimeout(() => {
      button.classList.remove("animate-pulse")
    }, 500)
  }

  const getBadge = (product: Product) => {
    if (product.discountPercentage > 20) return { text: "Hot Deal", color: "bg-red-500" }
    if (product.rating > 4.5) return { text: "Top Rated", color: "bg-green-500" }
    if (product.stock < 10) return { text: "Limited", color: "bg-orange-500" }
    return { text: "Popular", color: "bg-blue-500" }
  }

  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (products.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Products Found</h3>
            <p className="text-gray-600 mb-8">
              We couldn't find any products in the {formatCategoryName(category)} category at the moment.
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {formatCategoryName(category)} Products
            </h2>
            <p className="text-gray-600">
              Showing {(currentPage - 1) * 20 + 1}-{Math.min(currentPage * 20, totalProducts)} of {totalProducts}{" "}
              products
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* View mode toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-6"
          }
        >
          {products.map((product, index) => {
            const badge = getBadge(product)
            const originalPrice =
              product.discountPercentage > 0 ? product.price / (1 - product.discountPercentage / 100) : product.price

            if (viewMode === "list") {
              return (
                <Card
                  key={product.id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white overflow-hidden animate-slide-in-left"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-64 h-64 md:h-48 overflow-hidden">
                        <Image
                          src={product.thumbnail || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          loading={index < 4 ? "eager" : "lazy"}
                        />
                        <div className="absolute top-4 left-4">
                          <span
                            className={`${badge.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}
                          >
                            {badge.text}
                          </span>
                        </div>
                        {product.discountPercentage > 0 && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                              -{Math.round(product.discountPercentage)}%
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
                              <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2" title={product.title}>
                                {product.title}
                              </h3>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                          <div className="flex items-center space-x-2 mb-4">
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
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                            {product.discountPercentage > 0 && (
                              <span className="text-lg text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
                            )}
                          </div>
                          <Button
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={(e) => handleAddToCart(product, e)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            }

            return (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white overflow-hidden animate-slide-up hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.title}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading={index < 8 ? "eager" : "lazy"}
                    />

                    <div className="absolute top-4 left-4">
                      <span className={`${badge.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                        {badge.text}
                      </span>
                    </div>

                    {product.discountPercentage > 0 && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          -{Math.round(product.discountPercentage)}%
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex justify-center">
                        <Button
                          size="sm"
                          className="shadow-lg bg-white text-gray-900 hover:bg-gray-100"
                          onClick={(e) => handleAddToCart(product, e)}
                        >
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
                        className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors text-balance"
                        title={product.title}
                      >
                        {product.title}
                      </h3>
                    </div>

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

                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      {product.discountPercentage > 0 && (
                        <span className="text-lg text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
                      )}
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-12">
            <Link
              href={`/category/${category}?page=${Math.max(1, currentPage - 1)}`}
              className={currentPage === 1 ? "pointer-events-none" : ""}
            >
              <Button
                variant="outline"
                disabled={currentPage === 1}
                className="flex items-center space-x-2 bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
            </Link>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                return (
                  <Link key={pageNum} href={`/category/${category}?page=${pageNum}`}>
                    <Button variant={pageNum === currentPage ? "default" : "outline"} size="sm" className="w-10 h-10">
                      {pageNum}
                    </Button>
                  </Link>
                )
              })}
            </div>

            <Link
              href={`/category/${category}?page=${Math.min(totalPages, currentPage + 1)}`}
              className={currentPage === totalPages ? "pointer-events-none" : ""}
            >
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                className="flex items-center space-x-2 bg-transparent"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
