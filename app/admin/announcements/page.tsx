"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp, Announcement } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, AlertCircle, Pencil } from "lucide-react"

export default function AdminAnnouncementsPage() {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const [form, setForm] = useState({
    title: "",
    description: "",
    isImportant: false,
  })
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Check if user is admin
  if (!state.user || !state.user.isAdmin) {
    router.push("/admin/login")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, isImportant: e.target.checked })
  }

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.description) return
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      date: new Date().toISOString(),
      isImportant: form.isImportant,
    }
    dispatch({ type: "ADD_ANNOUNCEMENT", payload: newAnnouncement })
    setForm({ title: "", description: "", isImportant: false })
    setIsAdding(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Delete this announcement?")) {
      dispatch({ type: "DELETE_ANNOUNCEMENT", payload: id })
    }
  }

  const handleEdit = (a: Announcement) => {
    setEditingId(a.id)
    setForm({ title: a.title, description: a.description, isImportant: !!a.isImportant })
    setIsAdding(false)
  }

  const handleUpdateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId || !form.title || !form.description) return
    const updated: Announcement = {
      id: editingId,
      title: form.title,
      description: form.description,
      date: new Date().toISOString(),
      isImportant: form.isImportant,
    }
    dispatch({ type: "UPDATE_ANNOUNCEMENT", payload: updated })
    setEditingId(null)
    setForm({ title: "", description: "", isImportant: false })
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
            {state.announcements.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No announcements found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {state.announcements.slice().reverse().map((a) => (
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