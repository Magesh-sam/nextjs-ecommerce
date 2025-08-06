import type { Product, ProductsResponse, Category } from "./types";

const BASE_URL = "https://dummyjson.com";

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=0`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch featured products");
    }

    const data: ProductsResponse = await response.json();
    return data.products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const categories: Category[] = await response.json();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getProductsByCategory(
  category: string,
  limit = 20,
  skip = 0
): Promise<{ products: Product[]; total: number }> {
  try {
    const response = await fetch(
      `${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products for category: ${category}`);
    }

    const data: ProductsResponse = await response.json();
    return {
      products: data.products,
      total: data.total,
    };
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return { products: [], total: 0 };
  }
}

export async function getProducts(
  limit = 10,
  skip = 0
): Promise<{ products: Product[]; total: number }> {
  try {
    const response = await fetch(
      `${BASE_URL}/products?limit=${limit}&skip=${skip}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data: ProductsResponse = await response.json();
    return {
      products: data.products,
      total: data.total,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], total: 0 };
  }
}

export async function searchProducts(
  query: string,
  limit = 20
): Promise<Product[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/products/search?q=${encodeURIComponent(
        query
      )}&limit=${limit}`,
      {
        next: { revalidate: 1800 }, // Cache for 30 minutes
      }
    );

    if (!response.ok) {
      throw new Error("Failed to search products");
    }

    const data: ProductsResponse = await response.json();
    return data.products;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}
