"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Search } from 'lucide-react'
import { cn } from "@/lib/utils"

interface NavigationProps {
  categories?: Array<{ slug: string; name: string }>
  showBackButton?: boolean
  currentCategory?: string
}

export default function Navigation({ categories = [], showBackButton = false, currentCategory }: NavigationProps) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and back button */}
          <div className="flex items-center space-x-4">
            {showBackButton && !isHomePage && (
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Home</span>
                </Button>
              </Link>
            )}

            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600"></div>
              <span className="text-xl font-bold text-gray-900">ShopHub</span>
            </Link>
          </div>

          {/* Center - Current category or home indicator */}
          <div className="hidden md:flex items-center space-x-2">
            {isHomePage ? (
              <div className="flex items-center space-x-2 text-gray-600">
                <Home className="h-4 w-4" />
                <span className="text-sm font-medium">Home</span>
              </div>
            ) : (
              currentCategory && (
                <div className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                  {formatCategoryName(currentCategory)}
                </div>
              )
            )}
          </div>

          {/* Right side - Search and categories */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Button>

            {/* Categories dropdown for mobile */}
            {categories.length > 0 && (
              <div className="relative">
                <select
                  className="appearance-none bg-transparent border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => {
                    if (e.target.value) {
                      window.location.href = `/category/${e.target.value}`
                    }
                  }}
                  value={currentCategory || ""}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {formatCategoryName(category.name)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Category breadcrumbs for larger screens */}
        {categories.length > 0 && !isHomePage && (
          <div className="hidden lg:flex items-center space-x-2 py-2 border-t border-gray-100">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-medium text-gray-900">
              {currentCategory && formatCategoryName(currentCategory)}
            </span>
          </div>
        )}
      </div>
    </nav>
  )
}
