// src/pages/GetInvolved.jsx
import { useState } from "react";
import dayjs from "dayjs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";
import Slider from "react-slick";
import { useUpdates } from "../context/UpdatesContext";
import UpdateCard from "../components/UpdateCard";
import DonationDetailsModal from "../components/DonationDetailsModal";
import VolunteerDetailsModal from "../components/VolunteerDetailsModal";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PrevArrow = ({ onClick }) => (
  <button className="slick-arrow slick-prev" onClick={onClick} aria-label="Previous">
    <span>‹</span>
  </button>
);

const NextArrow = ({ onClick }) => (
  <button className="slick-arrow slick-next" onClick={onClick} aria-label="Next">
    <span>›</span>
  </button>
);

export default function GetInvolved() {
  const [activeTab, setActiveTab] = useState("events");

  // Modals
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const { events, donations, volunteers } = useUpdates(); // ✅ from UpdatesContext

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 450,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3200,
    cssEase: "ease-out",
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  /* ---------- Event Modal ---------- */
  const EventDetailsModal = ({ event, onClose }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [thankYou, setThankYou] = useState(null);
    if (!event) return null;

    const daysLeft = dayjs(event.date).diff(dayjs(), "day");
    const eventImage =
      event.image || `https://via.placeholder.com/640x400?text=${event.title?.replace(/\s+/g, "+")}`;

    const handleSubmit = (e) => {
      e.preventDefault();
      setThankYou({ name, event });
    };

    return (
      <div className="modal-overlay">
        <div className="modal">
          {!thankYou ? (
            <>
              <img src={eventImage} alt={event.title} className="modal-img" />
              <h2>{event.title}</h2>
              <p>
                <strong>Date:</strong> {dayjs(event.date).format("MMM D, YYYY")}{" "}
                {event.time && `• ${event.time}`}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>{daysLeft > 0 ? `${daysLeft} days left` : "Event ended"}</strong>
              </p>
              <p style={{ marginTop: "12px" }}>{event.description}</p>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className="btn" type="submit">
                  Confirm Registration
                </button>
              </form>
            </>
          ) : (
            <div className="thankyou">
              <h2>🎉 Thank You!</h2>
              <p>
                Dear <strong>{thankYou.name}</strong>, you’ve registered for{" "}
                <strong>{thankYou.event.title}</strong>.
              </p>
              <p>We’ll send event details to <strong>{email}</strong>.</p>
              <button className="btn" onClick={onClose}>
                Close
              </button>
            </div>
          )}
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <div className="getinvolved-hero">
        <div className="getinvolved-hero-overlay">
          <h1>Get Involved</h1>
          <p>Your support can make a difference.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "events" ? "tab active" : "tab"}
          onClick={() => setActiveTab("events")}
        >
          Upcoming Events
        </button>
        <button
          className={activeTab === "donate" ? "tab active" : "tab"}
          onClick={() => setActiveTab("donate")}
        >
          Donate
        </button>
        <button
          className={activeTab === "volunteer" ? "tab active" : "tab"}
          onClick={() => setActiveTab("volunteer")}
        >
          Volunteer
        </button>
      </div>

      {/* Content */}
      <section className="tab-content">
        {/* Events */}
        {activeTab === "events" && (
          <div className="events-carousel">
            {events.length === 0 ? (
              <p className="no-events">No upcoming events yet. Please check back soon!</p>
            ) : (
              <Slider {...sliderSettings}>
                {events.map((e) => (
                  <div key={`event-${e.id}`} onClick={() => setSelectedEvent(e)}>
                    <UpdateCard item={{ ...e, type: "event" }} />
                  </div>
                ))}
              </Slider>
            )}
          </div>
        )}

        {/* Donations */}
        {activeTab === "donate" && (
          <div className="donate-grid">
            {donations.length === 0 ? (
              <p>No donation campaigns yet.</p>
            ) : (
              donations.map((d) => (
                <div key={`donation-${d.id}`} onClick={() => setSelectedDonation(d)}>
                  <UpdateCard item={{ ...d, type: "donation" }} />
                </div>
              ))
            )}
          </div>
        )}

        {/* Volunteers */}
        {activeTab === "volunteer" && (
          <div className="donate-grid">
            {volunteers.length === 0 ? (
              <p>No volunteer opportunities yet.</p>
            ) : (
              volunteers.map((v) => (
                <div key={`volunteer-${v.id}`} onClick={() => setSelectedVolunteer(v)}>
                  <UpdateCard item={{ ...v, type: "volunteer" }} />
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* CTA Strip */}
      <section className="cta-strip">
        <h2>Together, we can create meaningful change.</h2>
      </section>

      {/* Modals */}
      {selectedEvent && (
        <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
      {selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
        />
      )}
      {selectedVolunteer && (
        <VolunteerDetailsModal
          volunteer={selectedVolunteer}
          onClose={() => setSelectedVolunteer(null)}
        />
      )}

      <Footer />
      <ChatBox />
    </div>
  );
}

