"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Star, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link";
import { ProductCard } from "@/components/ui/product-card";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        const normalized = data.map((p: any) => ({ ...p, image: p.imageUrl || p.image || "" }))
        setProducts(normalized.filter((p: any) => p.isNewArrival))
      } catch (error) {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">New Arrivals</h1>
          <p className="text-xl text-gray-600">Discover our latest educational books and learning materials</p>
          <Badge className="mt-4 bg-green-600">{products.length} New Books Available</Badge>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading new arrivals...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} showNewBadge />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No new arrivals at the moment.</p>
            <p className="text-gray-400">Check back soon for new books!</p>
          </div>
        )}
      </div>
    </div>
  )
}
