"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Star } from "lucide-react"
import type { Product } from "@/contexts/app-context"
import { useApp } from "@/contexts/app-context"

interface ProductCardProps {
  product: Product
  showNewBadge?: boolean
}

/**
 * Product Card Component
 * Features: Product image, title, price, rating, add to cart
 */
export function ProductCard({ product, showNewBadge = false }: ProductCardProps) {
  const { dispatch } = useApp()

  const discountedPrice = product.discount ? product.price - (product.price * product.discount) / 100 : product.price

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product })
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
      <CardContent className="p-0">
        <Link href={`/product/${product.id}`}>
          <div className="relative overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              width={300}
              height={400}
              className="w-full h-64 object-contain bg-gray-50 rounded-t-lg transition-transform duration-300 hover:scale-105"
              priority={showNewBadge}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=400&width=300"
              }}
            />
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {product.discount && <Badge className="bg-red-600 text-white font-bold">{product.discount}% OFF</Badge>}
            </div>
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {showNewBadge && product.isNewArrival && <Badge className="bg-green-600 text-white font-bold">NEW</Badge>}
            </div>
          </div>
        </Link>

        <div className="p-4">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg mb-2 hover:text-red-600 transition-colors line-clamp-2 min-h-[3.5rem]">
              {product.title}
            </h3>
          </Link>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">{product.description}</p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-red-600">Rs. {discountedPrice.toFixed(0)}</span>
              {product.discount && (
                <span className="text-sm text-gray-500 line-through">Rs. {product.price.toFixed(0)}</span>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          </div>

          {product.rating && (
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">({product.reviews} reviews)</span>
            </div>
          )}

          <Button onClick={handleAddToCart} className="w-full bg-red-600 hover:bg-red-700 transition-colors">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
