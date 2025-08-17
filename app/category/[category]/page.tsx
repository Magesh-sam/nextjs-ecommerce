import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Header from "../../components/Header"
import CategoryHero from "../../components/CategoryHero"
import ProductGrid from "../../components/ProductGrid"
import Footer from "../../components/Footer"
import CategoryNavigation from "../../components/CategoryNavigation"
import { getProductsByCategory, getCategories } from "@/lib/api"
import type { CategoryPageProps } from "@/lib/types"

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    category: category.slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = params.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return {
    title: `${categoryName} - Premium Products | ShopHub`,
    description: `Discover premium ${categoryName.toLowerCase()} products at unbeatable prices. Shop the latest trends with fast, free shipping.`,
    openGraph: {
      title: `${categoryName} - Premium Products | ShopHub`,
      description: `Discover premium ${categoryName.toLowerCase()} products at unbeatable prices`,
      type: "website",
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = params
  const page = Number.parseInt(searchParams.page || "1")
  const limit = Number.parseInt(searchParams.limit || "20")
  const skip = (page - 1) * limit

  try {
    // Fetch categories for navigation
    const categories = await getCategories().catch((err) => {
      console.error("Failed to load categories:", err)
      return []
    })

    // Check if category exists (only if we have categories loaded)
    if (categories.length > 0) {
      const categoryExists = categories.some((cat) => cat.slug === category)
      if (!categoryExists) {
        notFound()
      }
    }

    // Fetch products for this category
    const { products, total } = await getProductsByCategory(category, limit, skip).catch((err) => {
      console.error("Failed to load category products:", err)
      return { products: [], total: 0 }
    })

    const totalPages = Math.ceil(total / limit)

    return (
      <main className="min-h-screen bg-white">
        <Header />
        <CategoryNavigation currentCategory={category} />
        <CategoryHero category={category} totalProducts={total} />
        <ProductGrid
          products={products}
          category={category}
          currentPage={page}
          totalPages={totalPages}
          totalProducts={total}
        />
        <Footer />
      </main>
    )
  } catch (error) {
    console.error("Error loading category page:", error)
    // Return a basic error page
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">We're having trouble loading this category. Please try again later.</p>
          <a href="/" className="text-blue-600 hover:underline">
            Return to Home
          </a>
        </div>
        <Footer />
      </main>
    )
  }
}
