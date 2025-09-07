"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, Menu, ChevronDown, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getProducts, getCategories } from "@/lib/api";
import { useCart } from "@/app/contexts/CartContext";
import type { Product, Category } from "@/lib/types";

export default function Header() {
  const { state: cartState, addItem, toggleCart } = useCart();
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Refs for click outside detection
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        productsDropdownRef.current &&
        !productsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProductsOpen(false);
      }
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(50).catch((err) => {
            console.error("Failed to load products:", err);
            return { products: [], total: 0 };
          }),
          getCategories().catch((err) => {
            console.error("Failed to load categories:", err);
            return [];
          }),
        ]);

        // Ensure we have valid data with additional safety checks
        const validProducts = (productsData.products || []).filter(
          (product) =>
            product &&
            product.id &&
            typeof product.title === "string" &&
            typeof product.price === "number"
        );

        setProducts(validProducts);
        setCategories(categoriesData || []);
        setFilteredProducts(validProducts.slice(0, 12)); // Show first 12 initially
        setFilteredCategories(categoriesData || []);
      } catch (error) {
        console.error("Error loading header data:", error);
        // Set empty arrays as fallback
        setProducts([]);
        setCategories([]);
        setFilteredProducts([]);
        setFilteredCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter products and categories based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products.slice(0, 12));
      setFilteredCategories(categories);
    } else {
      const query = searchQuery.toLowerCase();

      // Filter products
      const filteredProds = products.filter((product) => {
        const title = product.title?.toLowerCase() || "";
        const brand = product.brand?.toLowerCase() || "";
        const category = product.category?.toLowerCase() || "";
        return (
          title.includes(query) ||
          brand.includes(query) ||
          category.includes(query)
        );
      });
      setFilteredProducts(filteredProds.slice(0, 12));

      // Filter categories
      const filteredCats = categories.filter((category) => {
        const name = formatCategoryName(category.name).toLowerCase();
        return name.includes(query);
      });
      setFilteredCategories(filteredCats);
    }
  }, [searchQuery, products, categories]);

  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getBadge = (product: Product) => {
    if (!product) return { text: "Product", color: "bg-gray-500" };

    const discount = product.discountPercentage || 0;
    const rating = product.rating || 0;
    const stock = product.stock || 0;

    if (discount > 20) return { text: "Hot Deal", color: "bg-red-500" };
    if (rating > 4.5) return { text: "Top Rated", color: "bg-green-500" };
    if (stock < 10 && stock > 0)
      return { text: "Limited", color: "bg-orange-500" };
    return { text: "Popular", color: "bg-blue-500" };
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();

    // Validate product before adding
    if (
      !product ||
      !product.id ||
      !product.title ||
      typeof product.price !== "number"
    ) {
      console.error("Invalid product data:", product);
      return;
    }

    addItem(product);
    // Show a brief success animation or toast
    const button = e.currentTarget as HTMLElement;
    button.classList.add("animate-pulse");
    setTimeout(() => {
      button.classList.remove("animate-pulse");
    }, 500);
  };

  const toggleProductsDropdown = () => {
    setIsProductsOpen(!isProductsOpen);
    // Close categories dropdown if open
    if (isCategoriesOpen) {
      setIsCategoriesOpen(false);
    }
  };

  const toggleCategoriesDropdown = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
    // Close products dropdown if open
    if (isProductsOpen) {
      setIsProductsOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close other dropdowns
    setIsProductsOpen(false);
    setIsCategoriesOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsProductsOpen(false);
    setIsCategoriesOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600"></div>
              <span className="text-xl font-bold">ShopHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Home
            </Link>

            {/* All Products Dropdown with Search */}
            <div className="relative" ref={productsDropdownRef}>
              <button
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  isProductsOpen ? "text-blue-600" : "hover:text-blue-600"
                }`}
                onClick={toggleProductsDropdown}
              >
                <Search className="h-4 w-4" />
                <span>Search Products</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isProductsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProductsOpen && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[800px] max-w-[90vw] z-50">
                  <Card className="shadow-2xl border-0 bg-white backdrop-blur-sm animate-slide-up">
                    <CardContent className="p-6">
                      {/* Header with close button */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Search Products
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setIsProductsOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Search Bar */}
                      <div className="mb-6">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Search products by name, brand, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 w-full"
                            autoFocus
                          />
                        </div>
                      </div>

                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="ml-2 text-sm text-gray-600">
                            Loading products...
                          </span>
                        </div>
                      ) : (
                        <>
                          {/* Products Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-96 overflow-y-auto scrollbar-thin">
                            {filteredProducts.length === 0 ? (
                              <div className="col-span-full text-center py-8">
                                <p className="text-gray-500">
                                  {searchQuery
                                    ? "No products found matching your search."
                                    : "Start typing to search products..."}
                                </p>
                              </div>
                            ) : (
                              filteredProducts.map((product) => {
                                // Add safety checks
                                if (!product || !product.id) return null;

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
                                          alt={product.title || "Product"}
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
                                              {product.brand || "Unknown Brand"}
                                            </p>
                                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                              {product.title || "Product"}
                                            </h4>

                                            {/* Rating */}
                                            <div className="flex items-center space-x-1 mt-1">
                                              <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                  <Star
                                                    key={i}
                                                    className={`w-3 h-3 ${
                                                      i <
                                                      Math.floor(
                                                        product.rating || 0
                                                      )
                                                        ? "text-yellow-400 fill-current"
                                                        : "text-gray-300"
                                                    }`}
                                                  />
                                                ))}
                                              </div>
                                              <span className="text-xs text-gray-600">
                                                {(product.rating || 0).toFixed(
                                                  1
                                                )}
                                              </span>
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-center space-x-2 mt-1">
                                              <span className="text-sm font-bold text-gray-900">
                                                $
                                                {(product.price || 0).toFixed(
                                                  2
                                                )}
                                              </span>
                                              {(product.discountPercentage ||
                                                0) > 0 && (
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
                                                      product.discountPercentage ||
                                                        0
                                                    )}
                                                    %
                                                  </Badge>
                                                </>
                                              )}
                                            </div>

                                            {/* Category */}
                                            <p className="text-xs text-gray-400 mt-1">
                                              {formatCategoryName(
                                                product.category || ""
                                              )}
                                            </p>
                                          </div>

                                          {/* Action Buttons */}
                                          <div className="flex flex-col space-y-1 ml-2">
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-600"
                                              onClick={(e) =>
                                                handleAddToCart(product, e)
                                              }
                                              title="Add to Cart"
                                            >
                                              <ShoppingCart className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* Footer */}
                          <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600">
                                {searchQuery
                                  ? `Found ${filteredProducts.length} products matching "${searchQuery}"`
                                  : `${products.length} products available`}
                              </p>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setIsProductsOpen(false);
                                    setIsCategoriesOpen(true);
                                  }}
                                >
                                  Browse Categories
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                  onClick={() => setIsProductsOpen(false)}
                                >
                                  Close Search
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
            <div className="relative" ref={categoriesDropdownRef}>
              <button
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  isCategoriesOpen ? "text-blue-600" : "hover:text-blue-600"
                }`}
                onClick={toggleCategoriesDropdown}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isCategoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoriesOpen && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-96 z-50">
                  <Card className="shadow-xl border-0 bg-white backdrop-blur-sm animate-slide-up">
                    <CardContent className="p-4">
                      {/* Header with close button */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Categories
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="ml-2 text-sm text-gray-600">
                            Loading categories...
                          </span>
                        </div>
                      ) : categories.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">
                            Categories temporarily unavailable
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto scrollbar-thin">
                          {categories.slice(0, 20).map((category) => (
                            <Link
                              key={category.slug}
                              href={`/category/${category.slug}`}
                              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                              onClick={() => setIsCategoriesOpen(false)}
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
                      )}
                      {categories.length > 20 && (
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-blue-600"
                            onClick={() => setIsCategoriesOpen(false)}
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
          </nav>

          {/* Right side icons - Removed Search and User icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartState.itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 animate-pulse">
                  {cartState.itemCount}
                </Badge>
              )}
            </Button>
            <Button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
            onClick={closeMobileMenu}
            style={{ touchAction: "none" }}
          />

          {/* Mobile Menu */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl md:hidden">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  <span className="text-lg font-bold">ShopHub</span>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex-1 overflow-y-auto bg-white">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="py-2">
                  <Link
                    href="/"
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    🏠 Home
                  </Link>

                  {/* Categories Section */}
                  <div className="px-4 py-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Shop by Category
                    </h3>

                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2 text-sm text-gray-600">
                          Loading categories...
                        </span>
                      </div>
                    ) : filteredCategories.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">
                          {searchQuery
                            ? "No categories found matching your search."
                            : "Categories temporarily unavailable"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1 max-h-96 overflow-y-auto">
                        {filteredCategories.map((category) => (
                          <Link
                            key={category.slug}
                            href={`/category/${category.slug}`}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            onClick={closeMobileMenu}
                          >
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                              <span className="text-white text-sm font-bold">
                                {formatCategoryName(category.name).charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {formatCategoryName(category.name)}
                              </span>
                              <p className="text-xs text-gray-500">
                                Browse products
                              </p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Menu Footer - Removed Account button */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-3">
                    {categories.length} categories • {products.length} products
                  </p>
                  <button
                    onClick={() => {
                      toggleCart();
                      closeMobileMenu();
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors relative"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View Cart
                    {cartState.itemCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                        {cartState.itemCount}
                      </Badge>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
