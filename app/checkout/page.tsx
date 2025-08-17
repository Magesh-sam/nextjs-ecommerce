import type { Metadata } from "next"
import CheckoutClientPage from "./CheckoutClientPage"

export const metadata: Metadata = {
  title: "Checkout - Complete Your Order | ShopHub",
  description: "Secure checkout process for your ShopHub order. Fast, safe, and easy payment options.",
}

export default function CheckoutPage() {
  return <CheckoutClientPage />
}
