import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "../../components/Navigation";
import CategoryHero from "../../components/CategoryHero";
import ProductGrid from "../../components/ProductGrid";
import Footer from "../../components/Footer";
import { getProductsByCategory, getCategories } from "@/lib/api";
import type { CategoryPageProps } from "@/lib/types";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const categoryName = params.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${categoryName} - Premium Products | ShopHub`,
    description: `Discover premium ${categoryName.toLowerCase()} products at unbeatable prices. Shop the latest trends with fast, free shipping.`,
    openGraph: {
      title: `${categoryName} - Premium Products | ShopHub`,
      description: `Discover premium ${categoryName.toLowerCase()} products at unbeatable prices`,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = params;
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "20");
  const skip = (page - 1) * limit;

  // Fetch categories for navigation
  const categories = await getCategories();

  // Check if category exists
  const categoryExists = categories.some((cat) => cat.slug === category);
  if (!categoryExists) {
    notFound();
  }

  // Fetch products for this category
  const { products, total } = await getProductsByCategory(
    category,
    limit,
    skip
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="min-h-screen bg-white">
      <Navigation
        categories={categories}
        showBackButton
        currentCategory={category}
      />
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
  );
}
