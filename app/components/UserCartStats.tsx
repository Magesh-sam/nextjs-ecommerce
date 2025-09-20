"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, TrendingUp, Package, Star } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"

interface CartHistory {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  favoriteCategory: string
}

export default function UserCartStats() {
  const { state: authState } = useAuth()
  const [cartHistory, setCartHistory] = useState<CartHistory | null>(null)

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      // Simulate loading user's cart history
      const loadCartHistory = () => {
        // In a real app, this would be an API call
        const mockHistory: CartHistory = {
          totalOrders: Math.floor(Math.random() * 20) + 5,
          totalSpent: Math.floor(Math.random() * 2000) + 500,
          averageOrderValue: Math.floor(Math.random() * 100) + 50,
          favoriteCategory: ["Electronics", "Fashion", "Home", "Beauty"][Math.floor(Math.random() * 4)],
        }
        setCartHistory(mockHistory)
      }

      const timer = setTimeout(loadCartHistory, 1000)
      return () => clearTimeout(timer)
    } else {
      setCartHistory(null)
    }
  }, [authState.isAuthenticated, authState.user])

  if (!authState.isAuthenticated || !cartHistory) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs animate-slide-up" style={{ animationDelay: "2s" }}>
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Your Shopping Stats</h4>
              <p className="text-xs text-gray-600">Welcome back, {authState.user.firstName}!</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-blue-50 rounded-lg p-2">
              <div className="flex items-center justify-center mb-1">
                <Package className="h-3 w-3 text-blue-600 mr-1" />
                <span className="text-sm font-bold text-blue-600">{cartHistory.totalOrders}</span>
              </div>
              <p className="text-xs text-gray-600">Orders</p>
            </div>

            <div className="bg-green-50 rounded-lg p-2">
              <div className="flex items-center justify-center mb-1">
                <span className="text-sm font-bold text-green-600">${cartHistory.totalSpent}</span>
              </div>
              <p className="text-xs text-gray-600">Total Spent</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-2">
              <div className="flex items-center justify-center mb-1">
                <span className="text-sm font-bold text-purple-600">${cartHistory.averageOrderValue}</span>
              </div>
              <p className="text-xs text-gray-600">Avg Order</p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-2">
              <div className="flex items-center justify-center mb-1">
                <Star className="h-3 w-3 text-yellow-600 mr-1" />
                <span className="text-xs font-bold text-yellow-600">{cartHistory.favoriteCategory}</span>
              </div>
              <p className="text-xs text-gray-600">Favorite</p>
            </div>
          </div>

          <div className="mt-3 text-center">
            <Badge variant="secondary" className="text-xs">
              <ShoppingCart className="h-3 w-3 mr-1" />
              Personal Cart Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
