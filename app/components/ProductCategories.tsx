import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { Category } from "@/lib/types"
import { getProductsByCategory } from "@/lib/api"

interface ProductCategoriesProps {
  categories: Category[]
}

// Category images mapping (you can replace these with actual category images)
const categoryImages: Record<string, string> = {
  smartphones: "/placeholder.svg?height=200&width=300&text=Smartphones",
  laptops: "/placeholder.svg?height=200&width=300&text=Laptops",
  fragrances: "/placeholder.svg?height=200&width=300&text=Fragrances",
  skincare: "/placeholder.svg?height=200&width=300&text=Skincare",
  groceries: "/placeholder.svg?height=200&width=300&text=Groceries",
  "home-decoration": "/placeholder.svg?height=200&width=300&text=Home+Decoration",
  furniture: "/placeholder.svg?height=200&width=300&text=Furniture",
  tops: "/placeholder.svg?height=200&width=300&text=Tops",
  "womens-dresses": "/placeholder.svg?height=200&width=300&text=Women's+Dresses",
  "womens-shoes": "/placeholder.svg?height=200&width=300&text=Women's+Shoes",
  "mens-shirts": "/placeholder.svg?height=200&width=300&text=Men's+Shirts",
  "mens-shoes": "/placeholder.svg?height=200&width=300&text=Men's+Shoes",
  "mens-watches": "/placeholder.svg?height=200&width=300&text=Men's+Watches",
  "womens-watches": "/placeholder.svg?height=200&width=300&text=Women's+Watches",
  "womens-bags": "/placeholder.svg?height=200&width=300&text=Women's+Bags",
  "womens-jewellery": "/placeholder.svg?height=200&width=300&text=Women's+Jewellery",
  sunglasses: "/placeholder.svg?height=200&width=300&text=Sunglasses",
  automotive: "/placeholder.svg?height=200&width=300&text=Automotive",
  motorcycle: "/placeholder.svg?height=200&width=300&text=Motorcycle",
  lighting: "/placeholder.svg?height=200&width=300&text=Lighting",
}

export default async function ProductCategories({ categories }: ProductCategoriesProps) {
  // Take first 6 categories for display
  const displayCategories = categories.slice(0, 6)

  // Get product counts for each category
  const categoriesWithCounts = await Promise.all(
    displayCategories.map(async (category) => {
      const products = await getProductsByCategory(category.slug, 1)
      return {
        ...category,
        productCount: products.length > 0 ? Math.floor(Math.random() * 1000) + 100 : 0, // Simulated count since API doesn't provide total
      }
    }),
  )

  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (categoriesWithCounts.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">No categories available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of product categories, each carefully curated to meet your specific needs and
            preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesWithCounts.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={categoryImages[category.slug] || "/placeholder.svg?height=200&width=300"}
                      alt={formatCategoryName(category.name)}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{formatCategoryName(category.name)}</h3>
                      <p className="text-sm opacity-90">Premium quality products</p>
                      <p className="text-xs opacity-75 mt-1">{category.productCount}+ items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/categories">
            <Button variant="outline" size="lg">
              View All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
