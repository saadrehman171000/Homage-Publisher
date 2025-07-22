"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/ui/product-card"

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([]) // For filter options only
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedSeries, setSelectedSeries] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 16
  })

  // Fetch all products for filter options (dropdown lists)
  useEffect(() => {
    async function fetchAllProducts() {
      try {
        const res = await fetch("/api/products?all=true")
        const data = await res.json()
        const normalized = data.map((p: any) => ({ ...p, image: p.imageUrl || p.image || "" }))
        setAllProducts(normalized)
      } catch (error) {
        setAllProducts([])
      }
    }
    fetchAllProducts()
  }, [])

  // Fetch filtered and paginated products from server
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        // Build query parameters for server-side filtering
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '16'
        })
        
        if (searchTerm.trim()) {
          params.append('search', searchTerm.trim())
        }
        
        if (selectedClass !== 'all') {
          params.append('category', selectedClass)
        }
        
        if (selectedSeries !== 'all') {
          params.append('series', selectedSeries)
        }
        
        if (sortBy) {
          params.append('sort', sortBy)
        }

        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()
        
        if (data.products) {
          const normalized = data.products.map((p: any) => ({ ...p, image: p.imageUrl || p.image || "" }))
          setProducts(normalized)
          setPagination(data.pagination)
        } else {
          // Fallback for old API response format
          const normalized = data.map((p: any) => ({ ...p, image: p.imageUrl || p.image || "" }))
          setProducts(normalized)
        }
      } catch (error) {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [currentPage, searchTerm, selectedClass, selectedSeries, sortBy])

  // Get unique classes and series for filter dropdowns
  const classes = ["all", ...Array.from(new Set(allProducts.map((p: any) => p.category)))]
  const series = ["all", ...Array.from(new Set(allProducts.map((p: any) => p.series)))]

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedClass, selectedSeries, sortBy])

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
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-gray-600">
            Showing {products.length} of {pagination.totalProducts} books
            {pagination.totalPages > 1 && (
              <span className="ml-2 text-sm">
                (Page {pagination.currentPage} of {pagination.totalPages})
              </span>
            )}
          </p>
          
          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.currentPage ? "default" : "outline"}
                      size="sm"
                      className={`w-8 h-8 p-0 ${
                        pageNum === pagination.currentPage 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : ''
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading books...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
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
                setSortBy("name")
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
