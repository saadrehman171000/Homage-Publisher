"use client"

import React from "react"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useApp } from "@/contexts/app-context"
import { ArrowLeft, Save, Upload, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { use } from "react"

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showCustomSeries, setShowCustomSeries] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    image: "",
    category: "",
    series: "",
    customSeries: "",
    isNewArrival: false,
    isFeatured: false,
    rating: "",
    reviews: "",
  })

  const { id } = use(params)

  // Check if user is admin
  if (!state.user || !state.user.isAdmin) {
    router.push("/admin/login")
    return null
  }

  const categories = [
    "Pre-School",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
  ]
  const seriesOptions = [
    "English Series",
    "Math Series",
    "Science Series",
    "Urdu Series",
    "Social Studies Series",
    "Early Learning Series",
    "Other",
  ]

  // Load product data
  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${id}`)
        if (response.ok) {
          const product = await response.json()
          
          // Check if series is custom (not in predefined options)
          const isCustomSeries = !seriesOptions.includes(product.series)
          
          setFormData({
            title: product.title || "",
            description: product.description || "",
            price: product.price?.toString() || "",
            discount: product.discount?.toString() || "",
            image: product.imageUrl || product.image || "",
            category: product.category || "",
            series: isCustomSeries ? "Other" : product.series || "",
            customSeries: isCustomSeries ? product.series || "" : "",
            isNewArrival: product.isNewArrival || false,
            isFeatured: product.isFeatured || false,
            rating: product.rating?.toString() || "",
            reviews: product.reviews?.toString() || "",
          })
          
          setShowCustomSeries(isCustomSeries)
        } else {
          console.error("Failed to load product")
          router.push("/admin/products")
        }
      } catch (error) {
        console.error("Error loading product:", error)
        router.push("/admin/products")
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "series") {
      setShowCustomSeries(value === "Other")
      setFormData({
        ...formData,
        series: value,
        customSeries: value === "Other" ? formData.customSeries : "",
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate required fields
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.series) {
      alert("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Use custom series if "Other" is selected
    const finalSeries = formData.series === "Other" ? formData.customSeries : formData.series

    if (formData.series === "Other" && !formData.customSeries.trim()) {
      alert("Please enter a custom series name")
      setIsSubmitting(false)
      return
    }

    try {
      // Update product via API
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          discount: formData.discount ? Number.parseInt(formData.discount) : 0,
          image: formData.image || "/placeholder.svg?height=300&width=200",
          category: formData.category,
          series: finalSeries,
          isNewArrival: formData.isNewArrival,
          isFeatured: formData.isFeatured,
          rating: formData.rating ? Number.parseFloat(formData.rating) : undefined,
          reviews: formData.reviews ? Number.parseInt(formData.reviews) : 0,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to update product")
      }

      const updatedProduct = await response.json()
      dispatch({ type: "UPDATE_PRODUCT", payload: updatedProduct })

      alert("Product updated successfully!")
      router.push("/admin/products")
    } catch (error) {
      console.error("Error updating product:", error)
      alert(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button asChild variant="ghost" size="sm" className="mr-4">
                <Link href="/admin/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-600 mt-1">Update product information</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button form="product-form" type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Update Product"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter product title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="series">Series *</Label>
                  <Select value={formData.series} onValueChange={(value) => handleSelectChange("series", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select series" />
                    </SelectTrigger>
                    <SelectContent>
                      {seriesOptions.map((series) => (
                        <SelectItem key={series} value={series}>
                          {series}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {showCustomSeries && (
                    <div className="mt-3">
                      <Label htmlFor="customSeries">Custom Series Name *</Label>
                      <Input
                        id="customSeries"
                        name="customSeries"
                        value={formData.customSeries}
                        onChange={handleInputChange}
                        placeholder="Enter custom series name"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="price">Price (Rs.) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Image */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image (Title Page)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL for the title page"
                />
              </div>

              {formData.image && (
                <div className="mt-4">
                  <Label>Preview</Label>
                  <div className="mt-2 w-32 h-40 border rounded-lg overflow-hidden bg-gray-50">
                    <Image
                      src={formData.image || "/placeholder.svg"}
                      alt="Product preview"
                      width={128}
                      height={160}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=160&width=128"
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    value={formData.rating}
                    onChange={handleInputChange}
                    placeholder="4.5"
                    min="1"
                    max="5"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label htmlFor="reviews">Number of Reviews</Label>
                  <Input
                    id="reviews"
                    name="reviews"
                    type="number"
                    value={formData.reviews}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isNewArrival"
                    checked={formData.isNewArrival}
                    onCheckedChange={(checked) => handleCheckboxChange("isNewArrival", checked as boolean)}
                  />
                  <Label htmlFor="isNewArrival">Mark as New Arrival</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleCheckboxChange("isFeatured", checked as boolean)}
                  />
                  <Label htmlFor="isFeatured">Mark as Featured Product</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
} 