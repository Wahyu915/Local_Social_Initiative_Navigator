// src/lib/api.js
const API = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, ""); // '' in dev (use proxy)

function toUrl(path, params = {}) {
  // Build relative URL first, so Vite proxy works in dev.
  const u = new URL(path, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, v);
  });
  // If API is set (prod), swap origin with API base.
  return u.toString().replace(window.location.origin, API || "");
}

export async function fetchNGOs({ q = "", limit = 20, offset = 0 } = {}) {
  const res = await fetch(toUrl("/api/ngos", { q, limit, offset }));
  if (!res.ok) throw new Error(`NGO fetch failed: ${res.status}`);
  const data = await res.json();
  return data.ngos || [];
}

export async function getNGO(id) {
  const res = await fetch(toUrl(`/api/ngos/${id}`));
  if (!res.ok) throw new Error(`NGO ${id} not found`);
  return res.json(); // { ngo, tags }
}

export async function getWishlistByNGO(ngoId, { limit = 10, offset = 0 } = {}) {
  const res = await fetch(toUrl("/api/wishlist", { ngo_id: ngoId, limit, offset }));
  if (!res.ok) throw new Error(`Wishlist load failed: ${res.status}`);
  return res.json(); // { items, meta }
}
