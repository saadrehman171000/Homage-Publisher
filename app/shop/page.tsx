"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/ui/product-card"
import { useApp } from "@/contexts/app-context"

export default function ShopPage() {
  const { state } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedSeries, setSelectedSeries] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  // Get unique classes and series for filters
  const classes = ["all", ...Array.from(new Set(state.products.map((p) => p.class)))]
  const series = ["all", ...Array.from(new Set(state.products.map((p) => p.series)))]

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = state.products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesClass = selectedClass === "all" || product.class === selectedClass
      const matchesSeries = selectedSeries === "all" || product.series === selectedSeries

      return matchesSearch && matchesClass && matchesSeries
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "class":
          return a.class.localeCompare(b.class)
        default:
          return 0
      }
    })

    return filtered
  }, [state.products, searchTerm, selectedClass, selectedSeries, sortBy])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Books</h1>
          <p className="text-gray-600">
            Discover our complete collection of educational materials for all grade levels.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Class Filter */}
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((className) => (
                  <SelectItem key={className} value={className}>
                    {className === "all" ? "All Classes" : className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Series Filter */}
            <Select value={selectedSeries} onValueChange={setSelectedSeries}>
              <SelectTrigger>
                <SelectValue placeholder="Select Series" />
              </SelectTrigger>
              <SelectContent>
                {series.map((seriesName) => (
                  <SelectItem key={seriesName} value={seriesName}>
                    {seriesName === "all" ? "All Series" : seriesName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="class">Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {state.products.length} books
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedClass("all")
                setSelectedSeries("all")
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
