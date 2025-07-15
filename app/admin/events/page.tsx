"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Plus, Search, Edit, Trash2, Eye, Calendar, MapPin, Users, MoreHorizontal, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const predefinedCategories = ["Book Fair", "Workshop", "Launch", "Seminar", "Awards", "Summit"]
const statuses = ["upcoming", "ongoing", "completed", "cancelled"]

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    customCategory: "",
    featured: false,
    status: "upcoming",
  })

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      try {
        const params = []
        if (selectedStatus !== "all") params.push(`status=${selectedStatus}`)
        if (selectedCategory !== "all") params.push(`category=${encodeURIComponent(selectedCategory)}`)
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
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || event.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCreateEvent = async () => {
    setError("")
    setSubmitting(true)
    const finalCategory = formData.category === "Other" ? formData.customCategory : formData.category
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !finalCategory) {
      setError("Please fill all required fields.")
      setSubmitting(false)
      return
    }
    const payload: any = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      category: finalCategory,
      featured: formData.featured,
      status: formData.status,
      image: imagePreview || undefined,
    }
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const newEvent = await res.json()
        setEvents((prev) => [...prev, newEvent])
        toast({ title: "Event created!", description: `Event '${formData.title}' was created successfully.`, variant: "success" })
    setIsCreateDialogOpen(false)
    resetForm()
      } else {
        const err = await res.json()
        setError(err.error || "Failed to create event.")
        toast({ title: "Error", description: err.error || "Failed to create event.", variant: "destructive" })
      }
    } catch {
      setError("Failed to create event.")
      toast({ title: "Error", description: "Failed to create event.", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditEvent = (event: any) => {
    setEditingEvent(event)
    setImagePreview(event.image)
    const isPredefined = predefinedCategories.includes(event.category)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: isPredefined ? event.category : "Other",
      customCategory: isPredefined ? "" : event.category,
      featured: event.featured,
      status: event.status,
    })
    setIsCreateDialogOpen(true)
  }

  const handleUpdateEvent = async () => {
    setError("")
    if (!editingEvent) return
    const finalCategory = formData.category === "Other" ? formData.customCategory : formData.category
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !finalCategory) {
      setError("Please fill all required fields.")
      return
    }
    const payload: any = {
      id: editingEvent.id,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
            category: finalCategory,
      featured: formData.featured,
      status: formData.status,
      image: imagePreview || editingEvent.image,
          }
    try {
      const res = await fetch("/api/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const updatedEvent = await res.json()
        setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
    setIsCreateDialogOpen(false)
    setEditingEvent(null)
    resetForm()
      } else {
        const err = await res.json()
        setError(err.error || "Failed to update event.")
      }
    } catch {
      setError("Failed to update event.")
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const res = await fetch("/api/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId }),
      })
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== eventId))
        toast({ title: "Event deleted!", description: "The event was deleted successfully.", variant: "default" })
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed to delete event.", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete event.", variant: "destructive" })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "",
      customCategory: "",
      featured: false,
      status: "upcoming",
    })
    setImagePreview(null)
    setSelectedFile(null)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = () => {
    if (editingEvent) {
      handleUpdateEvent()
    } else {
      handleCreateEvent()
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600 mt-2">Manage your educational events and workshops</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
              <DialogDescription>
                {editingEvent ? "Update event details" : "Fill in the details to create a new event"}
              </DialogDescription>
            </DialogHeader>

            {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}

            <div className="grid gap-4 py-4">
              {/* Image Upload Section */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Event Image</Label>
                <div className="col-span-3 space-y-4">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {imagePreview && (
                    <div className="relative inline-block">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Event preview"
                        width={200}
                        height={120}
                        className="rounded-lg object-cover border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="col-span-3"
                  placeholder="Event title"
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Event description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., 09:00 AM - 06:00 PM"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="col-span-3"
                  placeholder="Event location"
                />
              </div>

              {/* Enhanced Category Selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <div className="col-span-3 space-y-2">
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value, customCategory: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other (Custom)</SelectItem>
                    </SelectContent>
                  </Select>

                  {formData.category === "Other" && (
                    <Input
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      placeholder="Enter custom category"
                      className="mt-2"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="featured" className="text-right">
                  Featured
                </Label>
                <div className="col-span-3">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                    Mark as featured event
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  setEditingEvent(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700" disabled={submitting}>
                {submitting ? <span className="loader mr-2"></span> : null}
                {editingEvent ? "Update Event" : "Create Event"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 rounded-2xl shadow-lg">
        <Card className="rounded-xl shadow-md border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Events</CardTitle>
            <Calendar className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900">{events.length}</div>
            <p className="text-xs text-gray-500 mt-1">All time events</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Upcoming Events</CardTitle>
            <Calendar className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-600">{events.filter((e) => e.status === "upcoming").length}</div>
            <p className="text-xs text-gray-500 mt-1">Events scheduled</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Featured Events</CardTitle>
            <Calendar className="h-5 w-5 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-red-600">{events.filter((e) => e.featured).length}</div>
            <p className="text-xs text-gray-500 mt-1">Highlighted events</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {predefinedCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Events ({filteredEvents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {event.title}
                          {event.featured && <Badge className="bg-red-100 text-red-800 text-xs">Featured</Badge>}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{new Date(event.date).toLocaleDateString()}</div>
                      <div className="text-gray-500">{event.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <a href={`/events/${event.id}`} target="_blank" rel="noopener noreferrer">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteEvent(event.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or create a new event</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
