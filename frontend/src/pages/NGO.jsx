import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Section from "../components/Section";
import { getNGO, getWishlistByNGO } from "../lib/api";

export default function NGO() {
  const { id } = useParams();
  const [ngo, setNgo] = useState(null);
  const [tags, setTags] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const d = await getNGO(id);
        if (cancel) return;
        setNgo(d.ngo);
        setTags(d.tags || []);
        const w = await getWishlistByNGO(id, { limit: 20 });
        if (cancel) return;
        setItems(w.items || []);
      } catch (e) {
        if (!cancel) setErr(e.message || "Failed to load NGO");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [id]);

  return (
    <>
      <Navbar />
      <Section title={ngo?.name || "NGO"} subtitle={ngo?.city ? `${ngo.city}${ngo?.district ? ", " + ngo.district : ""}` : ""}>
        {loading && <p>Loading…</p>}
        {err && <p className="text-red-500">{err}</p>}

        {ngo && (
          <div className="mx-auto max-w-5xl space-y-6">
            {/* summary */}
            {ngo.short_desc && <p className="text-gray-700">{ngo.short_desc}</p>}
            {ngo.full_desc && <p className="text-gray-700">{ngo.full_desc}</p>}

            {/* tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(t => (
                  <span key={t.key} className="px-2 py-1 text-xs rounded-full border">{t.name}</span>
                ))}
              </div>
            )}

            {/* Contact / website */}
            <div className="text-sm text-gray-600 space-y-1">
              {ngo.website && <div>Website: <a className="underline" href={ngo.website} target="_blank" rel="noreferrer">{ngo.website}</a></div>}
              {ngo.email && <div>Email: <a className="underline" href={`mailto:${ngo.email}`}>{ngo.email}</a></div>}
              {ngo.phone && <div>Phone: {ngo.phone}</div>}
            </div>

            {/* Wishlist */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-3">Wishlist</h3>
              {items.length === 0 ? (
                <p className="text-gray-600">No items yet.</p>
              ) : (
                <ul className="space-y-3">
                  {items.map(it => (
                    <li key={it.id} className="rounded-lg border p-4">
                      <div className="font-medium">{it.title}</div>
                      {it.description && <div className="text-sm text-gray-600 mt-1">{it.description}</div>}
                      <div className="text-xs text-gray-500 mt-2">
                        {it.quantity || 1} {it.unit || ""} · Priority: {it.priority} · Status: {it.status}
                      </div>
                      <Link
                        to={`/wishlist/${it.id}`}
                        className="inline-block mt-3 rounded-md bg-yellow-500 hover:bg-yellow-400 px-3 py-1 text-sm"
                      >
                        Offer to help
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Section>
      <Footer />
    </>
  );
}
