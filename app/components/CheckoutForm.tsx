"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CreditCard, Truck, Shield, Check, AlertCircle } from "lucide-react"
import { useCart } from "@/app/contexts/CartContext"

interface CheckoutFormData {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  paymentMethod: string
  cardNumber: string
  expiryDate: string
  cvv: string
  nameOnCard: string
}

export default function CheckoutForm() {
  const router = useRouter()
  const { state: cartState, clearCart } = useCart()
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  // Remove the redirect logic - let users access checkout even with empty cart for now
  useEffect(() => {
    // Just log the cart state for debugging
    console.log("Cart state in checkout:", cartState)
  }, [cartState])

  // Show empty cart message but don't redirect
  if (cartState.items.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart to proceed with checkout.</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  const calculateTax = (subtotal: number) => subtotal * 0.08 // 8% tax
  const calculateShipping = (subtotal: number) => (subtotal >= 50 ? 0 : 9.99)

  const subtotal = cartState.total
  const tax = calculateTax(subtotal)
  const shipping = calculateShipping(subtotal)
  const total = subtotal + tax + shipping

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {}

    // Required fields
    const requiredFields: (keyof CheckoutFormData)[] = [
      "email",
      "firstName",
      "lastName",
      "address",
      "city",
      "state",
      "zipCode",
      "phone",
    ]

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required"
      }
    })

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Payment validation
    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required"
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number"
      }

      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = "Expiry date is required"
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Please enter date in MM/YY format"
      }

      if (!formData.cvv.trim()) {
        newErrors.cvv = "CVV is required"
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "Please enter a valid CVV"
      }

      if (!formData.nameOnCard.trim()) {
        newErrors.nameOnCard = "Name on card is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Clear cart and show success
      setOrderComplete(true)
      clearCart()

      // Redirect to success page after a delay
      setTimeout(() => {
        router.push("/order-success")
      }, 2000)
    } catch (error) {
      console.error("Payment failed:", error)
      setIsProcessing(false)
      // Handle payment error - you could show an error message here
    }
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Complete!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. You'll receive a confirmation email shortly.
            </p>
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Shop</span>
            </Button>
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Shield className="h-4 w-4 text-green-600" />
          <span>Secure Checkout</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Shipping Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Input
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <Input
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Input
                      placeholder="ZIP code"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      className={errors.zipCode ? "border-red-500" : ""}
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        {/* Add more states as needed */}
                      </SelectContent>
                    </Select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    placeholder="Name on card"
                    value={formData.nameOnCard}
                    onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
                    className={errors.nameOnCard ? "border-red-500" : ""}
                  />
                  {errors.nameOnCard && <p className="text-red-500 text-sm mt-1">{errors.nameOnCard}</p>}
                </div>
                <div>
                  <Input
                    placeholder="Card number"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      // Format card number with spaces
                      const value = e.target.value
                        .replace(/\s/g, "")
                        .replace(/(\d{4})/g, "$1 ")
                        .trim()
                      handleInputChange("cardNumber", value)
                    }}
                    maxLength={19}
                    className={errors.cardNumber ? "border-red-500" : ""}
                  />
                  {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => {
                        // Format expiry date
                        let value = e.target.value.replace(/\D/g, "")
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + "/" + value.substring(2, 4)
                        }
                        handleInputChange("expiryDate", value)
                      }}
                      maxLength={5}
                      className={errors.expiryDate ? "border-red-500" : ""}
                    />
                    {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <Input
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                      maxLength={4}
                      className={errors.cvv ? "border-red-500" : ""}
                    />
                    {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Payment...</span>
                </div>
              ) : (
                `Complete Order • ${formatPrice(total)}`
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-8 lg:h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartState.items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex space-x-3">
                    <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        {item.selectedSize && (
                          <Badge variant="secondary" className="text-xs">
                            {item.selectedSize}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-green-600" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Truck className="h-3 w-3 text-blue-600" />
                    <span>Fast Shipping</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
