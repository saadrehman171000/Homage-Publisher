"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { useUser } from "@clerk/nextjs";

// Types
export interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  discount?: number
  image: string
  category: string
  subject?: string
  series: string
  type?: string
  isNewArrival?: boolean
  isFeatured?: boolean
  rating?: number
  reviews?: number
  imageData?: any // allow blob/buffer
  imageUrl?: string // allow backend endpoint or url
}

export interface CartItem {
  id: string
  productId: string
  title: string
  price: number
  quantity: number
  image: string
  discount?: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: string
  createdAt: string
  shippingDetails: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
}

export interface Announcement {
  id: string
  title: string
  description: string
  date: string
  isImportant?: boolean
}

export interface AppState {
  user: User | null
  products: Product[]
  cart: CartItem[]
  orders: Order[]
  announcements: Announcement[]
  termsAccepted?: boolean
}

type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "CLEAR_PRODUCTS" }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER_STATUS"; payload: { orderId: string; status: string } }
  | { type: "ADD_ANNOUNCEMENT"; payload: Announcement }
  | { type: "DELETE_ANNOUNCEMENT"; payload: string }
  | { type: "UPDATE_ANNOUNCEMENT"; payload: Announcement }
  | { type: "LOAD_STATE"; payload: Partial<AppState> }
  | { type: "SET_TERMS_ACCEPTED"; payload: boolean }

const initialState: AppState = {
  user: null,
  cart: [],
  orders: [],
  announcements: [
    {
      id: "1",
      title: "New Academic Year 2024-25 Books Available",
      description: "We're excited to announce that our complete collection of books for the new academic year is now available. Get your textbooks early and enjoy special discounts.",
      date: "2024-01-15",
      isImportant: true,
    },
    {
      id: "2",
      title: "Free Shipping on Orders Above Rs. 1000",
      description: "Enjoy free shipping on all orders above Rs. 1000. This offer is valid throughout Pakistan and applies to all educational materials.",
      date: "2024-01-10",
      isImportant: false,
    },
    {
      id: "3",
      title: "Teacher Resource Materials Now Available",
      description: "We've added a comprehensive collection of teacher resource materials including lesson plans, activity sheets, and assessment tools.",
      date: "2024-01-05",
      isImportant: false,
    },
  ],
  products: [],
}

const ADMIN_EMAILS = [
  "saadrehman1710000@gmail.com",
  // Add more admin emails here as needed
];

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload }

    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] }

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      }

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) => (p.id === action.payload.id ? action.payload : p)),
      }

    case "CLEAR_PRODUCTS":
      return { ...state, products: [] }

    case "ADD_TO_CART":
      console.log("Reducer ADD_TO_CART", action.payload, state.cart);
      const existingItem = state.cart.find((item) => item.productId === action.payload.productId)
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        }
      }
      return { ...state, cart: [...state.cart, action.payload] }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.productId !== action.payload),
      }

    case "UPDATE_CART_QUANTITY":
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.productId === action.payload.productId 
              ? { ...item, quantity: action.payload.quantity } 
              : item,
          )
          .filter((item) => item.quantity > 0), // Remove items with 0 quantity
      }

    case "CLEAR_CART":
      return { ...state, cart: [] }

    case "ADD_ORDER":
      return { ...state, orders: [...state.orders, action.payload] }

    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.orderId ? { ...order, status: action.payload.status } : order,
        ),
      }

    case "ADD_ANNOUNCEMENT":
      return { ...state, announcements: [...state.announcements, action.payload] }

    case "DELETE_ANNOUNCEMENT":
      return {
        ...state,
        announcements: state.announcements.filter((a) => a.id !== action.payload),
      }

    case "UPDATE_ANNOUNCEMENT":
      return {
        ...state,
        announcements: state.announcements.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a
        ),
      }

    case "LOAD_STATE":
      return { ...state, ...action.payload }

    case "SET_TERMS_ACCEPTED":
      return { ...state, termsAccepted: action.payload }

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
  const { user, isLoaded } = useUser();

  // Always fetch latest products from API on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const normalized = data.map((p: any) => ({ ...p, image: p.imageUrl || p.image || "" }));
        dispatch({ type: "CLEAR_PRODUCTS" });
        normalized.forEach((product: any) => {
          dispatch({ type: "ADD_PRODUCT", payload: product });
        });
      } catch (error) {
        // Optionally handle error
      }
    }
    fetchProducts();
  }, []);

  // Sync Clerk user with app context
  useEffect(() => {
    if (isLoaded && user) {
      dispatch({
        type: "SET_USER",
        payload: {
          id: user.id,
          name: user.fullName || user.username || user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          isAdmin: ADMIN_EMAILS.includes(user.primaryEmailAddress?.emailAddress || ""),
        },
      });
    } else if (isLoaded && !user) {
      dispatch({ type: "SET_USER", payload: null });
    }
  }, [user, isLoaded]);

  // Removed localStorage persistence: all business data is managed by the backend (NeonDB/Prisma).
  // Cart is managed in memory only. No localStorage is used for state persistence.

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
