"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock, Users, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock events data - replace with actual data fetching
const events = [
  {
    id: 1,
    title: "Annual Book Fair 2024",
    description:
      "Join us for our biggest book fair of the year featuring thousands of educational books, interactive workshops, and special discounts for educators.",
    date: "2024-03-15",
    time: "09:00 AM - 06:00 PM",
    location: "Karachi Convention Center",
    image: "/placeholder.svg?height=300&width=400",
    category: "Book Fair",
    attendees: 500,
    status: "upcoming",
    featured: true,
  },
  {
    id: 2,
    title: "Educational Workshop: Modern Teaching Techniques",
    description:
      "Interactive learning techniques for teachers to enhance classroom engagement and student participation.",
    date: "2024-03-20",
    time: "02:00 PM - 05:00 PM",
    location: "Homage Publishers Office",
    image: "/placeholder.svg?height=300&width=400",
    category: "Workshop",
    attendees: 50,
    status: "upcoming",
    featured: false,
  },
  {
    id: 3,
    title: "New Curriculum Launch Event",
    description: "Introducing our latest educational materials designed for the updated curriculum standards.",
    date: "2024-03-25",
    time: "10:00 AM - 12:00 PM",
    location: "Online Event",
    image: "/placeholder.svg?height=300&width=400",
    category: "Launch",
    attendees: 200,
    status: "upcoming",
    featured: true,
  },
  {
    id: 4,
    title: "Teacher Training Seminar",
    description: "Professional development seminar for educators focusing on digital learning tools and methodologies.",
    date: "2024-02-28",
    time: "09:00 AM - 04:00 PM",
    location: "Lahore Education Center",
    image: "/placeholder.svg?height=300&width=400",
    category: "Seminar",
    attendees: 150,
    status: "completed",
    featured: false,
  },
  {
    id: 5,
    title: "Student Competition Awards",
    description:
      "Annual awards ceremony celebrating outstanding student achievements in various academic competitions.",
    date: "2024-02-15",
    time: "06:00 PM - 08:00 PM",
    location: "Grand Ballroom, Pearl Continental",
    image: "/placeholder.svg?height=300&width=400",
    category: "Awards",
    attendees: 300,
    status: "completed",
    featured: false,
  },
  {
    id: 6,
    title: "Digital Learning Summit",
    description: "Exploring the future of education through technology and digital learning platforms.",
    date: "2024-04-10",
    time: "09:00 AM - 05:00 PM",
    location: "Islamabad Convention Center",
    image: "/placeholder.svg?height=300&width=400",
    category: "Summit",
    attendees: 400,
    status: "upcoming",
    featured: true,
  },
]

const categories = ["All", "Book Fair", "Workshop", "Launch", "Seminar", "Awards", "Summit"]

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      try {
        const params = []
        if (selectedStatus !== "all") params.push(`status=${selectedStatus}`)
        if (selectedCategory !== "All") params.push(`category=${encodeURIComponent(selectedCategory)}`)
        const url = `/api/events${params.length ? "?" + params.join("&") : ""}`
        const res = await fetch(url)
        const data = await res.json()
        setEvents(data)
      } catch (e) {
        setEvents([])
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [selectedCategory, selectedStatus])

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const featuredEvents = events.filter((event) => event.featured && event.status === "upcoming")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="loader mb-4"></div>
          <div className="text-gray-500 text-lg">Loading events...</div>
        </div>
        <style jsx global>{`
          .loader { border: 4px solid #f3f3f3; border-top: 4px solid #e3342f; border-radius: 50%; width: 3em; height: 3em; animation: spin 1s linear infinite; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Educational Events</h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Discover workshops, seminars, book fairs, and educational gatherings that inspire learning and growth
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2 border-red-200"
                >
                  <div className="relative">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-red-600 text-white">Featured</Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={getStatusColor(event.status)}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                      <Badge variant="secondary">{event.category}</Badge>
                    </div>
                    <CardTitle className="text-xl hover:text-red-600 transition-colors">
                      <Link href={`/events/${event.id}`}>{event.title}</Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4 bg-red-600 hover:bg-red-700">
                      <Link href={`/events/${event.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* All Events */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">All Events ({filteredEvents.length})</h2>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    {event.featured && <Badge className="absolute top-4 left-4 bg-red-600 text-white">Featured</Badge>}
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={getStatusColor(event.status)}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                      <Badge variant="secondary">{event.category}</Badge>
                    </div>
                    <CardTitle className="text-xl hover:text-red-600 transition-colors">
                      <Link href={`/events/${event.id}`}>{event.title}</Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4 bg-red-600 hover:bg-red-700">
                      <Link href={`/events/${event.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
