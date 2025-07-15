"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useApp } from "@/contexts/app-context"
import type { CartItem } from "@/contexts/app-context"
import {
  Star,
  BookOpen,
  Award,
  ShoppingCart,
  ArrowRight,
  Bell,
  Mail,
  Sparkles,
  TrendingUp,
  Shield,
  Truck,
} from "lucide-react"
import { ProductCard } from "@/components/ui/product-card";

/**
 * Enhanced Homepage Component
 * Features: Beautiful animations, improved design, better UX
 */
export default function HomePage() {
  const { state, dispatch } = useApp()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [email, setEmail] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])

  // Get featured products and new arrivals
  const normalizedProducts = state.products.map((p) => ({
    ...p,
    image: (typeof (p as any).imageUrl === "string" && (p as any).imageUrl) || p.image || ""
  }))
  const recentAnnouncements = state.announcements.slice(0, 3)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        // Fetch featured products
        const featuredRes = await fetch("/api/products?limit=8")
        const featuredData = await featuredRes.json()
        setFeaturedProducts(featuredData.filter((p: any) => p.isFeatured))
        // Fetch new arrivals
        const newArrivalsRes = await fetch("/api/products?limit=8")
        const newArrivalsData = await newArrivalsRes.json()
        setNewArrivals(newArrivalsData.filter((p: any) => p.isNewArrival))
      } catch {
        setFeaturedProducts([])
        setNewArrivals([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % newArrivals.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + newArrivals.length) % newArrivals.length)
  }

  const handleAddToCart = (product: any) => {
    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      title: product.title,
      price: product.discount 
        ? product.price - (product.price * product.discount) / 100 
        : product.price,
      quantity: 1,
      image: product.image,
    }
    dispatch({ type: "ADD_TO_CART", payload: cartItem })
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thank you for subscribing to our newsletter!")
    setEmail("")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-yellow-300 opacity-20 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-5 rounded-full animate-ping"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium mb-6 animate-bounce">
                <Sparkles className="h-4 w-4 mr-2" />
                New Academic Year 2024-25
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                Quality Education
                <span className="block text-yellow-300 animate-pulse">Starts Here</span>
              </h1>

              <p className="text-xl lg:text-2xl mb-10 text-red-100 leading-relaxed">
                Discover our comprehensive collection of educational books designed to inspire and educate students from
                Pre-School to Grade 8. Excellence in education, delivered to your doorstep.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-red-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link href="/shop">
                    <BookOpen className="mr-3 h-6 w-6" />
                    Explore Books
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-red-600 bg-transparent font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <Link href="/new-arrivals">
                    View New Arrivals
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-red-200 text-sm">Books Published</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">100K+</div>
                  <div className="text-red-200 text-sm">Happy Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">20+</div>
                  <div className="text-red-200 text-sm">Years Experience</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/hero.png"
                  alt="Students learning with Homage Educational Publishers books"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Star className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Categories */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-4">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Categories
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Find Books by Grade</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover curriculum-aligned educational materials designed specifically for each grade level
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: "Pre-School", icon: "🎨", color: "from-pink-400 to-pink-600" },
              { name: "Grade 1-2", icon: "📚", color: "from-blue-400 to-blue-600" },
              { name: "Grade 3-4", icon: "🔬", color: "from-green-400 to-green-600" },
              { name: "Grade 5-6", icon: "🧮", color: "from-purple-400 to-purple-600" },
              { name: "Grade 7-8", icon: "🎓", color: "from-orange-400 to-orange-600" },
            ].map((category, index) => (
              <Link
                key={category.name}
                href={`/category/${category.name.toLowerCase().replace(" ", "-")}`}
                className="group"
              >
                <Card className="hover:shadow-2xl transition-all duration-500 group-hover:scale-105 border-0 overflow-hidden">
                  <CardContent className="p-8 text-center relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    ></div>
                    <div className="relative z-10">
                      <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">Educational Materials</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced New Arrivals */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                Fresh Content
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">New Arrivals</h2>
              <p className="text-xl text-gray-600">Latest additions to our educational collection</p>
            </div>
            <Button asChild variant="outline" size="lg" className="hidden md:flex bg-transparent">
              <Link href="/new-arrivals">
                View All
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Enhanced Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} showNewBadge />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Why Choose Homage?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the best educational experience for students and teachers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Quality Assured",
                description: "All books are curriculum-aligned and expert-reviewed",
                color: "text-blue-600",
                bgColor: "bg-blue-100",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description: "Free shipping on orders above Rs. 1000",
                color: "text-green-600",
                bgColor: "bg-green-100",
              },
              {
                icon: Award,
                title: "20+ Years Experience",
                description: "Trusted by educators across Pakistan",
                color: "text-purple-600",
                bgColor: "bg-purple-100",
              },
              {
                icon: TrendingUp,
                title: "Best Prices",
                description: "Competitive pricing with regular discounts",
                color: "text-orange-600",
                bgColor: "bg-orange-100",
              },
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-500 hover:scale-105 border-0">
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Announcements Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                <Bell className="h-4 w-4 mr-2" />
                Latest Updates
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Announcements</h2>
              <p className="text-xl text-gray-600">Stay updated with our latest news and offers</p>
            </div>
            <Button asChild variant="outline" size="lg" className="hidden md:flex bg-transparent">
              <Link href="/announcements">
                <Bell className="mr-2 h-5 w-5" />
                View All
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentAnnouncements.map((announcement, index) => (
              <Card
                key={announcement.id}
                className="group hover:shadow-xl transition-all duration-500 hover:scale-105 border-0"
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <Badge variant={announcement.isImportant ? "destructive" : "secondary"} className="font-bold">
                      {announcement.isImportant ? "Important" : "News"}
                    </Badge>
                    <span className="text-sm text-gray-500 font-medium">
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-4 group-hover:text-red-600 transition-colors duration-300">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 leading-relaxed">{announcement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-yellow-300 opacity-20 rounded-full animate-bounce"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white bg-opacity-20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8 animate-bounce">
            <Mail className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Stay Updated</h2>
          <p className="text-xl text-red-100 mb-10 leading-relaxed">
            Subscribe to our newsletter for the latest book releases, educational tips, and exclusive offers.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-14 text-lg rounded-full border-0 shadow-lg"
              />
              <Button
                type="submit"
                variant="secondary"
                className="bg-white text-red-600 hover:bg-gray-100 font-bold h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Subscribe
              </Button>
            </div>
          </form>

          <p className="text-sm text-red-200 mt-6">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>
    </div>
  )
}
