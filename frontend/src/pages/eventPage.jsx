"use client";

import { useState } from "react";
import { EventsPage } from "../components/eventModule/event-page.jsx";
import { CreateEventPage } from "../components/eventModule/create-event-page.jsx";
import { EventDetailPage } from "../components/eventModule/event-detail-page.jsx";
import { AppLayout } from "../components/AppLayout.jsx";

export function EventPage() {
  const [currentPage, setCurrentPage] = useState("events");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [searchParams, setSearchParams] = useState({});

  const navigate = (page, eventId = null, params = {}) => {
    setCurrentPage(page);
    setSelectedEventId(eventId);
    setSearchParams(params);
  };

  return (
  
      <div className="min-h-screen bg-gray-50">
        {currentPage === "events" && (
            <AppLayout>
                <EventsPage searchParams={searchParams} onNavigate={navigate} />
            </AppLayout>
        )}
        {currentPage === "create" && <CreateEventPage onNavigate={navigate} />}
        {currentPage === "detail" && selectedEventId && (
          <EventDetailPage eventId={selectedEventId} onNavigate={navigate} />
        )}
      </div>
  );
}
