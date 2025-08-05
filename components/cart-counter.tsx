"use client"

import { useCart } from "@/contexts/cart-context"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function CartCounter() {
  const { cart } = useCart()

  // Calculate the total number of items in the cart
  const itemCount = cart ? cart.reduce((total, item) => total + (item.quantity || 1), 0) : 0

  return (
    <Link href="/cart" className="text-gray-700 hover:text-blue-600 transition-colors relative">
      <ShoppingCart size={24} />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
          {itemCount}
        </span>
      )}
    </Link>
  )
}
