// src/context/UpdatesContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import {
  fetchEvents,
  createEvent,
  updateEventApi,
  deleteEventApi,
  fetchDonations,
  createDonation,
  updateDonationApi,
  deleteDonationApi,
  fetchVolunteers,
  createVolunteer,
  updateVolunteerApi,
  deleteVolunteerApi,
} from "../lib/api";

/**
 * UpdatesContext
 * - Centralized provider for Events, Donations, Volunteers
 * - Syncs all three with backend API
 */

const UpdatesContext = createContext();

export function UpdatesProvider({ children }) {
  /* ---------- State ---------- */
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------- Load all on mount ---------- */
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);

      // ✅ Fetch from backend
      const [eventsData, donationsData, volunteersData] = await Promise.all([
        fetchEvents({ upcoming: true, limit: 50 }),
        fetchDonations(),
        fetchVolunteers(),
      ]);

      setEvents(eventsData || []);
      setDonations(donationsData || []);
      setVolunteers(volunteersData || []);
    } catch (err) {
      console.error("Failed to load updates:", err);
      setError("Could not load updates");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Normalize fallback for events ---------- */
  const normalizeEvent = (event) => ({
    ...event,
    id: event.id || Date.now(),
    title: event.title || event.event_name || "Untitled Event",
    description: event.description || "",
    image:
      event.image ||
      `https://via.placeholder.com/640x400?text=${encodeURIComponent(
        event.title || "Event"
      )}`,
  });

  /* ---------- Events ---------- */
  const addEvent = async (newEvent) => {
    try {
      const saved = await createEvent(newEvent);
      setEvents((prev) => [...prev, normalizeEvent(saved)]);
    } catch (err) {
      console.error("Add event failed:", err);
      alert("Failed to add event");
    }
  };

  const updateEvent = async (id, updatedEvent) => {
    try {
      const saved = await updateEventApi(id, updatedEvent);
      setEvents((prev) =>
        prev.map((ev) => (ev.id === id ? normalizeEvent(saved) : ev))
      );
    } catch (err) {
      console.error("Update event failed:", err);
      alert("Failed to update event");
    }
  };

  const deleteEvent = async (id) => {
    try {
      await deleteEventApi(id);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      console.error("Delete event failed:", err);
      alert("Failed to delete event");
    }
  };

  /* ---------- Donations ---------- */
  const addDonation = async (donation) => {
    try {
      const saved = await createDonation(donation);
      setDonations((prev) => [...prev, saved]);
    } catch (err) {
      console.error("Add donation failed:", err);
      alert("Failed to add donation");
    }
  };

  const updateDonation = async (id, updates) => {
    try {
      const saved = await updateDonationApi(id, updates);
      setDonations((prev) =>
        prev.map((d) => (d.id === id ? saved : d))
      );
    } catch (err) {
      console.error("Update donation failed:", err);
      alert("Failed to update donation");
    }
  };

  const deleteDonation = async (id) => {
    try {
      await deleteDonationApi(id);
      setDonations((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Delete donation failed:", err);
      alert("Failed to delete donation");
    }
  };

  /* ---------- Volunteers ---------- */
  const addVolunteer = async (vol) => {
    try {
      const saved = await createVolunteer(vol);
      setVolunteers((prev) => [...prev, saved]);
    } catch (err) {
      console.error("Add volunteer failed:", err);
      alert("Failed to add volunteer");
    }
  };

  const updateVolunteer = async (id, updates) => {
    try {
      const saved = await updateVolunteerApi(id, updates);
      setVolunteers((prev) =>
        prev.map((v) => (v.id === id ? saved : v))
      );
    } catch (err) {
      console.error("Update volunteer failed:", err);
      alert("Failed to update volunteer");
    }
  };

  const deleteVolunteer = async (id) => {
    try {
      await deleteVolunteerApi(id);
      setVolunteers((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error("Delete volunteer failed:", err);
      alert("Failed to delete volunteer");
    }
  };

  /* ---------- Context value ---------- */
  return (
    <UpdatesContext.Provider
      value={{
        events,
        donations,
        volunteers,
        loading,
        error,
        loadAll,
        addEvent,
        updateEvent,
        deleteEvent,
        addDonation,
        updateDonation,
        deleteDonation,
        addVolunteer,
        updateVolunteer,
        deleteVolunteer,
      }}
    >
      {children}
    </UpdatesContext.Provider>
  );
}

export function useUpdates() {
  return useContext(UpdatesContext);
}


