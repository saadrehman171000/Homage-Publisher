"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/contexts/app-context"
import {
  Package,
  Plus,
  Users,
  ShoppingCart,
  TrendingUp,
  Eye,
  Edit,
  DollarSign,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Star,
  Search,
  Download,
  RefreshCw,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminDashboardPage() {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [orderFilter, setOrderFilter] = useState("all")
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  // Enhanced admin protection
  useEffect(() => {
    if (!state.user || !state.user.isAdmin) {
      router.push("/not-authorized")
    }
  }, [state.user, router])

  // Don't render anything until we verify admin status
  if (!state.user || !state.user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    async function fetchProducts() {
      setLoadingProducts(true)
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        setProducts([])
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    async function fetchOrders() {
      setLoadingOrders(true)
      try {
        const res = await fetch("/api/orders")
        const data = await res.json()
        setOrders(data)
      } catch (err) {
        setOrders([])
      } finally {
        setLoadingOrders(false)
      }
    }
    fetchOrders()
  }, [])



  // Calculate statistics
  const totalProducts = products.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const pendingOrders = orders.filter((order) => order.status === "placed").length
  const deliveredOrders = orders.filter((order) => order.status === "delivered").length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Recent orders with filtering
  const filteredOrders =
    orders.filter((order) => {
      const matchesSearch =
        (order.shippingName || "").toLowerCase().includes(searchTerm.toLowerCase()) || order.id.includes(searchTerm)
      const matchesFilter = orderFilter === "all" || order.status === orderFilter
      return matchesSearch && matchesFilter
    }) || []

  const recentOrders = filteredOrders.slice(0, 10)

  // Top selling products (use real data)
  const topProducts: any[] = products.slice(0, 5)

  const handleUpdateOrderStatus = (orderId: string, status: any) => {
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId, status } })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-blue-100 text-blue-800"
      case "packed":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "out-for-delivery":
        return "bg-orange-100 text-orange-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {state.user.name}! Here's what's happening today.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">Rs. {totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">From {totalOrders} orders</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
                  <p className="text-sm text-blue-600 mt-1">{pendingOrders} pending</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
                  <p className="text-sm text-gray-500 mt-1">Active products</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Package className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-3xl font-bold text-gray-900">Rs. {avgOrderValue.toFixed(0)}</p>
                  <p className="text-sm text-gray-500 mt-1">Per order average</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button asChild className="h-20 flex-col bg-red-600 hover:bg-red-700">
                  <Link href="/admin/products/add">
                    <Plus className="h-6 w-6 mb-2" />
                    Add Product
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/admin/products">
                    <Package className="h-6 w-6 mb-2" />
                    Manage Products
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/admin/orders">
                    <ShoppingCart className="h-6 w-6 mb-2" />
                    View Orders
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="font-semibold">{pendingOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Delivered</span>
                  </div>
                  <span className="font-semibold">{deliveredOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm">Processing</span>
                  </div>
                  <span className="font-semibold">{totalOrders - pendingOrders - deliveredOrders}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => {
                const hasDiscount = product.discount && product.discount > 0
                const discountedPrice = hasDiscount
                  ? Math.round(product.price * (1 - product.discount / 100))
                  : product.price
                return (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-red-600">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{product.title}</h4>
                      <p className="text-sm text-gray-500">
                        {product.category} • {product.series}
                      </p>
                        <div className="flex items-center gap-2 mt-1">
                          {hasDiscount && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              {product.discount}% OFF
                            </span>
                          )}
                          {product.rating ? (
                            <span className="ml-2 text-yellow-500 font-semibold flex items-center">
                              <Star className="h-4 w-4 mr-1" />
                              {product.rating.toFixed(1)}
                            </span>
                          ) : (
                            <span className="ml-2 text-xs text-gray-400">No rating</span>
                          )}
                          {product.reviews !== undefined && (
                            <span className="ml-2 text-xs text-gray-500">({product.reviews} reviews)</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600 text-lg">Rs. {discountedPrice}</p>
                      {hasDiscount && (
                        <p className="text-sm text-gray-400 line-through">Rs. {product.price}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
