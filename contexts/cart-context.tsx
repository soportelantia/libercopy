"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the structure of a cart item
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl: string
  options: CartItemOptions
  // Propiedades para archivos
  fileName?: string
  fileSize?: number
  pageCount?: number
  fileUrl?: string // URL del archivo en Google Storage
  tempPath?: string // Ruta temporal del archivo
  tempUserId?: string // ID temporal del usuario
  comments?: string
}

// Actualizar la interfaz CartItemOptions para incluir paperWeight
export interface CartItemOptions {
  paperSize: string
  paperType: string
  paperWeight: string // Nuevo campo para el grosor del papel
  printType: string
  printForm: string
  orientation: string
  pagesPerSide: string
  finishing: string
  copies: number
}

// Define the structure of the cart context
interface CartContextProps {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (itemId: string) => number
  getTotalItems: () => number
  getTotalPrice: () => number
}

// Create the cart context
const CartContext = createContext<CartContextProps | undefined>(undefined)

// Create a custom hook to use the cart context
export const useCart = (): CartContextProps => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

// Create the cart provider
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart)
        console.log("=== CART LOADED FROM LOCALSTORAGE ===")
        console.log("Cart items:", parsedCart)
        parsedCart.forEach((item: CartItem, index: number) => {
          console.log(`Item ${index}:`, {
            name: item.fileName || item.name,
            fileUrl: item.fileUrl,
            hasFileUrl: !!item.fileUrl,
          })
        })
        setCart(parsedCart)
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      console.log("=== SAVING CART TO LOCALSTORAGE ===")
      console.log("Cart items:", cart)
      cart.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          name: item.fileName || item.name,
          fileUrl: item.fileUrl,
          hasFileUrl: !!item.fileUrl,
        })
      })
      localStorage.setItem("cart", JSON.stringify(cart))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }, [cart])

  // Function to add an item to the cart
  const addToCart = (item: CartItem) => {
    console.log("=== ADDING ITEM TO CART ===")
    console.log("Item to add:", {
      name: item.fileName || item.name,
      fileUrl: item.fileUrl,
      hasFileUrl: !!item.fileUrl,
    })

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.id === item.id && JSON.stringify(cartItem.options) === JSON.stringify(item.options),
      )

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id && JSON.stringify(cartItem.options) === JSON.stringify(item.options)
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem,
        )
      } else {
        return [...prevCart, item]
      }
    })
  }

  // Function to remove an item from the cart
  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  // Function to update the quantity of an item in the cart
  const updateQuantity = (itemId: string, quantity: number) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  // Function to clear the cart
  const clearCart = () => {
    console.log("=== CLEARING CART ===")
    setCart([])
  }

  // Function to get the quantity of an item in the cart
  const getItemQuantity = (itemId: string): number => {
    const item = cart.find((item) => item.id === itemId)
    return item ? item.quantity : 0
  }

  // Function to get the total number of items in the cart
  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Function to get the total price of items in the cart
  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Provide the cart context value
  const value: CartContextProps = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    getTotalItems,
    getTotalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
