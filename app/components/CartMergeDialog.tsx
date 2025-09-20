"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Plus, Check } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { useCart } from "@/app/contexts/CartContext"

export default function CartMergeDialog() {
  const { state: authState } = useAuth()
  const { state: cartState, clearCart } = useCart()
  const [showMergeDialog, setShowMergeDialog] = useState(false)
  const [anonymousCartItems, setAnonymousCartItems] = useState<number>(0)

  useEffect(() => {
    // Check if user just logged in and had items in anonymous cart
    if (authState.isAuthenticated && !authState.isLoading) {
      const checkAnonymousCart = () => {
        try {
          const anonymousCart = localStorage.getItem("shophub-cart-anonymous")
          if (anonymousCart) {
            const items = JSON.parse(anonymousCart)
            if (items.length > 0) {
              setAnonymousCartItems(items.length)
              setShowMergeDialog(true)
            }
          }
        } catch (error) {
          console.error("Error checking anonymous cart:", error)
        }
      }

      // Small delay to ensure cart has loaded
      const timer = setTimeout(checkAnonymousCart, 500)
      return () => clearTimeout(timer)
    }
  }, [authState.isAuthenticated, authState.isLoading])

  const handleKeepBoth = () => {
    // In a real app, you would merge the carts here
    // For now, we'll just keep the current user cart
    setShowMergeDialog(false)
    // Clear anonymous cart
    localStorage.removeItem("shophub-cart-anonymous")
  }

  const handleKeepUserCart = () => {
    setShowMergeDialog(false)
    // Clear anonymous cart
    localStorage.removeItem("shophub-cart-anonymous")
  }

  const handleKeepAnonymousCart = () => {
    // Clear current user cart and use anonymous cart
    clearCart()
    setShowMergeDialog(false)
    // The anonymous cart will be loaded automatically
    window.location.reload()
  }

  if (!showMergeDialog || !authState.isAuthenticated) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl animate-slide-up">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Welcome Back!</CardTitle>
          <p className="text-gray-600">We found items in your cart from before you signed in.</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Your saved cart:</span>
              <span className="text-sm font-bold text-blue-600">{cartState.itemCount} items</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Previous session:</span>
              <span className="text-sm font-bold text-orange-600">{anonymousCartItems} items</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleKeepBoth}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Merge Both Carts
            </Button>

            <Button onClick={handleKeepUserCart} variant="outline" className="w-full bg-transparent">
              <Check className="h-4 w-4 mr-2" />
              Keep My Saved Cart
            </Button>

            <Button onClick={handleKeepAnonymousCart} variant="outline" className="w-full bg-transparent">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Use Previous Session Cart
            </Button>
          </div>

          <div className="text-center">
            <button onClick={() => setShowMergeDialog(false)} className="text-sm text-gray-500 hover:text-gray-700">
              Decide later
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
