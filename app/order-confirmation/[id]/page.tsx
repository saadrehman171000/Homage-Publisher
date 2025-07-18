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
          <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎉 Thank You for Your Order!</h1>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8">
            <p className="text-lg text-gray-800 mb-4 leading-relaxed">
              <strong>Your order has been successfully placed!</strong> We're excited to get your educational books to you.
            </p>
            
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center justify-center space-x-2">
                <span>📞</span>
                <p><strong>We will contact you soon</strong> on your provided number: <span className="font-semibold text-blue-600">{order.shippingPhone}</span></p>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <span>📧</span>
                <p><strong>Please keep checking your email</strong> at <span className="font-semibold text-blue-600">{order.shippingEmail}</span> for order updates</p>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <span>📦</span>
                <p>Your <strong>Order ID is #{order.id.slice(-6)}</strong> - save it for reference</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">📋 Order Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  📦 Order Details
                </h4>
                <div className="space-y-2">
                  <p className="text-sm"><span className="text-gray-500">Order ID:</span> <span className="font-medium">#{order.id.slice(-6)}</span></p>
                  <p className="text-sm"><span className="text-gray-500">Date:</span> <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                  <p className="text-sm"><span className="text-gray-500">Status:</span> <span className="font-medium text-blue-600">{order.status}</span></p>
                  <p className="text-sm"><span className="text-gray-500">Payment:</span> <span className="font-medium">{getPaymentMethodName(order.paymentMethod || 'cod')}</span></p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  🚚 Delivery Address
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{order.shippingName}</p>
                  <p className="text-gray-600">{order.shippingAddress}</p>
                  <p className="text-gray-600">{order.shippingCity}, {order.shippingPostalCode}</p>
                  <p className="text-blue-600 font-medium">{order.shippingPhone}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">💰 Total Amount</span>
                <span className="text-2xl font-bold text-red-600">Rs. {order.total.toFixed(0)}</span>
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

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800 font-medium">
              💡 <strong>Important:</strong> Our team will call you within 24 hours to confirm your order and delivery details.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href={`/my-orders`}>
                📋 View Order Details
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/shop">
                🛍️ Continue Shopping
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">
                📞 Contact Us
              </Link>
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Questions about your order? Contact us at <strong>+92-21-3277-8692</strong> or email <strong>contact@homagepublishers.com</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
