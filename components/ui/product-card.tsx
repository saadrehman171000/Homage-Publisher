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
    <Card className="group relative overflow-hidden bg-white border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl">
      <CardContent className="p-0">
        <Link href={`/product/${product.id}`}>
          <div className="relative overflow-hidden rounded-t-2xl">
            {/* Perfect square image container */}
            <div className="aspect-square w-full bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                priority={showNewBadge}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=400&width=400"
                }}
              />
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </div>

            {/* Enhanced badges with better positioning */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {product.discount && (
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg border-0 px-3 py-1 text-xs rounded-full">
                  {product.discount}% OFF
                </Badge>
              )}
            </div>

            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {showNewBadge && product.isNewArrival && (
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-lg border-0 px-3 py-1 text-xs rounded-full">
                  NEW
                </Badge>
              )}
            </div>
          </div>
        </Link>

        {/* Enhanced content section */}
        <div className="p-6 space-y-4">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-red-600 transition-colors duration-300 line-clamp-2 min-h-[3.5rem] leading-tight">
              {product.title}
            </h3>
          </Link>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">{product.description}</p>

          {/* Enhanced price and category section */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Rs. {discountedPrice.toFixed(0)}
              </span>
              {product.discount && (
                <span className="text-sm text-gray-500 line-through font-medium">Rs. {product.price.toFixed(0)}</span>
              )}
            </div>
            <Badge
              variant="outline"
              className="text-xs font-medium border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors px-3 py-1 rounded-full"
            >
              {product.category}
            </Badge>
          </div>

          {/* Enhanced rating section */}
          {product.rating && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 transition-colors ${
                        i < Math.floor(product.rating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">({product.reviews} reviews)</span>
              </div>
            </div>
          )}

          {/* Enhanced button */}
          <Button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
