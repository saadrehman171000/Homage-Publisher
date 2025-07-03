"use client"

import { useParams } from "next/navigation"
import { ProductCard } from "@/components/ui/product-card"
import { useApp } from "@/contexts/app-context"

const classNames: { [key: string]: string } = {
  prep: "Prep",
  "class-1": "Class 1",
  "class-2": "Class 2",
  "class-3": "Class 3",
  "class-4": "Class 4",
  "class-5": "Class 5",
  "class-6": "Class 6",
  "class-7": "Class 7",
  "class-8": "Class 8",
}

export default function ClassPage() {
  const params = useParams()
  const { state } = useApp()
  const classSlug = params.class as string
  const className = classNames[classSlug]

  if (!className) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Class Not Found</h1>
          <p className="text-gray-600">The class you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Filter products by class
  const classProducts = state.products.filter((product) => product.class === className)

  // Group products by series
  const productsBySeries = classProducts.reduce(
    (acc, product) => {
      if (!acc[product.series]) {
        acc[product.series] = []
      }
      acc[product.series].push(product)
      return acc
    },
    {} as { [key: string]: typeof classProducts },
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{className} Books</h1>
          <p className="text-gray-600">
            Explore our comprehensive collection of educational materials for {className} students.
          </p>
        </div>

        {/* Series Sections */}
        {Object.keys(productsBySeries).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(productsBySeries).map(([series, products]) => (
              <div key={series}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{series}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No books available for {className} yet.</p>
            <p className="text-gray-400">Check back soon for new additions to our catalog.</p>
          </div>
        )}
      </div>
    </div>
  )
}
