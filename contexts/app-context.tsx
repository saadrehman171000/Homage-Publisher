"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

// Types
export interface Product {
  id: string
  title: string
  description: string
  price: number
  discount?: number
  image: string
  category: string
  series: string
  isNewArrival?: boolean
  isFeatured?: boolean
  rating?: number
  reviews?: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Announcement {
  id: string
  title: string
  description: string
  date: string
  isImportant?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  isAdmin?: boolean
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "placed" | "packed" | "shipped" | "out-for-delivery" | "delivered"
  shippingDetails: {
    name: string
    email: string
    phone: string
    address: string
  }
  paymentMethod: string
  createdAt: string
}

interface AppState {
  user: User | null
  cart: CartItem[]
  products: Product[]
  announcements: Announcement[]
  orders: Order[]
  termsAccepted: boolean
}

type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "ACCEPT_TERMS" }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "LOAD_STATE"; payload: Partial<AppState> }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "UPDATE_ORDER_STATUS"; payload: { orderId: string; status: Order["status"] } }

const initialState: AppState = {
  user: null,
  cart: [],
  products: [
    {
      id: "1",
      title: "English Grammar Mastery - Grade 2",
      description: "Comprehensive English grammar book with interactive exercises and examples for Grade 2 students.",
      price: 450,
      discount: 10,
      image: "/book2.png",
      category: "Grade 2",
      series: "English Series",
      isNewArrival: true,
      isFeatured: true,
      rating: 4.8,
      reviews: 124,
    },
    {
      id: "2",
      title: "Mathematics Fundamentals - Grade 2",
      description:
        "Complete mathematics textbook covering all essential topics for Grade 2 with colorful illustrations.",
      price: 380,
      image: "/book1.png",
      category: "Grade 2",
      series: "Math Series",
      isNewArrival: true,
      isFeatured: true,
      rating: 4.6,
      reviews: 89,
    },
    {
      id: "3",
      title: "Science Explorer - Grade 7",
      description: "Interactive science book with experiments and practical activities for Grade 7 students.",
      price: 520,
      discount: 15,
      image: "/book1.png",
      category: "Grade 7",
      series: "Science Series",
      isFeatured: true,
      rating: 4.9,
      reviews: 156,
    },
    {
      id: "4",
      title: "Urdu Literature - Grade 6",
      description: "Beautiful collection of Urdu literature and poetry for Grade 6 students with modern design.",
      price: 420,
      image: "/book3.png",
      category: "Grade 6",
      series: "Urdu Series",
      isNewArrival: true,
      rating: 4.7,
      reviews: 78,
    },
    {
      id: "5",
      title: "Social Studies - Grade 4",
      description: "Comprehensive social studies book covering history, geography, and civics for Grade 4.",
      price: 390,
      discount: 8,
      image: "/book4.png",
      category: "Grade 4",
      series: "Social Studies Series",
      isFeatured: true,
      rating: 4.5,
      reviews: 92,
    },
    {
      id: "6",
      title: "Pre-School Activity Book",
      description: "Fun and educational activity book for pre-school children with colorful illustrations.",
      price: 320,
      image: "/book4.png",
      category: "Pre-School",
      series: "Early Learning Series",
      isNewArrival: true,
      rating: 4.8,
      reviews: 203,
    },
    {
      id: "7",
      title: "Mathematics Advanced - Grade 2",
      description: "Advanced mathematics concepts for Grade 2 students with fun activities and exercises.",
      price: 350,
      discount: 5,
      image: "/book3.png",
      category: "Grade 2",
      series: "Math Series",
      isFeatured: true,
      rating: 4.7,
      reviews: 67,
    },
    {
      id: "8",
      title: "English Reading - Grade 1",
      description: "Beginner-friendly English reading book with phonics and vocabulary building exercises.",
      price: 280,
      image: "/book2.png",
      category: "Grade 1",
      series: "English Series",
      isNewArrival: true,
      rating: 4.9,
      reviews: 145,
    },
  ],
  announcements: [
    {
      id: "1",
      title: "New Academic Year 2024-25 Books Available",
      description:
        "All new curriculum-aligned books for the academic year 2024-25 are now available. Get your copies with early bird discounts of up to 15% off on bulk orders!",
      date: "2024-01-15",
      isImportant: true,
    },
    {
      id: "2",
      title: "Free Delivery on Orders Above Rs. 1000",
      description:
        "Enjoy free home delivery on all orders above Rs. 1000. Limited time offer valid till end of January. Shop now and save on delivery charges!",
      date: "2024-01-10",
    },
    {
      id: "3",
      title: "Winter Sale - Up to 25% Off",
      description:
        "Don't miss our winter sale! Get up to 25% discount on selected books. Perfect time to stock up for the new semester. Sale ends January 31st.",
      date: "2024-01-05",
    },
    {
      id: "4",
      title: "New Science Lab Manuals Released",
      description:
        "Comprehensive science lab manuals for Grades 6-8 are now available. Includes step-by-step experiments, safety guidelines, and practical activities.",
      date: "2023-12-28",
    },
  ],
  orders: [],
  termsAccepted: false,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload }

    case "ADD_TO_CART":
      const existingItem = state.cart.find((item) => item.product.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.product.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, { product: action.payload, quantity: 1 }],
      }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.product.id !== action.payload),
      }

    case "UPDATE_CART_QUANTITY":
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.product.id === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item,
          )
          .filter((item) => item.quantity > 0),
      }

    case "CLEAR_CART":
      return { ...state, cart: [] }

    case "ACCEPT_TERMS":
      return { ...state, termsAccepted: true }

    case "ADD_ORDER":
      return {
        ...state,
        orders: [...state.orders, action.payload],
      }

    case "LOAD_STATE":
      return { ...state, ...action.payload }

    case "ADD_PRODUCT":
      return {
        ...state,
        products: [...state.products, action.payload],
      }

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) => (product.id === action.payload.id ? action.payload : product)),
      }

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload),
      }

    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.orderId ? { ...order, status: action.payload.status } : order,
        ),
      }

    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("homage-publishers-state")
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        dispatch({ type: "LOAD_STATE", payload: parsedState })
      } catch (error) {
        console.error("Error loading saved state:", error)
      }
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "homage-publishers-state",
      JSON.stringify({
        user: state.user,
        cart: state.cart,
        termsAccepted: state.termsAccepted,
      }),
    )
  }, [state])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
