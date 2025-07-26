import type { Product, ProductsResponse, Category } from "./types"

const BASE_URL = "https://dummyjson.com"

export async function getProducts(limit = 30): Promise<Product[]> {
  try {
    const response = await fetch(`${BASE_URL}/products?limit=${limit}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }

    const data: ProductsResponse = await response.json()
    return data.products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${BASE_URL}/products?limit=8&skip=0`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch featured products")
    }

    const data: ProductsResponse = await response.json()
    return data.products
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch categories")
    }

    const categories: Category[] = await response.json()
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getProductsByCategory(category: string, limit = 4): Promise<Product[]> {
  try {
    const response = await fetch(`${BASE_URL}/products/category/${category}?limit=${limit}`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products for category: ${category}`)
    }

    const data: ProductsResponse = await response.json()
    return data.products
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error)
    return []
  }
}
