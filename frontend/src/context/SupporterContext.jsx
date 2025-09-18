import React, { createContext, useState, useContext } from "react";

const SupporterContext = createContext();

export function SupporterProvider({ children }) {
  /* ---------------- Profile ---------------- */
  const [profile, setProfile] = useState({
    name: "Alicia",
    email: "alicia@example.com",
    interests: ["Environment", "Health"],
  });

  /* ---------------- Registered Events ---------------- */
  const [myEvents, setMyEvents] = useState([
    {
      id: 1,
      title: "Beach Cleanup Drive",
      date: "2025-10-05",
      location: "Muara Beach",
      status: "Registered",
    },
  ]);

  /* ---------------- Donations ---------------- */
  const [donations, setDonations] = useState([
    {
      id: 1,
      campaign: "Fundraising Marathon",
      amount: 50,
      date: "2025-09-10",
    },
  ]);

  /* ---------------- Bookmarks ---------------- */
  const [bookmarks, setBookmarks] = useState([
    { id: 101, type: "NGO", name: "Green Brunei" },
  ]);

  /* ---------------- Notifications ---------------- */
  const [notifications, setNotifications] = useState([
    { id: 201, message: "Reminder: Beach Cleanup on Oct 5", read: false },
  ]);

  /* ---------------- Actions ---------------- */

  // Profile
  const updateProfile = (newProfile) => {
    setProfile({ ...profile, ...newProfile });
  };

  // Events
  const registerEvent = (event) => {
    if (!myEvents.some((e) => e.id === event.id)) {
      setMyEvents([...myEvents, { ...event, status: "Registered" }]);
    }
  };

  const cancelEvent = (eventId) => {
    setMyEvents(myEvents.filter((e) => e.id !== eventId));
  };

  // Donations
  const addDonation = (donation) => {
    setDonations([...donations, donation]);
  };

  // Bookmarks
  const addBookmark = (item) => {
    if (!bookmarks.some((b) => b.id === item.id && b.type === item.type)) {
      setBookmarks([...bookmarks, item]);
    }
  };

  const removeBookmark = (id) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  // Notifications
  const addNotification = (msg) => {
    setNotifications([
      ...notifications,
      { id: Date.now(), message: msg, read: false },
    ]);
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  return (
    <SupporterContext.Provider
      value={{
        profile,
        updateProfile,
        myEvents,
        registerEvent,
        cancelEvent,
        donations,
        addDonation,
        bookmarks,
        addBookmark,
        removeBookmark,
        notifications,
        addNotification,
        markAsRead,
      }}
    >
      {children}
    </SupporterContext.Provider>
  );
}

export function useSupporter() {
  return useContext(SupporterContext);
}
