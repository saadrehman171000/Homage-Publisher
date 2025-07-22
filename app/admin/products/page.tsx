"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Plus, Search, Edit, Trash2, Eye, Filter, Download, Upload, Star, AlertCircle } from "lucide-react"
import Image from "next/image"

export default function AdminProductsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [seriesFilter, setSeriesFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([]) // For stats and filters
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 16
  })

  // Fetch all products for stats and filters
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
        
        if (categoryFilter !== 'all') {
          params.append('category', categoryFilter)
        }
        
        if (seriesFilter !== 'all') {
          params.append('series', seriesFilter)
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
  }, [currentPage, searchTerm, categoryFilter, seriesFilter, sortBy])

  // Get unique categories and series for filter dropdowns
  const categories = ["all", ...Array.from(new Set(allProducts.map((p: any) => p.category)))]
  const series = ["all", ...Array.from(new Set(allProducts.map((p: any) => p.series)))]

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter, seriesFilter, sortBy])

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to delete product")
      }

      // Remove from local state
      setProducts(products.filter((p: any) => p.id !== productId))
      setAllProducts(allProducts.filter((p: any) => p.id !== productId))
      
      // Show success message
      alert("Product deleted successfully!")
    } catch (error) {
      console.error("Error deleting product:", error)
      alert(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600 mt-1">Manage your product catalog and inventory</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                <Link href="/admin/products/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900">{allProducts.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-3xl font-bold text-gray-900">{categories.length - 1}</p>
                </div>
                <Filter className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured Products</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {allProducts.filter((p: any) => p.isFeatured).length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={seriesFilter} onValueChange={setSeriesFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Series" />
                </SelectTrigger>
                <SelectContent>
                  {series.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "all" ? "All Series" : s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing {products.length} of {pagination.totalProducts} products
                {pagination.totalPages > 1 && (
                  <span className="ml-2">
                    (Page {pagination.currentPage} of {pagination.totalPages})
                  </span>
                )}
              </p>
              
              <div className="flex items-center space-x-2">
                                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("")
                      setCategoryFilter("all")
                      setSeriesFilter("all")
                      setSortBy("name")
                    }}
                  >
                    Clear Filters
                  </Button>
                
                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={!pagination.hasPrevPage}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(3, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage <= 2) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage >= pagination.totalPages - 1) {
                          pageNum = pagination.totalPages - 2 + i;
                        } else {
                          pageNum = pagination.currentPage - 1 + i;
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
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading products...</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <div className="aspect-[3/4] w-full bg-gray-50">
                    <Image
                        src={
                          product.imageData !== undefined && product.imageData !== null
                            ? `/api/products/${product.id}/image`
                            : product.imageUrl || product.image || "/placeholder.svg"
                        }
                      alt={product.title}
                      width={300}
                      height={400}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=400&width=300"
                      }}
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    {product.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                    {product.isNewArrival && <Badge className="bg-green-500">New</Badge>}
                    {product.discount && <Badge className="bg-red-500">{product.discount}% OFF</Badge>}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                        {/* Price/Discount logic fixed */}
                        {product.discount && product.discount > 0 ? (
                          <>
                            <span className="text-lg font-bold text-red-600">Rs. {Math.round(product.price * (1 - product.discount / 100))}</span>
                            <span className="text-sm text-gray-500 line-through ml-2">Rs. {product.price}</span>
                          </>
                        ) : (
                      <span className="text-lg font-bold text-red-600">Rs. {product.price}</span>
                      )}
                    </div>
                    {product.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Badge variant="outline" className="text-xs justify-center">
                      {product.category}
                    </Badge>
                    {product.subject && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 justify-center">
                        {product.subject}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 justify-center">
                      {product.series}
                    </Badge>
                    {product.type && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 justify-center">
                        {product.type}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or add a new product.</p>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/admin/products/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
