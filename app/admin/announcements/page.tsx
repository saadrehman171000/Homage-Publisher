"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, AlertCircle, Pencil } from "lucide-react"
import { useUser } from "@clerk/nextjs"

export default function AdminAnnouncementsPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser();
  const [announcements, setAnnouncements] = useState([])
  const [form, setForm] = useState({
    title: "",
    description: "",
    isImportant: false,
  })
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is admin
  if (!isLoaded) return null;
  if (!user || !["saadrehman1710000@gmail.com"].includes(user.primaryEmailAddress?.emailAddress)) {
    router.push("/admin/login");
    return null;
  }

  useEffect(() => {
    async function fetchAnnouncements() {
      setLoading(true)
      const res = await fetch("/api/announcements")
      const data = await res.json()
      setAnnouncements(data)
      setLoading(false)
    }
    fetchAnnouncements()
  }, [])

  const refreshAnnouncements = async () => {
    const res = await fetch("/api/announcements")
    const data = await res.json()
    setAnnouncements(data)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, isImportant: e.target.checked })
  }

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.description) return
    await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        date: new Date().toISOString(),
        isImportant: form.isImportant,
      })
    })
    setForm({ title: "", description: "", isImportant: false })
    setIsAdding(false)
    refreshAnnouncements()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Delete this announcement?")) {
      await fetch("/api/announcements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      })
      refreshAnnouncements()
    }
  }

  const handleEdit = (a: any) => {
    setEditingId(a.id)
    setForm({ title: a.title, description: a.description, isImportant: !!a.isImportant })
    setIsAdding(false)
  }

  const handleUpdateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId || !form.title || !form.description) return
    await fetch("/api/announcements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        title: form.title,
        description: form.description,
        date: new Date().toISOString(),
        isImportant: form.isImportant,
      })
    })
    setEditingId(null)
    setForm({ title: "", description: "", isImportant: false })
    refreshAnnouncements()
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm({ title: "", description: "", isImportant: false })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
              <p className="text-gray-600 mt-1">Manage all site announcements</p>
            </div>
            <Button onClick={() => setIsAdding((v) => !v)} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              {isAdding ? "Cancel" : "Add Announcement"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdding && !editingId && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Announcement</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAnnouncement} className="space-y-4">
                <div>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    required
                  />
                </div>
                <div>
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isImportant"
                    checked={form.isImportant}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="isImportant" className="text-sm">Mark as Important</label>
                </div>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">Add Announcement</Button>
              </form>
            </CardContent>
          </Card>
        )}
        {editingId && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Edit Announcement</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateAnnouncement} className="space-y-4">
                <div>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    required
                  />
                </div>
                <div>
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isImportant"
                    checked={form.isImportant}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="isImportant" className="text-sm">Mark as Important</label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">Save Changes</Button>
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">Loading announcements...</p>
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No announcements found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {announcements.slice().reverse().map((a) => (
                  <div key={a.id} className="flex flex-col md:flex-row md:items-center justify-between bg-gray-100 rounded-lg p-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {a.isImportant && <Badge className="bg-red-600 text-white">Important</Badge>}
                        <span className="text-xs text-gray-500">{new Date(a.date).toLocaleDateString()}</span>
                      </div>
                      <div className="font-semibold text-lg text-gray-900">{a.title}</div>
                      <div className="text-gray-700 text-sm mt-1">{a.description}</div>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(a)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(a.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 