"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApp } from "@/contexts/app-context"
import { Truck, Phone, Building, AlertCircle, MapPin } from "lucide-react"

// Pakistan cities and their districts
const CITIES_DATA = {
  "Karachi": {
    districts: ["Karachi Central", "Karachi East", "Karachi South", "Karachi West", "Korangi", "Malir"],
    shippingFee: 200
  },
  "Lahore": {
    districts: ["Lahore City", "Lahore Cantonment", "Model Town", "Gulberg", "DHA", "Johar Town"],
    shippingFee: 350
  },
  "Islamabad": {
    districts: ["Islamabad Capital Territory", "Blue Area", "F-6", "F-7", "F-8", "G-6", "G-7"],
    shippingFee: 350
  },
  "Rawalpindi": {
    districts: ["Rawalpindi City", "Rawalpindi Cantonment", "Satellite Town", "Commercial Market"],
    shippingFee: 350
  },
  "Faisalabad": {
    districts: ["Faisalabad City", "Lyallpur", "Samanabad", "Civil Lines"],
    shippingFee: 350
  },
  "Multan": {
    districts: ["Multan City", "Multan Cantonment", "Shah Rukn-e-Alam"],
    shippingFee: 350
  },
  "Peshawar": {
    districts: ["Peshawar City", "Peshawar Cantonment", "University Town"],
    shippingFee: 350
  },
  "Quetta": {
    districts: ["Quetta City", "Quetta Cantonment"],
    shippingFee: 350
  }
}

const MINIMUM_ORDER_AMOUNT = 2000

