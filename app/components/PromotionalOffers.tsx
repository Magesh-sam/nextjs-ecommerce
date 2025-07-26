import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Zap, Gift } from "lucide-react"
import { getProducts } from "@/lib/api"

export default async function PromotionalOffers() {
  // Get a random product for deal of the day
  const products = await getProducts(30)
  const dealProduct = products.find((p) => p.discountPercentage > 10) || products[0]

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Special Offers</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these limited-time deals and exclusive promotions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Main Promotional Banner */}
          <Card className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <CardContent className="p-8 lg:p-12">
              <div className="flex items-center mb-4">
                <Zap className="h-6 w-6 mr-2" />
                <span className="text-sm font-semibold uppercase tracking-wide">Flash Sale</span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">Up to 70% Off</h3>
              <p className="text-lg mb-6 opacity-90">Electronics & Gadgets - Limited time offer on premium brands</p>
              <div className="flex items-center mb-6">
                <Clock className="h-5 w-5 mr-2" />
                <span className="text-sm">Ends in 2 days, 14 hours</span>
              </div>
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Shop Flash Sale
              </Button>
            </CardContent>
            <div className="absolute -right-8 -bottom-8 opacity-20">
              <div className="w-32 h-32 rounded-full bg-white"></div>
            </div>
          </Card>

          {/* Secondary Offer */}
          <Card className="relative overflow-hidden bg-gradient-to-r from-green-500 to-teal-600 text-white border-0">
            <CardContent className="p-8 lg:p-12">
              <div className="flex items-center mb-4">
                <Gift className="h-6 w-6 mr-2" />
                <span className="text-sm font-semibold uppercase tracking-wide">New Customer</span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">20% Off First Order</h3>
              <p className="text-lg mb-6 opacity-90">Welcome bonus for new customers + free shipping</p>
              <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                Claim Offer
              </Button>
            </CardContent>
            <div className="absolute -right-8 -top-8 opacity-20">
              <div className="w-24 h-24 rounded-full bg-white"></div>
            </div>
          </Card>
        </div>

        {/* Deal of the Day with Real Product */}
        {dealProduct && (
          <Card className="border-2 border-dashed border-orange-300 bg-orange-50">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center bg-orange-100 text-orange-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    Deal of the Day
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{dealProduct.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{dealProduct.description}</p>
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-3xl font-bold text-orange-600">${dealProduct.price.toFixed(2)}</span>
                    {dealProduct.discountPercentage > 0 && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          ${(dealProduct.price / (1 - dealProduct.discountPercentage / 100)).toFixed(2)}
                        </span>
                        <span className="bg-orange-600 text-white text-sm font-semibold px-2 py-1 rounded">
                          {Math.round(dealProduct.discountPercentage)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm text-gray-600">{dealProduct.rating.toFixed(1)} rating</span>
                    </div>
                    <div className="text-sm text-gray-600">{dealProduct.stock} in stock</div>
                  </div>
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                    Get Deal Now
                  </Button>
                </div>
                <div className="relative">
                  <Image
                    src={dealProduct.thumbnail || "/placeholder.svg"}
                    alt={dealProduct.title}
                    width={400}
                    height={300}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
