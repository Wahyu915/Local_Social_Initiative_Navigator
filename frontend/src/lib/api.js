// src/lib/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

/* ---------- Health ---------- */
export async function fetchHealth() {
  const res = await fetch(`${API_URL}/api/healthz`);
  return res.json();
}

/* ---------- NGOs ---------- */
export async function fetchNGOs({ q = "", city, district, verified, limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (city) params.set("city", city);
  if (district) params.set("district", district);
  if (typeof verified !== "undefined") params.set("verified", String(verified));
  params.set("limit", String(limit));
  params.set("offset", String(offset));

  const res = await fetch(`${API_URL}/api/ngos?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch NGOs");
  const data = await res.json();
  return data.ngos || []; // server returns {ngos: [...]}
}

export async function fetchNGODetail(id) {
  const res = await fetch(`${API_URL}/api/ngos/${id}`);
  if (!res.ok) throw new Error("Failed to fetch NGO detail");
  return res.json();
}

export async function fetchNGOById(id) {
  const res = await fetch(`${API_URL}/api/ngos/${id}`);
  if (!res.ok) throw new Error("Failed to fetch NGO details");
  return res.json(); // { ngo: {...}, tags: [...] }
}

/* ---------- Normalizers ---------- */
function normalizeEvent(e) {
  // routes_upcoming_events -> { id, event_name, date, time, location, description, ngo_id, ngo_name }
  return {
    id: e.id,
    type: "event",
    title: e.event_name,
    date: e.date,
    time: e.time,
    location: e.location,
    description: e.description,
    details: e.description,
    ngo_id: e.ngo_id,
    ngo_name: e.ngo_name,
    image: null,
    isFull: false,
  };
}

function normalizeDonation(d) {
  // wishlist_items shape
  return {
    id: d.id,
    type: "donation",
    title: d.title,
    description: d.description,
    details: d.details || d.description,
    status: d.status,                 // 'open'|'reserved'|'fulfilled'|'cancelled'
    quantity: d.quantity,
    unit: d.unit,
    priority: d.priority,
    needed_by: d.needed_by,
    ngo_id: d.ngo_id,
    ngo_name: d.ngo_name,
    image: null,
  };
}

function normalizeVolunteer(v) {
  // opportunities shape
  const location = v.location || [v.city, v.district].filter(Boolean).join(", ");
  return {
    id: v.id,
    type: "volunteer",
    title: v.title,
    description: v.description,
    details: v.details || v.description,
    city: v.city,
    district: v.district,
    location,
    start_date: v.start_date,
    end_date: v.end_date,
    status: v.status, // 'open' | 'closed'
    ngo_id: v.ngo_id,
    ngo_name: v.ngo_name,
    image: null,
  };
}

/* ---------- Events (UpcomingEvent routes) ---------- */
export async function fetchEvents({ limit = 50, upcoming = true, ngo_id } = {}) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (upcoming) params.set("upcoming", "1");
  if (ngo_id) params.set("ngo_id", String(ngo_id));

  const res = await fetch(`${API_URL}/api/events?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch events");
  const data = await res.json();
  const items = Array.isArray(data) ? data : (data.items || []);
  return items.map(normalizeEvent);
}

export async function fetchEventsByNGO(ngoId, { limit = 50, upcoming = true } = {}) {
  return fetchEvents({ ngo_id: ngoId, limit, upcoming });
}

export async function createEvent(eventData) {
  const payload = {
    event_name: eventData.title,
    date: eventData.date,
    time: eventData.time,
    location: eventData.location,
    description: eventData.description,
    ngo_id: eventData.ngo_id || null,
    organizer: eventData.organizer || null,
  };
  const res = await fetch(`${API_URL}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create event");
  const saved = await res.json();
  return normalizeEvent(saved);
}

export async function updateEventApi(id, updates) {
  const payload = {};
  if (updates.title) payload.event_name = updates.title;
  if (updates.date) payload.date = updates.date;
  if (updates.time) payload.time = updates.time;
  if (updates.location) payload.location = updates.location;
  if (typeof updates.description !== "undefined") payload.description = updates.description;
  if (updates.ngo_id) payload.ngo_id = updates.ngo_id;
  if (updates.organizer) payload.organizer = updates.organizer;

  const res = await fetch(`${API_URL}/api/events/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update event");
  const updated = await res.json();
  return normalizeEvent(updated);
}

export async function deleteEventApi(id) {
  const res = await fetch(`${API_URL}/api/events/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to delete event");
  return { ok: true };
}

/* ---------- Donations (Wishlist) ---------- */
export async function fetchDonations({ status = "open", limit = 50, ngo_id } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  params.set("limit", String(limit));
  if (ngo_id) params.set("ngo_id", String(ngo_id));

  const res = await fetch(`${API_URL}/api/donations?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch donations");
  const data = await res.json();
  return (data.items || []).map(normalizeDonation);
}

export async function fetchDonationsByNGO(ngoId, { status = "open", limit = 50 } = {}) {
  return fetchDonations({ status, limit, ngo_id: ngoId });
}

export async function createDonation(d) {
  const payload = {
    title: d.title,
    ngo_id: d.ngo_id || null,
    description: d.description,
    quantity: d.quantity || 1,
    unit: d.unit || null,
    priority: d.priority || "normal",
    needed_by: d.needed_by || null,
    status: d.status || "open",
  };
  const res = await fetch(`${API_URL}/api/donations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create donation");
  const saved = await res.json();
  return normalizeDonation(saved);
}

export async function updateDonationApi(id, updates) {
  const res = await fetch(`${API_URL}/api/donations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update donation");
  const updated = await res.json();
  return normalizeDonation(updated);
}

export async function deleteDonationApi(id) {
  const res = await fetch(`${API_URL}/api/donations/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete donation");
  return { ok: true };
}

/* ---------- Volunteers (Opportunities) ---------- */
export async function fetchVolunteers({ active = true, limit = 50, ngo_id } = {}) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (active) params.set("active", "1");
  if (ngo_id) params.set("ngo_id", String(ngo_id));

  const res = await fetch(`${API_URL}/api/volunteers?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch volunteers");
  const data = await res.json();
  return (data.items || []).map(normalizeVolunteer);
}

export async function fetchVolunteersByNGO(ngoId, { active = true, limit = 50 } = {}) {
  return fetchVolunteers({ active, limit, ngo_id: ngoId });
}

export async function createVolunteer(v) {
  const payload = {
    title: v.title,
    ngo_id: v.ngo_id || null,
    description: v.description || null,
    commitment: v.commitment || null,
    city: v.city || null,
    district: v.district || null,
    start_date: v.start_date || null,
    end_date: v.end_date || null,
  };
  const res = await fetch(`${API_URL}/api/volunteers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create volunteer");
  const saved = await res.json();
  return normalizeVolunteer(saved);
}

export async function updateVolunteerApi(id, updates) {
  const res = await fetch(`${API_URL}/api/volunteers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update volunteer");
  const updated = await res.json();
  return normalizeVolunteer(updated);
}

export async function deleteVolunteerApi(id) {
  const res = await fetch(`${API_URL}/api/volunteers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete volunteer");
  return { ok: true };
}


