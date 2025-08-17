"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight, Package, Mail, Home, Download, Star, Truck, Shield, Clock, Gift } from "lucide-react"

export default function OrderSuccessClientPage() {
  const [countdown, setCountdown] = useState(10)
  const [autoRedirect, setAutoRedirect] = useState(true)

  // Generate a random order number for demo
  const orderNumber = `SH${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  useEffect(() => {
    if (autoRedirect && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (autoRedirect && countdown === 0) {
      window.location.href = "/"
    }
  }, [countdown, autoRedirect])

  const handleStopRedirect = () => {
    setAutoRedirect(false)
  }

  const handleGoHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/30 rounded-full animate-pulse-slow"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-conic from-green-100/20 via-blue-100/20 to-green-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl mx-auto">
          {/* Main Success Card */}
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm mb-8 animate-slide-up">
            <CardContent className="p-8 lg:p-12 text-center">
              {/* Success Animation */}
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-gentle shadow-lg">
                  <Check className="h-12 w-12 text-white" />
                </div>

                {/* Confetti effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-pink-400 rounded-full animate-ping ml-8"
                    style={{ animationDelay: "1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-ping -ml-16"
                    style={{ animationDelay: "1.5s" }}
                  ></div>
                </div>
              </div>

              {/* Success Message */}
              <div className="mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-slide-up text-balance">
                  🎉 Order Successful!
                </h1>
                <p
                  className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto animate-slide-up text-pretty"
                  style={{ animationDelay: "0.2s" }}
                >
                  Thank you for your purchase! Your order has been confirmed and will be processed shortly.
                </p>

                {/* Order Details */}
                <div
                  className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6 animate-slide-up"
                  style={{ animationDelay: "0.4s" }}
                >
                  <Package className="h-4 w-4 mr-2" />
                  <span className="font-semibold">Order #{orderNumber}</span>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-gray-50 rounded-2xl p-8 mb-8 animate-slide-up" style={{ animationDelay: "0.6s" }}>
                <h3 className="text-lg font-bold text-gray-900 mb-6">What happens next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Confirmation Email</h4>
                    <p className="text-sm text-gray-600">Sent to your email address</p>
                    <Badge className="mt-2 bg-green-500">✓ Complete</Badge>
                  </div>

                  <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Package className="h-8 w-8 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Processing</h4>
                    <p className="text-sm text-gray-600">Order being prepared</p>
                    <Badge variant="secondary" className="mt-2">
                      In Progress
                    </Badge>
                  </div>

                  <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Truck className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Shipping</h4>
                    <p className="text-sm text-gray-600">On its way to you</p>
                    <Badge variant="outline" className="mt-2">
                      Pending
                    </Badge>
                  </div>

                  <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Gift className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Delivery</h4>
                    <p className="text-sm text-gray-600">Estimated: {estimatedDelivery}</p>
                    <Badge variant="outline" className="mt-2">
                      3-5 Days
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-up"
                style={{ animationDelay: "0.8s" }}
              >
                <Button
                  onClick={handleGoHome}
                  size="lg"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Continue Shopping
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400"
                  onClick={() => window.print()}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Receipt
                </Button>
              </div>

              {/* Auto-redirect notification */}
              {autoRedirect && (
                <div
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-slide-up"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="flex items-center justify-center space-x-2 text-blue-800">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      Redirecting to home page in <span className="font-bold">{countdown}</span> seconds
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStopRedirect}
                    className="mt-2 text-blue-600 hover:text-blue-800"
                  >
                    Stay on this page
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: "1.2s" }}>
            {/* Customer Support */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Need Help?</h3>
                    <p className="text-sm text-gray-600">We're here to assist you</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:support@shophub.com" className="text-blue-600 hover:underline">
                      support@shophub.com
                    </a>
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    <a href="tel:+1-555-0123" className="text-blue-600 hover:underline">
                      (555) 012-3456
                    </a>
                  </p>
                  <p>
                    <strong>Hours:</strong> Mon-Fri 9AM-6PM EST
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Review Invitation */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Share Your Experience</h3>
                    <p className="text-sm text-gray-600">Help other customers</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Once you receive your order, we'd love to hear about your experience!
                </p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Star className="mr-2 h-4 w-4" />
                  Leave a Review
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 animate-slide-up" style={{ animationDelay: "1.4s" }}>
            <p className="text-gray-600 text-sm">
              Thank you for choosing ShopHub! We appreciate your business and look forward to serving you again.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
