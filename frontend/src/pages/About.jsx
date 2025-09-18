import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ChatBox from "../components/ChatBox"
import Section from "../components/Section"

export default function About() {
  return (
    <div>
      <Navbar />

      {/* Hero with uploaded image */}
      <div className="about-hero">
        <div className="about-hero-overlay">
          <h1>About Us</h1>
        </div>
      </div>

      {/* Our Story */}
      <section className="story-section">
        <h2>Our Story</h2>
        <p>
          Prihatin Brunei was founded to connect NGOs, volunteers, and donors on one platform.  
          We believe in making community support more accessible, transparent, and impactful.  
          Our story began with a simple idea: make it easier for people to get involved and help those in need.
        </p>
      </section>

     {/* Mission & Vision */}
<section className="mission-vision-section">
  <h2>Our Mission & Vision</h2>
  <div className="mission-vision">
    <div className="box">
      <h3>Our Mission</h3>
      <p>
        To empower NGOs by providing a digital hub that connects them with volunteers and donors,  
        ensuring their efforts reach those who need it most.
      </p>
    </div>
    <div className="box">
      <h3>Our Vision</h3>
      <p>
        A united Brunei where communities thrive through collaboration, compassion, and collective action.
      </p>
    </div>
  </div>
</section>


      {/* Join Us */}
      <section className="join-us">
        <h2>Join Us</h2>
        <p>
          Together, we can create meaningful impact. Be part of the change.  
        </p>
      </section>

      <Footer />
      <ChatBox />
    </div>
  )
}
