"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingBag, AlertCircle, Info } from "lucide-react"
import { useApp } from "@/contexts/app-context"

const MINIMUM_ORDER_AMOUNT = 1000

export default function CartPage() {
  const { state, dispatch } = useApp()

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_CART_QUANTITY", payload: { productId, quantity } })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId })
  }

  const subtotal = state.cart.reduce((total, item) => {
    const price = typeof item.discount === 'number'
      ? item.price - (item.price * item.discount) / 100
      : item.price;
    return total + price * item.quantity;
  }, 0);

  const isMinimumOrderMet = subtotal >= MINIMUM_ORDER_AMOUNT

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any books to your cart yet.</p>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {/* Minimum Order Warning */}
        {!isMinimumOrderMet && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium">
                  Minimum order amount is Rs. {MINIMUM_ORDER_AMOUNT}
                </p>
                <p className="text-red-600 text-sm">
                  Current total: Rs. {subtotal.toFixed(0)}. Add Rs. {(MINIMUM_ORDER_AMOUNT - subtotal).toFixed(0)} more to proceed to checkout.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-blue-700 font-medium">Shipping Information</p>
              <p className="text-blue-600 text-sm">
                • Karachi: Rs. 200 shipping fee • Other cities: Rs. 350 shipping fee • Free delivery on orders above Rs. 5000
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.cart.map((item) => {
              const discountedPrice = typeof item.discount === 'number'
                ? item.price - (item.price * item.discount) / 100
                : item.price

              return (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-4">
                    <div className="aspect-[3/4] w-20 overflow-hidden rounded-md bg-gray-50">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={80}
                        height={100}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=100&width=80"
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-red-600">Rs. {discountedPrice.toFixed(0)}</span>
                        {item.discount && (
                          <span className="text-sm text-gray-500 line-through">
                            Rs. {item.price.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-medium px-3">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        Rs. {(discountedPrice * item.quantity).toFixed(0)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.productId)}
                        className="text-red-600 hover:text-red-700 mt-2"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rs. {subtotal.toFixed(0)}</span>
                </div>
                
                {/* Minimum Order Check */}
                {!isMinimumOrderMet && (
                  <div className="flex justify-between text-red-600 text-sm">
                    <span>Minimum Order</span>
                    <span>Rs. {MINIMUM_ORDER_AMOUNT}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-sm">Rs. 200-350*</span>
                </div>
                
                <div className="text-xs text-gray-500 mt-1">
                  *Shipping fee depends on delivery location
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Subtotal</span>
                    <span className={`text-lg font-bold ${isMinimumOrderMet ? 'text-red-600' : 'text-gray-400'}`}>
                      Rs. {subtotal.toFixed(0)}
                    </span>
                  </div>
                  {!isMinimumOrderMet && (
                    <div className="text-sm text-red-600 mt-1">
                      Add Rs. {(MINIMUM_ORDER_AMOUNT - subtotal).toFixed(0)} more to checkout
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  asChild 
                  className={`w-full ${isMinimumOrderMet ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`} 
                  size="lg"
                  disabled={!isMinimumOrderMet}
                >
                  <Link href={isMinimumOrderMet ? "/checkout" : "#"}>
                    {isMinimumOrderMet ? 'Proceed to Checkout' : `Add Rs. ${(MINIMUM_ORDER_AMOUNT - subtotal).toFixed(0)} More`}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Delivery Information</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• Karachi: Rs. 200 shipping</div>
                  <div>• Other cities: Rs. 350 shipping</div>
                  <div>• Free delivery on orders above Rs. 5000</div>
                  <div>• Cash on Delivery available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
