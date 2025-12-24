"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Globe,
  ArrowLeft,
  Share2,
  Heart,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export function EventDetailPage({ eventId, onNavigate }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const { isLoggedIn, role, loading: authLoading } = useAuth();

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/v1/event/${eventId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setEvent(data.event);

      // 2. Load user's registered events to detect joined status
      const regRes = await fetch(
        `http://localhost:5000/api/v1/event/me/registered`,
        { credentials: "include" }
      );
      const regData = await regRes.json();

      const alreadyJoined = regData.events.some(
        (ev) => ev.event.id === eventId
      );
      setIsJoined(alreadyJoined);

      setLoading(false);
    };
    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Event Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The requested event could not be found.
          </p>
          <Button onClick={() => onNavigate("events")}>Back to Events</Button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const attendeeCount = event.attendees?.length || 0;
  const spotsLeft = event.max_attendees
    ? event.max_attendees - attendeeCount
    : null;

  const handleJoinEvent = async () => {
    if (!isJoined) {
      await fetch(`http://localhost:5000/api/v1/event/${event.id}/join`, {
        method: "POST",
        credentials: "include",
      });
      setIsJoined(true);
    } else {
      await fetch(`http://localhost:5000/api/v1/event/${event.id}/leave`, {
        method: "POST",
        credentials: "include",
      });
      setIsJoined(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    setIsDeleting(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/event/delete/${event.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Event deleted successfully!");
        onNavigate("events"); // navigate back to events list
      } else {
        alert(data.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Something went wrong while deleting the event");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => onNavigate("events")}
        className="mb-6 p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </Button>

      {/* Event Header */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {event.image_url && (
          <div className="h-64 bg-gray-200">
            <img
              src={event.image_url || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant={isUpcoming ? "default" : "secondary"}>
                  {event.category}
                </Badge>
                {event.is_virtual && (
                  <Badge variant="outline">
                    <Globe className="w-3 h-3 mr-1" />
                    Virtual
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <div className="font-medium">
                      {eventDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-sm">
                      {eventDate.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>
                    {event.is_virtual ? "Virtual Event" : event.location}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span>
                    {attendeeCount} attending
                    {spotsLeft !== null && (
                      <span className="text-sm ml-1">
                        ({spotsLeft} spots left)
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>
                    Created {new Date(event.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Organizer */}
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={event.organizer?.avatar_url || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {event.organizer?.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">
                    Organized by {event.organizer?.full_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {event.organizer?.university}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 lg:w-48">
              {isUpcoming ? (
                <Button
                  size="lg"
                  className="w-full"
                  variant={isJoined ? "outline" : "default"}
                  onClick={handleJoinEvent}
                >
                  {isJoined ? "Leave Event" : "Join Event"}
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="secondary"
                  disabled
                  className="w-full"
                >
                  Event Ended
                </Button>
              )}

              <div className="flex gap-2">
                {!authLoading && isLoggedIn && role === "ADMIN" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Description */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          About This Event
        </h2>
        <div className="prose max-w-none text-gray-700">
          {event.description.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Attendees */}
      {event.attendees && event.attendees.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Attendees ({attendeeCount})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isJoined && (
              <div className="flex items-center gap-3 bg-blue-50 p-2 rounded">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-blue-200">
                    You
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">You</p>
                  <p className="text-sm text-gray-600 truncate">had joined!</p>
                </div>
              </div>
            )}
            {event.attendees.slice(0, 5).map((attendee) => (
              <div key={attendee.user.id} className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={attendee.user.avatar_url || "/placeholder.svg"}
                  />
                  <AvatarFallback className="text-xs">
                    {attendee.user.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {attendee.user.full_name}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {attendee.user.major}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {attendeeCount > 5 && (
            <p className="text-sm text-gray-600 mt-4">
              And {attendeeCount - 5} more attendees...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
