import React from "react";
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

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  /* ---------------- Hero Carousel ---------------- */
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

  /* ---------------- Features Icons ---------------- */
  const features = [
    { icon: <FaHandsHelping />, text: "Browse NGOs", link: "/discover" },
    { icon: <FaDonate />, text: "Donate", link: "/getinvolved" },
    { icon: <FaUsers />, text: "Volunteer", link: "/getinvolved" },
    { icon: <FaCalendarAlt />, text: "Events", link: "/getinvolved" },
    { icon: <FaPlusCircle />, text: "Submit NGO", link: "/submit" },
  ];

  /* ---------------- Featured NGOs ---------------- */
  const ngos = [
    {
      id: 1,
      name: "Brunei Animal Welfare",
      category: "Animal Rights",
      logo: "https://via.placeholder.com/100?text=Animal",
    },
    {
      id: 2,
      name: "Green Earth Brunei",
      category: "Environment",
      logo: "https://via.placeholder.com/100?text=Earth",
    },
    {
      id: 3,
      name: "Youth for Change",
      category: "Youth Development",
      logo: "https://via.placeholder.com/100?text=Youth",
    },
  ];

  const ngoSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  /* ---------------- Latest Events ---------------- */
  const events = [
    {
      id: 1,
      title: "Beach Cleanup Drive",
      date: "Oct 5, 2025",
      location: "Muara Beach",
      img: "https://via.placeholder.com/640x400?text=Beach+Cleanup",
      link: "/getinvolved",
    },
    {
      id: 2,
      title: "Fundraising Marathon",
      date: "Oct 20, 2025",
      location: "Bandar Seri Begawan",
      img: "https://via.placeholder.com/640x400?text=Marathon",
      link: "/getinvolved",
    },
    {
      id: 3,
      title: "Tree Planting Project",
      date: "Nov 15, 2025",
      location: "Temburong",
      img: "https://via.placeholder.com/640x400?text=Tree+Planting",
      link: "/getinvolved",
    },
  ];

  const eventSettings = {
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

      {/* About Us Preview */}
      <section className="about-preview alt-bg">
        <h2>About Us</h2>
        <p>
          Prihatin Brunei is a platform connecting NGOs, volunteers, and donors
          to create a stronger community. Together, we work towards sustainable
          development and care for Brunei.
        </p>
        <Link to="/about" className="btn">
          Learn More
        </Link>
      </section>

      {/* Features Icons */}
      <section className="features-carousel">
        <h2>What You Can Do</h2>
        <div className="features-row">
          {features.map((f, idx) => (
            <Link to={f.link} key={idx} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <p>{f.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured NGOs */}
      <section className="featured-section alt-bg">
        <h2>Featured NGOs</h2>
        <Slider {...ngoSettings}>
          {ngos.map((ngo) => (
            <div key={ngo.id} className="ngo-card">
              <img src={ngo.logo} alt={ngo.name} />
              <h3>{ngo.name}</h3>
              <p>{ngo.category}</p>
              <Link to={`/ngo/${ngo.id}`} className="btn">
                View Profile
              </Link>
            </div>
          ))}
        </Slider>
        <div className="view-all-wrapper">
          <Link to="/discover" className="btn secondary-btn">
            View All NGOs
          </Link>
        </div>
      </section>

      {/* Latest Events */}
      <section className="featured-section fade-in alt-bg">
        <h2>Latest Events</h2>
        <Slider {...eventSettings}>
          {events.map((event) => (
            <div key={event.id} className="ngo-card event-card">
              <img src={event.img} alt={event.title} />
              <h3>{event.title}</h3>
              <p>
                <strong>{event.date}</strong> • {event.location}
              </p>
              <Link to={event.link} className="btn">
                Learn More
              </Link>
            </div>
          ))}
        </Slider>
      </section>

      {/* Get in Touch */}
      <section className="get-in-touch alt-bg">
        <h2>Get in Touch</h2>
        <p>
          We’d love to hear from you. Here are ways you can reach us and stay
          connected.
        </p>
        <div className="contact-options">
          <div className="contact-card">
            <FaPhone />
            <p>Call Us</p>
          </div>
          <div className="contact-card">
            <FaEnvelope />
            <p>Email Us</p>
          </div>
          <div className="contact-card">
            <FaMapMarkerAlt />
            <p>Visit Us</p>
          </div>
          <div className="contact-card">
            <FaPlusCircle />
            <p>Submit NGO</p>
          </div>
        </div>
      </section>

      <Footer />

      {/* Chatbot Tooltip */}
      <div className="chatbot-tooltip">
        <div className="tooltip">💬 Need help? Chat with us</div>
        <ChatBox />
      </div>
    </div>
  );
}


