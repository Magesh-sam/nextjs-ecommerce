"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

interface CategoryNavigationProps {
  currentCategory?: string
}

export default function CategoryNavigation({ currentCategory }: CategoryNavigationProps) {
  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            {currentCategory && (
              <>
                <span className="text-gray-300">/</span>
                <span className="font-medium text-gray-900">{formatCategoryName(currentCategory)}</span>
              </>
            )}
          </div>

          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
