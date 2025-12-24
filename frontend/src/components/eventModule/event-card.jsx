"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Globe } from "lucide-react";

export function EventCard({ event, onViewDetails }) {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const attendeeCount = event.attendees?.length || 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {event.image_url && (
        <div className="h-48 bg-gray-200">
          <img
            src={event.image_url || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardContent className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={isUpcoming ? "default" : "secondary"}>
            {event.category}
          </Badge>
          {event.is_virtual && (
            <Badge variant="outline" className="text-xs">
              <Globe className="w-3 h-3 mr-1" />
              Virtual
            </Badge>
          )}
        </div>

        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {eventDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              at{" "}
              {eventDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">
              {event.is_virtual ? "Virtual Event" : event.location}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{attendeeCount} attending</span>
          </div>
        </div>

        {/* Organizer */}
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="w-6 h-6">
            <AvatarImage
              src={event.organizer?.avatar_url || "/placeholder.svg"}
            />
            <AvatarFallback className="text-xs">
              {event.organizer?.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600 truncate">
            {event.organizer?.full_name}
          </span>
        </div>

        <div className="flex gap-2 mt-auto pt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(event.id)}
          >
            View Details
          </Button>
          {isUpcoming && (
            <Button size="sm" className="flex-1">
              Join Event
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
