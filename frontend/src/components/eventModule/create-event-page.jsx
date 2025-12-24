"use client"

import { CreateEventForm } from "./create-event-form.jsx"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CreateEventPage({ onNavigate }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate("events")}
          className="mb-4 p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-gray-600 mt-2">Share your event with the campus community</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <CreateEventForm onNavigate={onNavigate} />
      </div>
    </div>
  )
}
