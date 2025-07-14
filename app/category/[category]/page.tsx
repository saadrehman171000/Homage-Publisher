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
  "pre-school": "Pre-School",
  "grade-1": "Grade 1",
  "grade-2": "Grade 2",
  "grade-3": "Grade 3",
  "grade-4": "Grade 4",
  "grade-5": "Grade 5",
  "grade-6": "Grade 6",
  "grade-7": "Grade 7",
  "grade-8": "Grade 8",
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

  const filteredProducts = products.filter((product: any) => product.category === categoryName)

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
