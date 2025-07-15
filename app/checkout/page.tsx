"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useApp } from "@/contexts/app-context"
import { Truck, Phone, Building } from "lucide-react"

export default function CheckoutPage() {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (state.cart.length === 0) {
      router.push("/cart")
    }
  }, [state.cart.length, router])

  if (state.cart.length === 0) {
    return null
  }

  const subtotal = state.cart.reduce((total, item) => {
    const price = typeof item.discount === 'number'
      ? item.price - (item.price * item.discount) / 100
      : item.price;
    return total + price * item.quantity;
  }, 0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_CART_QUANTITY", payload: { id: productId, quantity } })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
      total: subtotal,
      shippingName: formData.name,
      shippingEmail: formData.email,
      shippingPhone: formData.phone,
      shippingAddress: formData.address,
      shippingCity: formData.city,
      shippingPostalCode: formData.postalCode,
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      if (!res.ok) throw new Error('Order failed')
      const order = await res.json()
      dispatch({ type: 'CLEAR_CART' })
    router.push(`/order-confirmation/${order.id}`)
    } catch (err) {
      alert('Failed to place order. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

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
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} />
                  </div>
                </div>
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
                      Cash on Delivery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="easypaisa" id="easypaisa" />
                    <Label htmlFor="easypaisa" className="flex items-center cursor-pointer">
                      <Phone className="w-5 h-5 mr-2 text-gray-600" />
                      Easypaisa
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="jazzcash" id="jazzcash" />
                    <Label htmlFor="jazzcash" className="flex items-center cursor-pointer">
                      <Phone className="w-5 h-5 mr-2 text-gray-600" />
                      JazzCash
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex items-center cursor-pointer">
                      <Building className="w-5 h-5 mr-2 text-gray-600" />
                      Bank Transfer
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" size="lg">
                Place Order
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
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</Button>
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
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-red-600">Rs. {subtotal.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
