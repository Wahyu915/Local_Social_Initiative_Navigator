import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";
import Section from "../components/Section";
import Card from "../components/Card";
import { fetchNGOs } from "../lib/api";

export default function Discover() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8); // start small, like 2 rows

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const rows = await fetchNGOs({ limit: 24 }); // lighter initial fetch
        if (!cancelled) setNgos(rows);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Navbar />
      <Section title="Discover NGOs" subtitle="Find organizations making a difference in Brunei.">
        {loading && <p>Loading NGOs…</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* top pill buttons */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button className="rounded-full px-4 py-1.5 text-sm bg-blue-900 text-white">
            Browse All
          </button>
          <button className="rounded-full px-4 py-1.5 text-sm border">
            Categories
          </button>
          <button className="rounded-full px-4 py-1.5 text-sm border">
            Map View
          </button>
        </div>

        {/* grid of NGOs */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ngos.slice(0, visibleCount).map((ngo) => (
            <Card
              key={ngo.id}
              title={ngo.name}
              category={ngo.city || "—"}
              link={`/ngo/${ngo.id}`}
            />
          ))}
        </div>

        {/* load more */}
        {ngos.length > visibleCount && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount((c) => c + 8)}
              className="rounded-full px-5 py-2 text-sm bg-yellow-500 hover:bg-yellow-400"
            >
              Load more
            </button>
          </div>
        )}
      </Section>
      <ChatBox />
      <Footer />
    </>
  );
}
