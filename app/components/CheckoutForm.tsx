"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Check,
  AlertCircle,
  Smartphone,
  Banknote,
  Wallet,
  QrCode,
} from "lucide-react";
import { useCart } from "@/app/contexts/CartContext";

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
  upiId: string;
  phoneNumber: string;
}

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Visa, Mastercard, American Express",
  },
  {
    id: "upi",
    name: "UPI Payment",
    icon: Smartphone,
    description: "Google Pay, PhonePe, Paytm",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    icon: Banknote,
    description: "Pay when you receive",
  },
  {
    id: "wallet",
    name: "Digital Wallet",
    icon: Wallet,
    description: "PayPal, Apple Pay, Google Pay",
  },
  {
    id: "netbanking",
    name: "Net Banking",
    icon: QrCode,
    description: "All major banks supported",
  },
];

export default function CheckoutForm() {
  const router = useRouter();
  const { state: cartState, clearCart } = useCart();
  const { state: authState } = useAuth();
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: authState.user?.email || "",
    firstName: authState.user?.firstName || "",
    lastName: authState.user?.lastName || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: authState.user?.phone || "",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: authState.user
      ? `${authState.user.firstName} ${authState.user.lastName}`
      : "",
    upiId: "",
    phoneNumber: authState.user?.phone || "",
  });
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentStep, setPaymentStep] = useState<
    "method" | "details" | "processing"
  >("method");

  // Remove the redirect logic - let users access checkout even with empty cart for now
  useEffect(() => {
    // Just log the cart state for debugging
    console.log("Cart state in checkout:", cartState);
  }, [cartState]);

  // Show empty cart message but don't redirect
  if (cartState.items.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some items to your cart to proceed with checkout.
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const calculateTax = (subtotal: number) => subtotal * 0.08; // 8% tax
  const calculateShipping = (subtotal: number) => (subtotal >= 50 ? 0 : 9.99);

  const subtotal = cartState.total;
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

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
    ];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Payment validation based on method
    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number";
      }

      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = "Expiry date is required";
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Please enter date in MM/YY format";
      }

      if (!formData.cvv.trim()) {
        newErrors.cvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "Please enter a valid CVV";
      }

      if (!formData.nameOnCard.trim()) {
        newErrors.nameOnCard = "Name on card is required";
      }
    } else if (formData.paymentMethod === "upi") {
      if (!formData.upiId.trim()) {
        newErrors.upiId = "UPI ID is required";
      } else if (!/^[\w.-]+@[\w.-]+$/.test(formData.upiId)) {
        newErrors.upiId = "Please enter a valid UPI ID (e.g., user@paytm)";
      }
    } else if (formData.paymentMethod === "netbanking") {
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required for verification";
      } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
        newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulatePayment = async (
    method: string
  ): Promise<{ success: boolean; message: string }> => {
    // Simulate different payment processing times and scenarios
    const processingTime =
      {
        card: 3000,
        upi: 2000,
        cod: 1000,
        wallet: 2500,
        netbanking: 4000,
      }[method] || 3000;

    await new Promise((resolve) => setTimeout(resolve, processingTime));

    // Simulate different success rates (all will succeed for demo)
    const scenarios = {
      card: { success: true, message: "Card payment processed successfully!" },
      upi: { success: true, message: "UPI payment completed successfully!" },
      cod: { success: true, message: "Cash on Delivery order confirmed!" },
      wallet: { success: true, message: "Digital wallet payment successful!" },
      netbanking: { success: true, message: "Net banking payment processed!" },
    };

    return scenarios[method as keyof typeof scenarios] || scenarios.card;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setPaymentStep("processing");

    try {
      // Simulate payment processing
      const result = await simulatePayment(formData.paymentMethod);

      if (result.success) {
        // Clear cart and show success
        setOrderComplete(true);
        clearCart();

        // Redirect to success page after a delay
        setTimeout(() => {
          router.push("/order-success");
        }, 2000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setIsProcessing(false);
      setPaymentStep("details");
      // Handle payment error - you could show an error message here
    }
  };

  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.id === formData.paymentMethod
  );

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your {selectedPaymentMethod?.name.toLowerCase()} payment has been
              processed successfully.
            </p>
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to order confirmation...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
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
                {authState.isAuthenticated && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 text-sm text-blue-800">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {authState.user?.firstName.charAt(0)}
                        </span>
                      </div>
                      <span>
                        Signed in as {authState.user?.firstName}{" "}
                        {authState.user?.lastName}
                      </span>
                    </div>
                  </div>
                )}
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
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Input
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="ZIP code"
                      value={formData.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      className={errors.zipCode ? "border-red-500" : ""}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Select
                      value={formData.state}
                      onValueChange={(value) =>
                        handleInputChange("state", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.state ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="IL">Illinois</SelectItem>
                        <SelectItem value="PA">Pennsylvania</SelectItem>
                        <SelectItem value="OH">Ohio</SelectItem>
                        <SelectItem value="GA">Georgia</SelectItem>
                        <SelectItem value="NC">North Carolina</SelectItem>
                        <SelectItem value="MI">Michigan</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <Select
                      value={formData.country}
                      onValueChange={(value) =>
                        handleInputChange("country", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="IN">India</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={`relative flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === method.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          handleInputChange("paymentMethod", method.id)
                        }
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={() =>
                            handleInputChange("paymentMethod", method.id)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            formData.paymentMethod === method.id
                              ? "bg-blue-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              formData.paymentMethod === method.id
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {method.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {method.description}
                          </p>
                        </div>
                        {formData.paymentMethod === method.id && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Payment Details based on selected method */}
                {formData.paymentMethod === "card" && (
                  <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-gray-900">
                      Card Details
                    </h5>
                    <div>
                      <Input
                        placeholder="Name on card"
                        value={formData.nameOnCard}
                        onChange={(e) =>
                          handleInputChange("nameOnCard", e.target.value)
                        }
                        className={errors.nameOnCard ? "border-red-500" : ""}
                      />
                      {errors.nameOnCard && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.nameOnCard}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        placeholder="Card number"
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\s/g, "")
                            .replace(/(\d{4})/g, "$1 ")
                            .trim();
                          handleInputChange("cardNumber", value);
                        }}
                        maxLength={19}
                        className={errors.cardNumber ? "border-red-500" : ""}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length >= 2) {
                              value =
                                value.substring(0, 2) +
                                "/" +
                                value.substring(2, 4);
                            }
                            handleInputChange("expiryDate", value);
                          }}
                          maxLength={5}
                          className={errors.expiryDate ? "border-red-500" : ""}
                        />
                        {errors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.expiryDate}
                          </p>
                        )}
                      </div>
                      <div>
                        <Input
                          placeholder="CVV"
                          value={formData.cvv}
                          onChange={(e) =>
                            handleInputChange(
                              "cvv",
                              e.target.value.replace(/\D/g, "")
                            )
                          }
                          maxLength={4}
                          className={errors.cvv ? "border-red-500" : ""}
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "upi" && (
                  <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-gray-900">UPI Details</h5>
                    <div>
                      <Input
                        placeholder="UPI ID (e.g., user@paytm)"
                        value={formData.upiId}
                        onChange={(e) =>
                          handleInputChange("upiId", e.target.value)
                        }
                        className={errors.upiId ? "border-red-500" : ""}
                      />
                      {errors.upiId && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.upiId}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      You&apos;ll be redirected to your UPI app to complete the
                      payment.
                    </p>
                  </div>
                )}

                {formData.paymentMethod === "cod" && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-800 mb-2">
                      Cash on Delivery
                    </h5>
                    <p className="text-sm text-green-700">
                      Pay with cash when your order is delivered. Additional
                      charges may apply.
                    </p>
                    <div className="mt-3 p-3 bg-green-100 rounded-md">
                      <p className="text-sm text-green-800">
                        <strong>COD Fee:</strong> $2.99 (included in total)
                      </p>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "wallet" && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-800 mb-2">
                      Digital Wallet
                    </h5>
                    <p className="text-sm text-blue-700">
                      You&apos;ll be redirected to your preferred wallet
                      provider to complete the payment.
                    </p>
                    <div className="mt-3 flex space-x-2">
                      <Badge variant="secondary">PayPal</Badge>
                      <Badge variant="secondary">Apple Pay</Badge>
                      <Badge variant="secondary">Google Pay</Badge>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "netbanking" && (
                  <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-gray-900">Net Banking</h5>
                    <div>
                      <Input
                        placeholder="Phone number for verification"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          handleInputChange(
                            "phoneNumber",
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        maxLength={10}
                        className={errors.phoneNumber ? "border-red-500" : ""}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      You&apos;ll be redirected to your bank&apos;s secure
                      portal to complete the payment.
                    </p>
                  </div>
                )}
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
                  <span>
                    {formData.paymentMethod === "card" &&
                      "Processing Card Payment..."}
                    {formData.paymentMethod === "upi" && "Connecting to UPI..."}
                    {formData.paymentMethod === "cod" && "Confirming Order..."}
                    {formData.paymentMethod === "wallet" &&
                      "Connecting to Wallet..."}
                    {formData.paymentMethod === "netbanking" &&
                      "Redirecting to Bank..."}
                  </span>
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
                  <div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex space-x-3"
                  >
                    <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </span>
                        {item.selectedSize && (
                          <Badge variant="secondary" className="text-xs">
                            {item.selectedSize}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
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
                {formData.paymentMethod === "cod" && (
                  <div className="flex justify-between text-sm">
                    <span>COD Fee</span>
                    <span>$2.99</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>
                      {formatPrice(
                        total + (formData.paymentMethod === "cod" ? 2.99 : 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method Display */}
              {selectedPaymentMethod && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <selectedPaymentMethod.icon className="h-4 w-4" />
                    <span>Paying with {selectedPaymentMethod.name}</span>
                  </div>
                </div>
              )}

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
  );
}
