"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Truck, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

export default function OrderConfirmationPage() {
  const params = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true)
      const res = await fetch(`/api/orders`)
      const orders = await res.json()
      const found = orders.find((o: any) => o.id === params.id)
      setOrder(found || null)
      setLoading(false)
    }
    if (params.id) fetchOrder()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "cod":
        return "Cash on Delivery"
      case "easypaisa":
        return "Easypaisa"
      case "jazzcash":
        return "JazzCash"
      case "bank":
        return "Bank Transfer"
      default:
        return method
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>

          <p className="text-lg text-gray-600 mb-8">
            Thank you for your order. We've received your order and will process it shortly.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
                <p className="text-sm text-gray-600">Order ID: #{order.id}</p>
                <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Status: {order.status}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Shipping Info</h3>
                <p className="text-sm text-gray-600">{order.shippingName}</p>
                <p className="text-sm text-gray-600">{order.shippingEmail}</p>
                <p className="text-sm text-gray-600">{order.shippingPhone}</p>
                <p className="text-sm text-gray-600">{order.shippingAddress}, {order.shippingCity}, {order.shippingPostalCode}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Total</h3>
                <p className="text-lg font-bold text-red-600">Rs. {order.total.toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-900">Products</h3>
            <ul className="mb-2 pl-4 list-disc text-left">
              {order.items.map((item: any, idx: number) => (
                <li key={idx}>
                  {item.title} x {item.quantity} @ Rs. {item.price}
                  {item.discount ? (
                    <span className="ml-2 text-xs text-red-500">{item.discount}% OFF</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-900">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <Package className="h-8 w-8 text-red-600 mb-2" />
                <p className="font-medium">Order Processing</p>
                <p className="text-gray-600 text-center">We'll prepare your books for shipping</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <Truck className="h-8 w-8 text-red-600 mb-2" />
                <p className="font-medium">Shipping</p>
                <p className="text-gray-600 text-center">Your order will be dispatched</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-8 w-8 text-red-600 mb-2" />
                <p className="font-medium">Delivery</p>
                <p className="text-gray-600 text-center">Books delivered to your doorstep</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
