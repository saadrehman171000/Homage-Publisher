"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Star, Check } from "lucide-react"
import type { Product } from "@/contexts/app-context"
import { useApp } from "@/contexts/app-context"

interface ProductCardProps {
  product: Product
  showNewBadge?: boolean
}

/**
 * Product Card Component
 * Features: Product image, title, price, rating, add to cart with professional UX
 */
export function ProductCard({ product, showNewBadge = false }: ProductCardProps) {
  const { state, dispatch } = useApp()
  const [addingToCart, setAddingToCart] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  
  const discountedPrice = product.discount ? product.price - (product.price * product.discount) / 100 : product.price

  // Check if item is already in cart
  const cartItem = state.cart.find(item => item.productId === product.id)
  const isInCart = !!cartItem

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent any parent link navigation
    e.stopPropagation() // Stop event bubbling
    
    if (addingToCart) return; // Prevent multiple rapid clicks
    
    setAddingToCart(true)
    
    const cartItemData = {
      id: `${product.id}-cart-item`,
      productId: product.id,
      title: product.title,
      price: discountedPrice,
      quantity: 1,
      image: product.imageData !== undefined && product.imageData !== null
        ? `/api/products/${product.id}/image`
        : product.imageUrl || product.image || "/placeholder.svg",
      discount: product.discount,
    };
    
    dispatch({
      type: "ADD_TO_CART",
      payload: cartItemData,
    });

    // Show success feedback
    setJustAdded(true)
    setTimeout(() => {
      setJustAdded(false)
      setAddingToCart(false)
    }, 1200) // Shorter duration for cards
  }

  return (
    <Card className="group relative overflow-hidden bg-white border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl">
      <CardContent className="p-0">
        {/* Only image is a link */}
        <Link href={`/product/${product.id}`}>
          <div className="relative overflow-hidden rounded-t-2xl">
            {/* Perfect square image container */}
            <div className="aspect-square w-full bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
              <Image
                src={
                  product.imageData !== undefined && product.imageData !== null
                    ? `/api/products/${product.id}/image`
                    : product.imageUrl || product.image || "/placeholder.svg"
                }
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

          {/* Product Details Section */}
          <div className="space-y-2">
            {product.subject && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Subject:</span>
                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {product.subject}
                </Badge>
              </div>
            )}
            
            {product.series && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Series:</span>
                <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                  {product.series}
                </Badge>
              </div>
            )}
            
            {product.type && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Type:</span>
                <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  {product.type}
                </Badge>
              </div>
            )}
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

          {/* Cart Status - Only show when not adding to cart and item exists in cart */}
          {isInCart && !addingToCart && !justAdded && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-700 text-sm font-medium">
                  In Cart ({cartItem.quantity})
                </span>
              </div>
            </div>
          )}

          {/* Success Message - Only show after adding is complete */}
          {justAdded && !addingToCart && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-700 text-sm font-medium">Added!</span>
              </div>
            </div>
          )}

          {/* Enhanced button - NOT inside any Link */}
          <Button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className={`w-full font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0 ${
              justAdded 
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
            } text-white ${addingToCart ? 'opacity-75' : ''}`}
          >
            {addingToCart ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : justAdded ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isInCart ? 'Add More' : 'Add to Cart'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
