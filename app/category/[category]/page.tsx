"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Star } from "lucide-react"
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ui/product-card";

const categorySlugToName: Record<string, string> = {
  "beginner": "Beginner",
  "step-1": "Step-1",
  "step-2": "Step-2",
  "step-3": "Step-3",
  "class-1": "Class 1",
  "class-2": "Class 2",
  "class-3": "Class 3",
  "class-4": "Class 4",
  "class-5": "Class 5",
  "class-6": "Class 6",
  "class-7": "Class 7",
  "class-8": "Class 8",
  // Combined categories from homepage
  "beginner-step-3": "Beginner-Step 3",
  "class-1-class-2": "Class 1-Class 2",
  "class-3-class-4": "Class 3-Class 4",
  "class-5-class-6": "Class 5-Class 6",
  "class-7-class-8": "Class 7-Class 8",
  // Add more if needed
}

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = decodeURIComponent(params.category as string)
  const categoryName = categorySlugToName[categorySlug.toLowerCase()] || categorySlug
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        const normalized = data.map((p: any) => ({ ...p, image: p.imageUrl || p.image || "" }))
        setProducts(normalized)
      } catch (error) {
        setProducts([])
      } finally {
        setLoading(false)
    }
    }
    fetchProducts()
  }, [categoryName])

  // Handle combined categories
  const getCategoriesFromName = (categoryName: string): string[] => {
    if (categoryName === "Beginner-Step 3") {
      return ["Beginner", "Step-1", "Step-2", "Step-3"]
    } else if (categoryName === "Class 1-Class 2") {
      return ["Class 1", "Class 2"]
    } else if (categoryName === "Class 3-Class 4") {
      return ["Class 3", "Class 4"]
    } else if (categoryName === "Class 5-Class 6") {
      return ["Class 5", "Class 6"]
    } else if (categoryName === "Class 7-Class 8") {
      return ["Class 7", "Class 8"]
    } else {
      return [categoryName]
    }
  }

  const categoriesToMatch = getCategoriesFromName(categoryName)
  const filteredProducts = products.filter((product: any) => 
    categoriesToMatch.includes(product.category)
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{categoryName} Books</h1>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading books...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 col-span-full">No books found for this category.</div>
          ) : (
            filteredProducts.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
            ))
          )}
          </div>
        )}
    </div>
  )
}
