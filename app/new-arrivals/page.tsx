"use client"
import { ProductCard } from "@/components/ui/product-card"
import { useApp } from "@/contexts/app-context"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

/**
 * New Arrivals Page Component
 * Features: Display all new arrival products with filtering
 */
export default function NewArrivalsPage() {
  const { state } = useApp()

  const newArrivals = state.products.filter((product) => product.isNewArrival)

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
          <Badge className="mt-4 bg-green-600">{newArrivals.length} New Books Available</Badge>
        </div>

        {/* Products Grid */}
        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
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
