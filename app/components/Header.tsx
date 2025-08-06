"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Search,
  Menu,
  User,
  ChevronDown,
  Star,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getProducts, getCategories } from "@/lib/api";
import type { Product, Category } from "@/lib/types";

export default function Header() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(50), // Load more products for dropdown
          getCategories(),
        ]);
        setProducts(productsData.products);
        setCategories(categoriesData);
        setFilteredProducts(productsData.products.slice(0, 12)); // Show first 12 initially
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter products based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products.slice(0, 12));
    } else {
      const filtered = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered.slice(0, 12));
    }
  }, [searchQuery, products]);

  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getBadge = (product: Product) => {
    if (product.discountPercentage > 20)
      return { text: "Hot Deal", color: "bg-red-500" };
    if (product.rating > 4.5)
      return { text: "Top Rated", color: "bg-green-500" };
    if (product.stock < 10) return { text: "Limited", color: "bg-orange-500" };
    return { text: "Popular", color: "bg-blue-500" };
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600"></div>
              <span className="text-xl font-bold">ShopHub</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Home
            </Link>

            {/* All Products Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-1 text-sm font-medium hover:text-blue-600 transition-colors"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
                onClick={() => setIsProductsOpen(!isProductsOpen)}
              >
                <span>All Products</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isProductsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProductsOpen && (
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[800px] max-w-[90vw]"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                >
                  <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-6">
                      {/* Search Bar */}
                      <div className="mb-6">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 w-full"
                          />
                        </div>
                      </div>

                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <>
                          {/* Products Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {filteredProducts.map((product) => {
                              const badge = getBadge(product);
                              const originalPrice =
                                product.discountPercentage > 0
                                  ? product.price /
                                    (1 - product.discountPercentage / 100)
                                  : product.price;

                              return (
                                <div
                                  key={product.id}
                                  className="group relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer p-3"
                                >
                                  <div className="flex space-x-3">
                                    {/* Product Image */}
                                    <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                                      <Image
                                        src={
                                          product.thumbnail ||
                                          "/placeholder.svg"
                                        }
                                        alt={product.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                      />
                                      {/* Badge */}
                                      <div className="absolute -top-1 -right-1">
                                        <span
                                          className={`${badge.color} text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm`}
                                        >
                                          {badge.text}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs text-gray-500 font-medium">
                                            {product.brand}
                                          </p>
                                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {product.title}
                                          </h4>

                                          {/* Rating */}
                                          <div className="flex items-center space-x-1 mt-1">
                                            <div className="flex items-center">
                                              {[...Array(5)].map((_, i) => (
                                                <Star
                                                  key={i}
                                                  className={`w-3 h-3 ${
                                                    i <
                                                    Math.floor(product.rating)
                                                      ? "text-yellow-400 fill-current"
                                                      : "text-gray-300"
                                                  }`}
                                                />
                                              ))}
                                            </div>
                                            <span className="text-xs text-gray-600">
                                              {product.rating.toFixed(1)}
                                            </span>
                                          </div>

                                          {/* Price */}
                                          <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-sm font-bold text-gray-900">
                                              ${product.price.toFixed(2)}
                                            </span>
                                            {product.discountPercentage > 0 && (
                                              <>
                                                <span className="text-xs text-gray-500 line-through">
                                                  ${originalPrice.toFixed(2)}
                                                </span>
                                                <Badge
                                                  variant="destructive"
                                                  className="text-xs px-1 py-0"
                                                >
                                                  -
                                                  {Math.round(
                                                    product.discountPercentage
                                                  )}
                                                  %
                                                </Badge>
                                              </>
                                            )}
                                          </div>

                                          {/* Category */}
                                          <p className="text-xs text-gray-400 mt-1">
                                            {formatCategoryName(
                                              product.category
                                            )}
                                          </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col space-y-1 ml-2">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0"
                                          >
                                            <Heart className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0"
                                          >
                                            <ShoppingCart className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Footer */}
                          <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600">
                                Showing {filteredProducts.length} of{" "}
                                {products.length} products
                              </p>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  View Categories
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                  Browse All
                                </Button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-1 text-sm font-medium hover:text-blue-600 transition-colors"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isCategoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoriesOpen && (
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-96"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-2">
                        {categories.slice(0, 12).map((category) => (
                          <Link
                            key={category.slug}
                            href={`/category/${category.slug}`}
                            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {formatCategoryName(category.name).charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900 line-clamp-1">
                              {formatCategoryName(category.name)}
                            </span>
                          </Link>
                        ))}
                      </div>
                      {categories.length > 12 && (
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-blue-600"
                          >
                            View All Categories ({categories.length})
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                3
              </Badge>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
