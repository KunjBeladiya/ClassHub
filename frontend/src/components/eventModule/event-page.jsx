"use client";

import { useState, useEffect } from "react";
import { EventFilters } from "./event-filters";
import { EventCard } from "./event-card.jsx";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export function EventsPage({ searchParams, onNavigate }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn, role, loading: authLoading } = useAuth();

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/v1/event", {
        credentials: "include",
      });
      const data = await res.json();
      setEvents(data.events);
      setLoading(false);
    };
    loadEvents();
  }, [searchParams]);

  const handleFilterChange = (newParams) => {
    onNavigate("events", null, newParams);
  };

  console.log("isLoggedIn:", isLoggedIn);
  console.log("role:", role);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campus Events</h1>
          <p className="text-gray-600 mt-2">
            Discover and join exciting events happening on campus
          </p>
        </div>
        {!authLoading && isLoggedIn && role === "ADMIN" && (
          <Button
            onClick={() => onNavigate("create")}
            className="self-start sm:self-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>

      {/* Filters */}
      <EventFilters
        initialSearch={searchParams.search || ""}
        initialCategory={searchParams.category || ""}
        initialType={searchParams.type || ""}
        initialDate={searchParams.date || ""}
        onFilterChange={handleFilterChange}
      />

      {/* Events Grid */}
      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border p-6 animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {events.length} event{events.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onViewDetails={(id) => onNavigate("detail", id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or create a new event
            </p>
            <Button onClick={() => onNavigate("create")}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Event
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
