"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Truck, HeadphonesIcon } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen flex items-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200/70 to-transparent rounded-full animate-bounce-gentle"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-200/70 to-transparent rounded-full animate-bounce-gentle"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-conic from-blue-100/30 via-purple-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust indicators */}
          <div className="inline-flex items-center glass rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-8 animate-fade-in">
            <Star className="mr-2 h-4 w-4 fill-current text-yellow-500" />
            <span className="text-balance">
              Trusted by 50,000+ customers worldwide
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-8 animate-slide-up text-balance">
            Discover Premium{" "}
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Products
            </span>
            <span className="block text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-600 mt-2">
              at Unbeatable Prices
            </span>
          </h1>

          {/* Description */}
          <p
            className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up text-pretty"
            style={{ animationDelay: "0.2s" }}
          >
            Shop the latest trends in electronics, fashion, and lifestyle.
            Premium quality products with fast, free shipping and excellent
            customer service.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              onClick={() => {
                // Scroll to featured products section
                document
                  .getElementById("featured-products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="group border-2 border-gray-300 hover:border-gray-400 px-8 py-4 text-lg font-semibold transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg"
              onClick={() => {
                // Scroll to categories section
                document
                  .getElementById("categories")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="transition-colors group-hover:text-blue-600">
                Explore Categories
              </span>
            </Button>
          </div>

          {/* Trust badges */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Free Shipping
              </h3>
              <p className="text-sm text-gray-600 text-balance">
                On orders over $50
              </p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Secure Payment
              </h3>
              <p className="text-sm text-gray-600 text-balance">
                100% protected
              </p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                <HeadphonesIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">24/7 Support</h3>
              <p className="text-sm text-gray-600 text-balance">
                Always here to help
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
