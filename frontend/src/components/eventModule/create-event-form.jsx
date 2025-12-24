"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, MapPin, Users, Save, ImageIcon } from "lucide-react";
const API = import.meta.env.REACT_APP_API_URL;

export function CreateEventForm({ event = null, onNavigate }) {
  const isEditing = !!event;

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : "",
    location: event?.location || "",
    category: event?.category || "",
    is_virtual: event?.is_virtual || false,
    max_attendees: event?.max_attendees || "",
    image_url: event?.image_url || "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Workshop",
    "Seminar",
    "Competition",
    "Social",
    "Career",
    "Academic",
    "Sports",
    "Cultural",
    "Technology",
    "Bootcamp",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataObj = new FormData();

      formDataObj.append("title", formData.title);
      formDataObj.append("description", formData.description);
      formDataObj.append("date", formData.date);
      formDataObj.append("location", formData.location);
      formDataObj.append("category", formData.category);

      // Boolean needs string
      formDataObj.append("is_virtual", String(formData.is_virtual));

      if (formData.max_attendees) {
        formDataObj.append("max_attendees", formData.max_attendees);
      }

      if (selectedFile) {
        formDataObj.append("image", selectedFile);
      }

      const res = await fetch(`${API}/api/v1/event/create`, {
        method: "POST",
        credentials: "include",
        body: formDataObj,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Event creation failed:", text);
        throw new Error("Event creation failed");
      }

      const data = await res.json();
      if (data.success) onNavigate("events");
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Basic Information
        </h2>

        <div className="space-y-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter event title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe your event..."
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Event Image</Label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="image"
              type="file"
              onChange={handleFileChange}
              className="pl-10"
              accept="image/*"
            />
          </div>
        </div>
      </div>

      {/* Date and Time */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Date & Time</h2>

        <div className="space-y-2">
          <Label htmlFor="date">Date and Time *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="date"
              type="datetime-local"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Location</h2>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_virtual"
            checked={formData.is_virtual}
            onCheckedChange={(checked) =>
              handleInputChange("is_virtual", checked)
            }
          />
          <Label htmlFor="is_virtual">This is a virtual event</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">
            {formData.is_virtual ? "Meeting Link/Platform" : "Venue"} *
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder={
                formData.is_virtual
                  ? "Zoom link, Google Meet, etc."
                  : "Building name, room number, address"
              }
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>

      {/* Capacity */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Capacity</h2>

        <div className="space-y-2">
          <Label htmlFor="max_attendees">Maximum Attendees</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="max_attendees"
              type="number"
              value={formData.max_attendees}
              onChange={(e) =>
                handleInputChange("max_attendees", e.target.value)
              }
              placeholder="Leave empty for unlimited"
              min="1"
              className="pl-10"
            />
          </div>
          <p className="text-sm text-gray-600">
            Leave empty if there's no limit on attendees
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => onNavigate("events")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update Event"
            : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
