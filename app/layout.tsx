import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { CartProvider } from "./contexts/CartContext"
import CartSidebar from "./components/CartSidebar"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "ShopHub - Premium E-commerce Platform",
    template: "%s | ShopHub",
  },
  description:
    "Discover premium products at unbeatable prices. Shop the latest trends in electronics, fashion, and lifestyle with fast, free shipping.",
  keywords: ["e-commerce", "online shopping", "premium products", "electronics", "fashion", "lifestyle"],
  authors: [{ name: "ShopHub Team" }],
  creator: "ShopHub",
  publisher: "ShopHub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shophub.com",
    title: "ShopHub - Premium E-commerce Platform",
    description: "Discover premium products at unbeatable prices",
    siteName: "ShopHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopHub - Premium E-commerce Platform",
    description: "Discover premium products at unbeatable prices",
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <CartProvider>
          {children}
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  )
}
