"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Minus, Plus, Check } from "lucide-react"
import { useApp } from "@/contexts/app-context"

export default function ProductDetailPage() {
  const params = useParams()
  const { state, dispatch } = useApp()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(() => state.products.find((p) => p.id === params.id))
  const [loading, setLoading] = useState(!product)
  const [addingToCart, setAddingToCart] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    if (!product) {
      setLoading(true)
      fetch(`/api/products/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct({ ...data, image: data.imageUrl || data.image || "" })
        })
        .catch(() => setProduct(undefined))
        .finally(() => setLoading(false))
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const discountedPrice = product.discount ? product.price - (product.price * product.discount) / 100 : product.price

  // Check if item is already in cart
  const cartItem = state.cart.find(item => item.productId === product.id)
  const isInCart = !!cartItem

  const handleAddToCart = async () => {
    if (addingToCart) return; // Prevent multiple rapid clicks
    
    setAddingToCart(true)
    
    const cartItem = {
      id: `${product.id}-cart-item`, // Use consistent ID format
      productId: product.id,
      title: product.title,
      price: discountedPrice,
      quantity,
      image:
        product.imageData !== undefined && product.imageData !== null
          ? `/api/products/${product.id}/image`
          : product.imageUrl || product.image || "/placeholder.svg",
      discount: product.discount,
    };
    
    console.log("Adding to cart:", cartItem);
    dispatch({
      type: "ADD_TO_CART",
      payload: cartItem,
    });

    // Show success feedback
    setJustAdded(true)
    setTimeout(() => {
      setJustAdded(false)
      setAddingToCart(false)
    }, 1500)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative">
              <div className="w-full overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center">
                <Image
                  src={
                    product.imageData !== undefined && product.imageData !== null
                      ? `/api/products/${product.id}/image`
                      : product.imageUrl || product.image || "/placeholder.svg"
                  }
                  alt={product.title}
                  width={600}
                  height={600}
                  className="max-w-full max-h-[600px] object-contain"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=600&width=600"
                  }}
                />
              </div>
              {product.discount && (
                <Badge className="absolute top-4 right-4 bg-red-600 text-lg px-3 py-1">{product.discount}% OFF</Badge>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <Badge variant="outline" className="text-sm">
                    {product.class}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {product.series}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {product.category}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-red-600">Rs. {discountedPrice.toFixed(0)}</span>
                  {product.discount && (
                    <span className="text-xl text-gray-500 line-through">Rs. {product.price.toFixed(0)}</span>
                  )}
                </div>
                {product.discount && (
                  <p className="text-green-600 font-medium">
                    You save Rs. {(product.price - discountedPrice).toFixed(0)}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Cart Status - Only show when not adding to cart */}
              {isInCart && !addingToCart && !justAdded && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-700 font-medium">
                      Already in cart ({cartItem.quantity} {cartItem.quantity === 1 ? 'item' : 'items'})
                    </span>
                  </div>
                </div>
              )}

              {/* Success Message - Only show after adding is complete */}
              {justAdded && !addingToCart && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-700 font-medium">
                      Added {quantity} {quantity === 1 ? 'item' : 'items'} to cart!
                    </span>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-medium px-4">{quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className={`w-full text-lg py-3 transition-all duration-200 ${
                      justAdded 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    } ${addingToCart ? 'opacity-75' : ''}`}
                    size="lg"
                  >
                    {addingToCart ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Adding to Cart...
                      </>
                    ) : justAdded ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        {isInCart ? 'Add More' : 'Add to Cart'} - Rs. {(discountedPrice * quantity).toFixed(0)}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Product Features */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    Curriculum-aligned content
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    High-quality printing and binding
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    Interactive exercises and activities
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    Expert-reviewed content
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
