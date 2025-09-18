import { useState } from "react";
import dayjs from "dayjs"; // npm install dayjs
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Pictures
import beachCleanupImg from "../assets/Beach Cleanup.jpg";
import marathonImg from "../assets/Fundraising Marathon.jpg";
import foodDonationImg from "../assets/Food Donation.jpg";
import treePlantingImg from "../assets/Tree Planting.jpg";
import schoolSuppliesImg from "../assets/School Supplies.jpg";
import disasterReliefImg from "../assets/Disaster Relief.jpg";
import tutoringImg from "../assets/Tutoring.jpg";
import communityKitchenImg from "../assets/Community Kitchen.jpg";

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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  /* ---------------------- */
  /* Toggle flags           */
  /* ---------------------- */
  const donationsOpen = true;

  /* ---------------------- */
  /* Data                   */
  /* ---------------------- */
  const events = [
    { 
      title: "Beach Cleanup Drive", 
      date: "2025-10-05", 
      location: "Muara Beach", 
      image: beachCleanupImg, 
      isFull: false,
      details: "Join us for a community beach cleanup to keep Muara Beach beautiful. Gloves, bags, and refreshments provided."
    },
    { 
      title: "Fundraising Marathon", 
      date: "2025-10-20", 
      location: "Bandar Seri Begawan", 
      image: marathonImg, 
      isFull: true,
      details: "Support our NGOs through a city-wide marathon. All proceeds go to local charities."
    },
    { 
      title: "Food Donation Campaign", 
      date: "2025-11-02", 
      location: "Tutong", 
      image: foodDonationImg, 
      isFull: false,
      details: "Help us collect and distribute food packages to underprivileged families in Tutong."
    },
    { 
      title: "Tree Planting Project", 
      date: "2025-11-15", 
      location: "Temburong", 
      image: treePlantingImg, 
      isFull: false,
      details: "Be part of our reforestation project in Temburong. Let's plant 1,000 trees together."
    },
  ];

  const donations = [
    {
      title: "School Supplies Fund",
      status: "open",
      image: schoolSuppliesImg,
      details: "Help us provide essential school supplies to children in need across Brunei."
    },
    {
      title: "Disaster Relief Aid",
      status: "closed",
      image: disasterReliefImg,
      details: "Support families affected by recent floods. This campaign is currently closed."
    }
  ];

  const volunteers = [
    {
      title: "Tutoring Program",
      status: "open",
      image: tutoringImg,
      details: "Help students improve in Math and Science by becoming a volunteer tutor."
    },
    {
      title: "Community Kitchen",
      status: "closed",
      image: communityKitchenImg,
      details: "Assist in preparing and serving meals for underprivileged families."
    }
  ];

  /* ---------------------- */
  /* Slider Settings        */
  /* ---------------------- */
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

 /* ---------------------- */
