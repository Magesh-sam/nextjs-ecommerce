"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react"
import { useCart } from "@/app/contexts/CartContext"
import { useRouter } from "next/navigation"

export default function CartSidebar() {
  const { state, removeItem, updateQuantity, closeCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const router = useRouter()

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  const handleCheckout = () => {
    if (state.items.length === 0) {
      return
    }

    setIsCheckingOut(true)

    // Use Next.js router for better navigation
    router.push("/checkout")

    // Close cart after navigation
    setTimeout(() => {
      closeCart()
      setIsCheckingOut(false)
    }, 500)
  }

  if (!state.isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={closeCart} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              {state.itemCount > 0 && <Badge className="bg-blue-600">{state.itemCount}</Badge>}
            </div>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some products to get started!</p>
                <Button
                  onClick={closeCart}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <Card
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="border border-gray-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        {/* Product Image */}
                        <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={item.thumbnail || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 font-medium">{item.brand}</p>
                              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.title}</h4>

                              {/* Variants */}
                              {(item.selectedSize || item.selectedColor) && (
                                <div className="flex items-center space-x-2 mt-1">
                                  {item.selectedSize && (
                                    <Badge variant="secondary" className="text-xs">
                                      Size: {item.selectedSize}
                                    </Badge>
                                  )}
                                  {item.selectedColor && (
                                    <Badge variant="secondary" className="text-xs">
                                      Color: {item.selectedColor}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              {/* Price */}
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-sm font-bold text-gray-900">{formatPrice(item.price)}</span>
                                {item.discountPercentage > 0 && (
                                  <span className="text-xs text-gray-500 line-through">
                                    {formatPrice(item.price / (1 - item.discountPercentage / 100))}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-red-600"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Item Total */}
                            <span className="text-sm font-bold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Subtotal:</span>
                <span>{formatPrice(state.total)}</span>
              </div>

              {/* Shipping Info */}
              <div className="text-sm text-gray-600 text-center">
                {state.total >= 50 ? (
                  <span className="text-green-600 font-medium">🎉 Free shipping included!</span>
                ) : (
                  <span>Add {formatPrice(50 - state.total)} more for free shipping</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
                >
                  {isCheckingOut ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Checkout</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>

                <Button variant="outline" onClick={closeCart} className="w-full bg-transparent">
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