export default function CheckoutPage() {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    paymentMethod: "cod",
  })
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([])
  const [shippingFee, setShippingFee] = useState(0)

  // Redirect if cart is empty (but not if we're processing an order)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  
  useEffect(() => {
    if (state.cart.length === 0 && !isProcessingOrder) {
      router.push("/cart")
    }
  }, [state.cart.length, router, isProcessingOrder])

  // Update available districts when city changes
  useEffect(() => {
    if (formData.city && CITIES_DATA[formData.city as keyof typeof CITIES_DATA]) {
      const cityData = CITIES_DATA[formData.city as keyof typeof CITIES_DATA]
      setAvailableDistricts(cityData.districts)
      setShippingFee(cityData.shippingFee)
      // Reset district when city changes
      setFormData(prev => ({ ...prev, district: "" }))
    } else {
      setAvailableDistricts([])
      setShippingFee(0)
    }
  }, [formData.city])

  if (state.cart.length === 0) {
    return null
  }

  const subtotal = state.cart.reduce((total, item) => {
    const price = typeof item.discount === 'number'
      ? item.price - (item.price * item.discount) / 100
      : item.price;
    return total + price * item.quantity;
  }, 0)

  const total = subtotal + shippingFee
  const isMinimumOrderMet = subtotal >= MINIMUM_ORDER_AMOUNT

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCityChange = (value: string) => {
    setFormData({
      ...formData,
      city: value,
      district: "" // Reset district when city changes
    })
  }

  const handleDistrictChange = (value: string) => {
    setFormData({
      ...formData,
      district: value
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_CART_QUANTITY", payload: { productId, quantity } })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate minimum order amount
    if (!isMinimumOrderMet) {
      alert(`Minimum order amount is Rs. ${MINIMUM_ORDER_AMOUNT}. Please add more items to your cart.`)
      return
    }

    // Validate required fields
    if (!formData.city || !formData.district) {
      alert('Please select both city and district.')
      return
    }

    setIsProcessingOrder(true) // Prevent cart redirect during order processing

    // Prepare order data for backend
    const orderData = {
      items: state.cart.map((item) => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        discount: item.discount,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: subtotal,
      shippingFee: shippingFee,
      total: total,
      shippingName: formData.name,
      shippingEmail: formData.email,
      shippingPhone: formData.phone,
      shippingAddress: formData.address,
      shippingCity: formData.city,
      shippingDistrict: formData.district,
      shippingPostalCode: formData.postalCode,
      paymentMethod: formData.paymentMethod,
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      if (!res.ok) throw new Error('Order failed')
      const order = await res.json()
      
      // Clear cart and redirect to order confirmation
      dispatch({ type: 'CLEAR_CART' })
      router.push(`/order-confirmation/${order.id}`)
    } catch (err) {
      console.error('Order placement error:', err)
      setIsProcessingOrder(false) // Reset processing state on error
      alert('Failed to place order. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Minimum Order Warning */}
        {!isMinimumOrderMet && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">
                <strong>Minimum order amount is Rs. {MINIMUM_ORDER_AMOUNT}.</strong> 
                Current subtotal: Rs. {subtotal.toFixed(0)}. 
                Please add Rs. {(MINIMUM_ORDER_AMOUNT - subtotal).toFixed(0)} more to proceed.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      placeholder="03xx-xxxxxxx"
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  {/* City Selection */}
                  <div>
                    <Label>City *</Label>
                    <Select value={formData.city} onValueChange={handleCityChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(CITIES_DATA).map((city) => (
                          <SelectItem key={city} value={city}>
                            <div className="flex items-center justify-between w-full">
                              <span>{city}</span>
                              <span className="ml-2 text-sm text-gray-500">
                                Rs. {CITIES_DATA[city as keyof typeof CITIES_DATA].shippingFee} shipping
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* District Selection */}
                  {availableDistricts.length > 0 && (
                    <div>
                      <Label>District/Area *</Label>
                      <Select value={formData.district} onValueChange={handleDistrictChange} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your district/area" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDistricts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Address */}
                  <div>
                    <Label htmlFor="address">Complete Address *</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange}
                      placeholder="House/Flat number, Street name, Landmark"
                      required 
                    />
                  </div>
                </div>

                {/* Shipping Fee Display */}
                {shippingFee > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-blue-700">
                        Shipping to {formData.city}: <strong>Rs. {shippingFee}</strong>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>

                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center cursor-pointer">
                      <Truck className="w-5 h-5 mr-2 text-gray-600" />
                      Cash on Delivery (COD)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                    <RadioGroupItem value="easypaisa" id="easypaisa" disabled />
                    <Label htmlFor="easypaisa" className="flex items-center cursor-not-allowed">
                      <Phone className="w-5 h-5 mr-2 text-gray-400" />
                      Easypaisa (Coming Soon)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                    <RadioGroupItem value="jazzcash" id="jazzcash" disabled />
                    <Label htmlFor="jazzcash" className="flex items-center cursor-not-allowed">
                      <Phone className="w-5 h-5 mr-2 text-gray-400" />
                      JazzCash (Coming Soon)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                    <RadioGroupItem value="bank" id="bank" disabled />
                    <Label htmlFor="bank" className="flex items-center cursor-not-allowed">
                      <Building className="w-5 h-5 mr-2 text-gray-400" />
                      Bank Transfer (Coming Soon)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                type="submit" 
                className={`w-full ${isMinimumOrderMet && !isProcessingOrder ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`}
                size="lg"
                disabled={!isMinimumOrderMet || isProcessingOrder}
              >
                {isProcessingOrder ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Order...
                  </>
                ) : isMinimumOrderMet ? (
                  'Place Order'
                ) : (
                  `Add Rs. ${(MINIMUM_ORDER_AMOUNT - subtotal).toFixed(0)} More to Continue`
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {state.cart.map((item) => {
                const discountedPrice = typeof item.discount === 'number'
                  ? item.price - (item.price * item.discount) / 100
                  : item.price;
                return (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        >
                          -
                        </Button>
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</Button>
                      </div>
                    </div>
                    <p className="font-medium">Rs. {(discountedPrice * item.quantity).toFixed(0)}</p>
                  </div>
                )
              })}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">Rs. {subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shippingFee > 0 ? `Rs. ${shippingFee}` : 'Select city'}
                </span>
              </div>
              {!isMinimumOrderMet && (
                <div className="flex justify-between text-red-600">
                  <span>Minimum Order</span>
                  <span>Rs. {MINIMUM_ORDER_AMOUNT}</span>
                </div>
              )}
              <div className={`flex justify-between text-lg font-bold ${isMinimumOrderMet ? 'text-red-600' : 'text-gray-400'}`}>
                <span>Total</span>
                <span>Rs. {total.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
