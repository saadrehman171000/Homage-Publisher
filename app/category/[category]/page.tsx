"use client"

import { useParams } from "next/navigation"
import { ProductCard } from "@/components/ui/product-card"
import { useApp } from "@/contexts/app-context"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const categoryNames: { [key: string]: string } = {
  "pre-school": "Pre-School",
  "grade-1": "Grade 1",
  "grade-2": "Grade 2",
  "grade-3": "Grade 3",
  "grade-4": "Grade 4",
  "grade-5": "Grade 5",
  "grade-6": "Grade 6",
  "grade-7": "Grade 7",
  "grade-8": "Grade 8",
  "grade-1-2": "Grade 1-2",
  "grade-3-4": "Grade 3-4",
  "grade-5-6": "Grade 5-6",
  "grade-7-8": "Grade 7-8",
}

/**
 * Category Page Component
 * Features: Display products by category with filtering and sorting
 */
export default function CategoryPage() {
  const params = useParams()
  const { state } = useApp()
  const [sortBy, setSortBy] = useState("name")

  const categorySlug = params.category as string
  const categoryName = categoryNames[categorySlug]

  if (!categoryName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
          <Button asChild>
            <a href="/shop">Browse All Books</a>
          </Button>
        </div>
      </div>
    )
  }

  // Filter products by category (handle both single grades and grade ranges)
  const categoryProducts = state.products.filter((product) => {
    if (categorySlug.includes("-")) {
      // Handle grade ranges like "grade-1-2"
      if (categorySlug === "grade-1-2") {
        return product.category === "Grade 1" || product.category === "Grade 2"
      } else if (categorySlug === "grade-3-4") {
        return product.category === "Grade 3" || product.category === "Grade 4"
      } else if (categorySlug === "grade-5-6") {
        return product.category === "Grade 5" || product.category === "Grade 6"
      } else if (categorySlug === "grade-7-8") {
        return product.category === "Grade 7" || product.category === "Grade 8"
      }
    }
    return product.category === categoryName
  })

  // Sort products
  categoryProducts.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.title.localeCompare(b.title)
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })

  // Group products by series
  const productsBySeries = categoryProducts.reduce(
    (acc, product) => {
      if (!acc[product.series]) {
        acc[product.series] = []
      }
      acc[product.series].push(product)
      return acc
    },
    {} as { [key: string]: typeof categoryProducts },
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4 mr-2" />
            Educational Materials
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{categoryName} Books</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive collection of educational materials designed specifically for {categoryName}{" "}
            students.
          </p>
          <Badge className="mt-4 bg-blue-600 text-lg px-4 py-2">{categoryProducts.length} Books Available</Badge>
        </div>

        {/* Filters and Sorting */}
        {categoryProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700 font-medium">
                  Showing {categoryProducts.length} books for {categoryName}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Products by Series */}
        {Object.keys(productsBySeries).length > 0 ? (
          <div className="space-y-16">
            {Object.entries(productsBySeries).map(([series, products]) => (
              <div key={series}>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{series}</h2>
                  <p className="text-gray-600">Discover books from our {series} collection</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No books available for {categoryName}</h3>
            <p className="text-gray-500 text-lg mb-8">Check back soon for new additions to our catalog.</p>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <a href="/shop">Browse All Books</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
