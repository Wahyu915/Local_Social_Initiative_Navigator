import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ChatBox from "../components/ChatBox"

// Import icons (Font Awesome)
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaShareAlt, FaFacebook, FaInstagram } from "react-icons/fa"

export default function Contact() {
  const [activeForm, setActiveForm] = useState("message")
  const [thankYou, setThankYou] = useState(null) // store thank you details

  // State for user inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiry: "",
    message: "",
    ngoName: "",
    ngoEmail: "",
    ngoCategory: "",
    ngoDescription: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      inquiry: "",
      message: "",
      ngoName: "",
      ngoEmail: "",
      ngoCategory: "",
      ngoDescription: ""
    })
  }

  const handleMessageSubmit = (e) => {
    e.preventDefault()
    setThankYou({
      type: "message",
      name: formData.name,
      email: formData.email,
    })
    resetForm()
  }

  const handleNgoSubmit = (e) => {
    e.preventDefault()
    setThankYou({
      type: "ngo",
      name: formData.ngoName,
      email: formData.ngoEmail,
    })
    resetForm()
  }

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

          {/* Right Column (Form with Toggle OR Thank You) */}
          <div className="contact-form">
            {!thankYou ? (
              <>
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
                  <form onSubmit={handleMessageSubmit}>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Your Name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    />
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Your Email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                    />
                    <input 
                      type="text" 
                      name="phone" 
                      placeholder="Your Phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                    />
                    <select 
                      name="inquiry" 
                      value={formData.inquiry} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="">Select Inquiry Type</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="general">General Inquiry</option>
                    </select>
                    <textarea 
                      name="message" 
                      placeholder="Your Message" 
                      rows="5" 
                      value={formData.message} 
                      onChange={handleChange} 
                      required
                    ></textarea>
                    <button type="submit" className="btn">Submit</button>
                  </form>
                )}

                {activeForm === "ngo" && (
                  <form onSubmit={handleNgoSubmit}>
                    <input 
                      type="text" 
                      name="ngoName" 
                      placeholder="NGO Name" 
                      value={formData.ngoName} 
                      onChange={handleChange} 
                      required 
                    />
                    <input 
                      type="email" 
                      name="ngoEmail" 
                      placeholder="NGO Email / Website" 
                      value={formData.ngoEmail} 
                      onChange={handleChange} 
                      required 
                    />
                    <select 
                      name="ngoCategory" 
                      value={formData.ngoCategory} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="health">Health</option>
                      <option value="education">Education</option>
                      <option value="environment">Environment</option>
                      <option value="community">Community Development</option>
                      <option value="other">Other</option>
                    </select>
                    <textarea 
                      name="ngoDescription" 
                      placeholder="NGO Description" 
                      rows="5" 
                      value={formData.ngoDescription} 
                      onChange={handleChange} 
                      required
                    ></textarea>
                    <input type="file" />
                    <button type="submit" className="btn">Submit NGO</button>
                  </form>
                )}
              </>
            ) : (
              <div className="thankyou">
                <h2>🎉 Thank You!</h2>
                {thankYou.type === "message" && (
                  <>
                    <p>
                      Dear <strong>{thankYou.name}</strong>, your message has been sent successfully.
                    </p>
                    <p>We’ll get back to you soon at <strong>{thankYou.email}</strong>.</p>
                  </>
                )}
                {thankYou.type === "ngo" && (
                  <>
                    <p>
                      Dear <strong>{thankYou.name}</strong>, your NGO submission has been received.
                    </p>
                    <p>We’ll review it and contact you at <strong>{thankYou.email}</strong> if needed.</p>
                  </>
                )}
                <button className="btn" onClick={() => setThankYou(null)}>Back</button>
              </div>
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
            <FaShareAlt className="extra-icon" />
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






