import type { Metadata } from "next";
import Hero from "./components/Hero";
import FeaturedProducts from "./components/FeaturedProducts";
import Categories from "./components/Categories";
import Footer from "./components/Footer";
import { getFeaturedProducts, getCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "ShopHub - Discover Premium Products at Unbeatable Prices",
  description:
    "Shop the latest trends in electronics, fashion, and lifestyle. Premium quality products with fast, free shipping and excellent customer service.",
  openGraph: {
    title: "ShopHub - Discover Premium Products at Unbeatable Prices",
    description:
      "Shop the latest trends in electronics, fashion, and lifestyle",
    type: "website",
  },
};

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <FeaturedProducts products={featuredProducts} />
      <Categories categories={categories} />
      <Footer />
    </main>
  );
}
