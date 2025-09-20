"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, X } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { useCart } from "@/app/contexts/CartContext"

export default function CartPersistenceNotification() {
  const { state: authState } = useAuth()
  const { state: cartState } = useCart()
  const [showNotification, setShowNotification] = useState(false)
  const [hasShownNotification, setHasShownNotification] = useState(false)

  // Show notification when user has items in cart but is not authenticated
  useEffect(() => {
    const shouldShow =
      !authState.isAuthenticated && cartState.itemCount > 0 && !hasShownNotification && !authState.isLoading

    if (shouldShow) {
      const timer = setTimeout(() => {
        setShowNotification(true)
      }, 3000) // Show after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [authState.isAuthenticated, cartState.itemCount, hasShownNotification, authState.isLoading])

  // Hide notification when user signs in
  useEffect(() => {
    if (authState.isAuthenticated && showNotification) {
      setShowNotification(false)
      setHasShownNotification(true)
    }
  }, [authState.isAuthenticated, showNotification])

  const handleDismiss = () => {
    setShowNotification(false)
    setHasShownNotification(true)
  }

  const handleSignIn = () => {
    window.location.href = "/auth?redirect=" + encodeURIComponent(window.location.pathname)
  }

  if (!showNotification) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      <Card className="shadow-2xl border-0 bg-white backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 mb-1">Save Your Cart</h4>
              <p className="text-sm text-gray-600 mb-3">
                Sign in to save your {cartState.itemCount} item{cartState.itemCount !== 1 ? "s" : ""} and access them
                from any device.
              </p>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleSignIn}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs"
                >
                  <User className="h-3 w-3 mr-1" />
                  Sign In
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDismiss} className="text-xs">
                  Later
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-6 w-6 text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
