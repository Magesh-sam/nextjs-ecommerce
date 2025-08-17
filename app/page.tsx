import type { Metadata } from "next"
import Header from "./components/Header"
import Hero from "./components/Hero"
import FeaturedProducts from "./components/FeaturedProducts"
import Categories from "./components/Categories"
import Footer from "./components/Footer"
import { getFeaturedProducts, getCategories } from "@/lib/api"

export const metadata: Metadata = {
  title: "ShopHub - Discover Premium Products at Unbeatable Prices",
  description:
    "Shop the latest trends in electronics, fashion, and lifestyle. Premium quality products with fast, free shipping and excellent customer service.",
  openGraph: {
    title: "ShopHub - Discover Premium Products at Unbeatable Prices",
    description: "Shop the latest trends in electronics, fashion, and lifestyle",
    type: "website",
  },
}

export default async function Home() {
  try {
    const [featuredProducts, categories] = await Promise.all([
      getFeaturedProducts(8).catch((err) => {
        console.error("Failed to load featured products:", err)
        return []
      }),
      getCategories().catch((err) => {
        console.error("Failed to load categories:", err)
        return []
      }),
    ])

    return (
      <main className="min-h-screen bg-white">
        <Header />
        <Hero />
        <FeaturedProducts products={featuredProducts} />
        <Categories categories={categories} />
        <Footer />
      </main>
    )
  } catch (error) {
    console.error("Error loading home page:", error)
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <Hero />
        <FeaturedProducts products={[]} />
        <Categories categories={[]} />
        <Footer />
      </main>
    )
  }
}
