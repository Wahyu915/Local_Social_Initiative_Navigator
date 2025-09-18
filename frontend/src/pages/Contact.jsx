import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ChatBox from "../components/ChatBox"

// Import icons (Font Awesome)
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaShareAlt, FaFacebook, FaInstagram } from "react-icons/fa"


export default function Contact() {
  const [activeForm, setActiveForm] = useState("message")

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-overlay">
          <h1>Contact Us</h1>
          <p>We’d love to hear from you</p>
        </div>
      </div>

      {/* Contact Section */}
      <section className="contact-main">
        <div className="contact-container">
          {/* Left Column */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              Have a question or want to contribute?  
              Use the form to send us a message or submit an NGO.
            </p>
          </div>

          {/* Right Column (Form with Toggle) */}
          <div className="contact-form">
            <div className="form-toggle">
              <button
                className={activeForm === "message" ? "toggle-btn active" : "toggle-btn"}
                onClick={() => setActiveForm("message")}
              >
                Send us a Message
              </button>
              <button
                className={activeForm === "ngo" ? "toggle-btn active" : "toggle-btn"}
                onClick={() => setActiveForm("ngo")}
              >
                Submit an NGO
              </button>
            </div>

            {activeForm === "message" && (
              <form onSubmit={(e) => { e.preventDefault(); alert("Message submitted!"); }}>
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email" required />
                <input type="text" placeholder="Your Phone" />
                <select required>
                  <option value="">Select Inquiry Type</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="general">General Inquiry</option>
                </select>
                <textarea placeholder="Your Message" rows="5" required></textarea>
                <button type="submit" className="btn">Submit</button>
              </form>
            )}

            {activeForm === "ngo" && (
              <form onSubmit={(e) => { e.preventDefault(); alert("NGO submitted!"); }}>
                <input type="text" placeholder="NGO Name" required />
                <input type="email" placeholder="NGO Email / Website" required />
                <select required>
                  <option value="">Select Category</option>
                  <option value="health">Health</option>
                  <option value="education">Education</option>
                  <option value="environment">Environment</option>
                  <option value="community">Community Development</option>
                  <option value="other">Other</option>
                </select>
                <textarea placeholder="NGO Description" rows="5" required></textarea>
                <input type="file" />
                <button type="submit" className="btn">Submit NGO</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Info Section */}
      <section className="contact-extra">
  <div className="extra-container">
    <div className="extra-box">
      <FaPhoneAlt className="extra-icon" />
      <h3>Call or WhatsApp</h3>
      <p>+673 1234567</p>
    </div>
    <div className="extra-box">
      <FaEnvelope className="extra-icon" />
      <h3>Mail Us</h3>
      <p>support@prihatinbrunei.org</p>
    </div>
    <div className="extra-box">
      <FaMapMarkerAlt className="extra-icon" />
      <h3>Visit Us</h3>
      <p>Bandar Seri Begawan, Brunei Darussalam</p>
    </div>
    <div className="extra-box">
  <FaShareAlt className="extra-icon" />  {/* Main yellow icon */}
  <h3>Follow Us</h3>
  <div className="social-links">
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
      <FaFacebook />
    </a>
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
      <FaInstagram />
    </a>
  </div>
</div>

  </div>
</section>


      <Footer />
      <ChatBox />
    </div>
  )
}