/* Event Modal (with Thank You) */
/* ---------------------- */
const EventDetailsModal = ({ event, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [thankYou, setThankYou] = useState(null);

  if (!event) return null;

  const daysLeft = dayjs(event.date).diff(dayjs(), "day");

  const handleSubmit = (e) => {
    e.preventDefault();
    setThankYou({ name, event });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {!thankYou ? (
          <>
            <img src={event.image} alt={event.title} className="modal-img" />
            <h2>{event.title}</h2>
            <p><strong>Date:</strong> {dayjs(event.date).format("MMM D, YYYY")}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>{daysLeft > 0 ? `${daysLeft} days left` : "Event ended"}</strong></p>
            <p style={{ marginTop: "12px" }}>{event.details}</p>

            {event.isFull ? (
              <button className="btn disabled" disabled>Registration Closed</button>
            ) : (
              <>
                <div style={{ margin: "24px 0" }}>
                  <hr className="modal-divider" />
                  <h3 className="modal-subtitle">Sign Up to Participate</h3>
                </div>
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
                  <button className="btn" type="submit">Confirm Registration</button>
                </form>
              </>
            )}
          </>
        ) : (
          /* Thank You Screen */
          <div className="thankyou">
            <h2>🎉 Thank You!</h2>
            <p>
              Dear <strong>{thankYou.name}</strong>, you’ve successfully registered for{" "}
              <strong>{thankYou.event.title}</strong>.
            </p>
            <p>We’ll send event details to <strong>{email}</strong>.</p>
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        )}
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

/* ---------------------- */
/* Donation Modal (with Thank You) */
/* ---------------------- */
const DonationDetailsModal = ({ donation, onClose }) => {
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [thankYou, setThankYou] = useState(null);

  if (!donation) return null;

  const quickAmounts = [10, 25, 50, 100];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = amount === "custom" ? customAmount : amount;
    setThankYou({ name, finalAmount, paymentMethod });
  };

  return (
    <div className="modal-overlay">
      <div className="modal donation-modal">
        {/* If donation is closed */}
        {donation.status === "closed" ? (
          <>
            <img src={donation.image} alt={donation.title} className="modal-img" />
            <h2>{donation.title}</h2>
            <p>{donation.details}</p>
            <p><em>Not accepting contributions at the moment.</em></p>
            <button className="modal-close" onClick={onClose}>×</button>
          </>
        ) : (
          <>
            {!thankYou ? (
              <>
                <img src={donation.image} alt={donation.title} className="modal-img" />
                <h2>{donation.title}</h2>
                <p>{donation.details}</p>

                <form onSubmit={handleSubmit}>
                  {/* Quick Amount Cards */}
                  <div className="donation-amounts">
                    {quickAmounts.map((val) => (
                      <button
                        type="button"
                        key={val}
                        className={`amount-card ${amount == val ? "selected" : ""}`}
                        onClick={() => setAmount(val)}
                      >
                        ${val}
                      </button>
                    ))}
                    <button
                      type="button"
                      className={`amount-card ${amount === "custom" ? "selected" : ""}`}
                      onClick={() => setAmount("custom")}
                    >
                      Other
                    </button>
                  </div>

                  {/* Custom amount field */}
                  {amount === "custom" && (
                    <input
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      required
                    />
                  )}

                  {/* Donor Info */}
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email (for receipt)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  {/* Payment Methods */}
                  <div className="payment-methods">
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        value="Credit Card"
                        checked={paymentMethod === "Credit Card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                      />
                      💳 Credit Card
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        value="PayPal"
                        checked={paymentMethod === "PayPal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      🅿️ PayPal
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        value="Bank Transfer"
                        checked={paymentMethod === "Bank Transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      🏦 Bank Transfer
                    </label>
                  </div>

                  <button className="btn" type="submit">Contribute</button>
                </form>

                <p className="donation-note">
                  🔒 All donations are securely processed. 100% of proceeds go directly to NGOs.
                </p>
              </>
            ) : (
              /* Thank You Screen */
              <div className="thankyou">
                <h2>🎉 Thank You!</h2>
                <p>
                  Dear <strong>{thankYou.name}</strong>, your generous donation of{" "}
                  <strong>${thankYou.finalAmount}</strong> via{" "}
                  <strong>{thankYou.paymentMethod}</strong> has been received.
                </p>
                <p>We’ll email your receipt to <strong>{email}</strong>.</p>
                <button className="btn" onClick={onClose}>Close</button>
              </div>
            )}
            <button className="modal-close" onClick={onClose}>×</button>
          </>
        )}
      </div>
    </div>
  );
};

  /* ---------------------- */
/* Volunteer Modal (Improved with Thank You) */
/* ---------------------- */
const VolunteerDetailsModal = ({ volunteer, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [thankYou, setThankYou] = useState(null);

  if (!volunteer) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setThankYou({ name, volunteer });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {!thankYou ? (
          <>
            <img src={volunteer.image} alt={volunteer.title} className="modal-img" />
            <h2>{volunteer.title}</h2>
            <p>{volunteer.details}</p>

            {volunteer.status === "closed" ? (
              <p><em>This volunteer opportunity is currently not accepting sign-ups. Please check back later.</em></p>
            ) : (
              <>
                <div style={{ margin: "20px 0" }}>
                  <hr className="modal-divider" />
                  <h3 className="modal-subtitle">Sign Up to Volunteer</h3>
                </div>
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
                  <input 
                    type="tel" 
                    placeholder="Your Phone (optional)" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                  <textarea
                    placeholder="Your Skills / Interests (optional)"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    rows="3"
                  />
                  <label className="consent">
                    <input type="checkbox" required /> I agree to be contacted by the NGO
                  </label>
                  <button className="btn" type="submit">Confirm Sign Up</button>
                </form>
              </>
            )}
          </>
        ) : (
          /* Thank You Screen */
          <div className="thankyou">
            <h2>🎉 Thank You!</h2>
            <p>
              Dear <strong>{thankYou.name}</strong>, you’ve signed up for{" "}
              <strong>{thankYou.volunteer.title}</strong>.
            </p>
            <p>The NGO will contact you shortly at <strong>{email}</strong>{phone && ` or ${phone}`}</p>
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        )}
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};


  /* ---------------------- */
  /* Return JSX             */
  /* ---------------------- */
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
        <button className={activeTab === "events" ? "tab active" : "tab"} onClick={() => setActiveTab("events")}>Upcoming Events</button>
        <button className={activeTab === "donate" ? "tab active" : "tab"} onClick={() => setActiveTab("donate")}>Donate</button>
        <button className={activeTab === "volunteer" ? "tab active" : "tab"} onClick={() => setActiveTab("volunteer")}>Volunteer</button>
      </div>

      {/* Content */}
      <section className="tab-content">
        {/* Events */}
        {activeTab === "events" && (
          <div className="events-carousel">
            <Slider {...sliderSettings}>
              {events.map((e, idx) => {
                const daysLeft = dayjs(e.date).diff(dayjs(), "day");
                return (
                  <div key={idx} className="event-slide">
                    <div className="event-card">
                      <div className="event-badge">
                        {daysLeft > 0 ? `${daysLeft} days left` : "Event ended"}
                      </div>
                      <img src={e.image} alt={e.title} />
                      <h3>{e.title}</h3>
                      <p><strong>Date:</strong> {dayjs(e.date).format("MMM D, YYYY")}</p>
                      <p><strong>Location:</strong> {e.location}</p>
                      {e.isFull ? (
                        <button className="btn disabled" disabled>Registration Closed</button>
                      ) : (
                        <button className="btn" onClick={() => setSelectedEvent(e)}>Sign Up</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        )}

        {/* Donations */}
        {activeTab === "donate" && (
  <div className="donate-grid">
    {donations.map((d, idx) => (
      <div key={idx} className="event-card">
        {/* Status Badge */}
        <div className={`status-badge ${d.status}`}>
          {d.status === "open" ? "Open" : "Closed"}
        </div>

        <img src={d.image} alt={d.title} />
        <h3>{d.title}</h3>
        <p>{d.details}</p>
        <button
          className={`btn ${d.status === "closed" ? "disabled" : ""}`}
          disabled={d.status === "closed"}
          onClick={() => setSelectedDonation(d)}
        >
          {d.status === "closed" ? "Not Accepting" : "Contribute"}
        </button>
      </div>
    ))}
  </div>
)}


        {/* Volunteers */}
        {activeTab === "volunteer" && (
  <div className="donate-grid">
    {volunteers.map((v, idx) => (
      <div key={idx} className="event-card">
        {/* Badge */}
        <div className={`status-badge ${v.status}`}>
          {v.status === "open" ? "Open" : "Closed"}
        </div>

        <img src={v.image} alt={v.title} />
        <h3>{v.title}</h3>
        <p>{v.details.substring(0, 60)}...</p>
        <button
          className={`btn ${v.status === "closed" ? "disabled" : ""}`}
          disabled={v.status === "closed"}
          onClick={() => setSelectedVolunteer(v)}
        >
          {v.status === "closed" ? "Sign-ups Closed" : "Sign Up"}
        </button>
      </div>
    ))}
  </div>
)}

      </section>

      {/* CTA Strip */}
      <section className="cta-strip">
        <h2>Together, we can create meaningful change.</h2>
        <button className="btn">Get Involved Today</button>
      </section>

      {/* Modals */}
      {selectedEvent && <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      {selectedDonation && <DonationDetailsModal donation={selectedDonation} onClose={() => setSelectedDonation(null)} />}
      {selectedVolunteer && <VolunteerDetailsModal volunteer={selectedVolunteer} onClose={() => setSelectedVolunteer(null)} />}

      <Footer />
      <ChatBox />
    </div>
  );
}
