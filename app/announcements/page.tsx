"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useApp } from "@/contexts/app-context"
import { Bell, Calendar } from "lucide-react"

/**
 * Announcements Page Component
 * Features: List of all announcements with filtering and clean layout
 */
export default function AnnouncementsPage() {
  const { state } = useApp()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Bell className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Announcements</h1>
          <p className="text-xl text-gray-600">Stay informed with our latest news, updates, and special offers</p>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {state.announcements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant={announcement.isImportant ? "destructive" : "secondary"} className="text-sm">
                    {announcement.isImportant ? "Important Notice" : "General News"}
                  </Badge>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(announcement.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">{announcement.title}</h2>

                <p className="text-gray-600 leading-relaxed text-lg">{announcement.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {state.announcements.length === 0 && (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No announcements at the moment.</p>
            <p className="text-gray-400">Check back soon for updates!</p>
          </div>
        )}
      </div>
    </div>
  )
}
