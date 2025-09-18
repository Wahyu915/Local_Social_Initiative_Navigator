// src/pages/Home.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";
import Slider from "react-slick";
import {
  FaHandsHelping,
  FaDonate,
  FaUsers,
  FaCalendarAlt,
  FaPlusCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useUpdates } from "../context/UpdatesContext";
import UpdateCard from "../components/UpdateCard";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const { events, donations, volunteers, loadAll } = useUpdates();

  useEffect(() => {
    loadAll(); // ✅ fetch all updates on load
  }, []);

  const heroSlides = [
    {
      title: "Caring for Brunei, Together",
      desc: "Join us in making a difference through NGOs, events, and volunteering.",
      btnText: "Get Involved",
      btnLink: "/getinvolved",
      img: "src/assets/hero1.png",
    },
    {
      title: "Support NGOs Across Brunei",
      desc: "Discover organizations empowering communities in all sectors.",
      btnText: "Discover NGOs",
      btnLink: "/discover",
      img: "src/assets/hero2.png",
    },
    {
      title: "Your Time, Your Impact",
      desc: "Volunteer your skills and contribute to causes that matter.",
      btnText: "Volunteer Now",
      btnLink: "/getinvolved",
      img: "src/assets/hero3.png",
    },
  ];

  const heroSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const updateSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  // ✅ Merge updates
  const latestUpdates = [
    ...events.map((e) => ({ ...e, type: "event" })),
    ...donations.map((d) => ({ ...d, type: "donation" })),
    ...volunteers.map((v) => ({ ...v, type: "volunteer" })),
  ].slice(0, 6);

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <Slider {...heroSettings} className="hero-carousel">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className="hero-slide"
            style={{ backgroundImage: `url(${slide.img})` }}
          >
            <div className="hero-overlay fade-in">
              <h1>{slide.title}</h1>
              <p>{slide.desc}</p>
              <Link to={slide.btnLink} className="btn">
                {slide.btnText}
              </Link>
            </div>
          </div>
        ))}
      </Slider>

      {/* About Us */}
      <section className="about-preview alt-bg">
        <h2>About Us</h2>
        <p>
          Prihatin Brunei is a platform connecting NGOs, volunteers, and donors
          to create a stronger community.
        </p>
        <Link to="/about" className="btn">
          Learn More
        </Link>
      </section>

      {/* Features */}
      <section className="features-carousel">
        <h2>What You Can Do</h2>
        <div className="features-row">
          <Link to="/discover" className="feature-card">
            <div className="feature-icon"><FaHandsHelping /></div>
            <p>Browse NGOs</p>
          </Link>
          <Link to="/getinvolved" className="feature-card">
            <div className="feature-icon"><FaDonate /></div>
            <p>Donate</p>
          </Link>
          <Link to="/getinvolved" className="feature-card">
            <div className="feature-icon"><FaUsers /></div>
            <p>Volunteer</p>
          </Link>
          <Link to="/getinvolved" className="feature-card">
            <div className="feature-icon"><FaCalendarAlt /></div>
            <p>Events</p>
          </Link>
          <Link to="/submit" className="feature-card">
            <div className="feature-icon"><FaPlusCircle /></div>
            <p>Submit NGO</p>
          </Link>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="featured-section fade-in alt-bg">
        <h2>Latest Updates</h2>
        <Slider {...updateSettings}>
          {latestUpdates.length > 0 ? (
            latestUpdates.map((item) => (
              <UpdateCard key={`${item.type}-${item.id}`} item={item} />
            ))
          ) : (
            <p>No updates yet.</p>
          )}
        </Slider>
      </section>

      {/* Contact */}
      <section className="get-in-touch alt-bg">
        <h2>Get in Touch</h2>
        <div className="contact-options">
          <div className="contact-card"><FaPhone /><p>Call Us</p></div>
          <div className="contact-card"><FaEnvelope /><p>Email Us</p></div>
          <div className="contact-card"><FaMapMarkerAlt /><p>Visit Us</p></div>
          <div className="contact-card"><FaPlusCircle /><p>Submit NGO</p></div>
        </div>
      </section>

      <Footer />
      <div className="chatbot-tooltip">
        <div className="tooltip">💬 Need help? Chat with us</div>
        <ChatBox />
      </div>
    </div>
  );
}


