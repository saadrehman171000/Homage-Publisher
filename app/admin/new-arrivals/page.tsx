"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Package, Plus, Edit, Trash2, Eye, Star } from "lucide-react"
import Image from "next/image"

export default function AdminNewArrivalsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const res = await fetch("/api/products?all=true")
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

  const filteredProducts = products.filter((product: any) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      const response = await fetch(`/api/products/${productId}`, { method: "DELETE" })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to delete product")
      }
      setProducts(products.filter((p: any) => p.id !== productId))
    } catch (error) {
      alert(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Arrivals</h1>
        <Button asChild className="bg-red-600 hover:bg-red-700">
          <Link href="/admin/products/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search New Arrivals</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search new arrivals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product: any) => {
          const hasDiscount = product.discount && product.discount > 0
          const discountedPrice = hasDiscount
            ? Math.round(product.price * (1 - product.discount / 100))
            : product.price
          return (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <div className="aspect-[3/4] w-full bg-gray-50">
                    <Image
                      src={product.imageUrl || product.image || "/placeholder.svg"}
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
                    {hasDiscount && <Badge className="bg-red-500">{product.discount}% OFF</Badge>}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-red-600">Rs. {discountedPrice}</span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-500 line-through ml-2">Rs. {product.price}</span>
                    )}
                    {product.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                      </div>
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
          )
        })}
      </div>
      {filteredProducts.length === 0 && (
        <Card className="text-center py-12 mt-8">
          <CardContent>
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No new arrivals found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or add a new product.</p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/admin/products/add">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 