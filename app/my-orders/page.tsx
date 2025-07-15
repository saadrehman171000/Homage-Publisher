"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MyOrdersPage() {
  const [query, setQuery] = useState("")
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setOrders([])
    try {
      const isEmail = query.includes("@")
      const url = isEmail
        ? `/api/orders?email=${encodeURIComponent(query)}`
        : `/api/orders?phone=${encodeURIComponent(query)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error("No orders found.")
      const data = await res.json()
      if (!data.length) throw new Error("No orders found.")
      setOrders(data)
    } catch (err: any) {
      setError(err.message || "No orders found.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Find Your Orders</h1>
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <Input
            placeholder="Enter your email or phone number"
            value={query}
            onChange={e => setQuery(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        {orders.length > 0 && (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-semibold">Order #{order.id.slice(-6)}</div>
                    <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <Link href={`/order-confirmation/${order.id}`} className="text-red-600 underline font-medium">View Details</Link>
                </div>
                <div className="text-gray-700 text-sm mb-1">Status: <span className="font-medium">{order.status}</span></div>
                <div className="text-gray-700 text-sm">Total: <span className="font-medium">Rs. {order.total.toFixed(0)}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 