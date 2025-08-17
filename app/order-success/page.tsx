import type { Metadata } from "next"
import OrderSuccessClientPage from "./OrderSuccessClientPage"

export const metadata: Metadata = {
  title: "Order Successful - Thank You | ShopHub",
  description: "Your order has been successfully placed. Thank you for shopping with ShopHub!",
}

export default function OrderSuccessPage() {
  return <OrderSuccessClientPage />
}
