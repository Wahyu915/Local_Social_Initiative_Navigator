// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import LoginModal from "./LoginModal";
import logo from "../assets/Home.png"; // ✅ replace with your 2nd image file

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo with text */}
      <div className="logo">
        <Link 
          to="/" 
          onClick={() => setMenuOpen(false)} 
          style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
        >
          <img 
            src={logo} 
            alt="Prihatin Brunei Logo" 
              className="navbar-logo"
              style={{ height: "40px", marginRight: "10px", verticalAlign: "middle" }}
          />
          <span style={{ fontWeight: "700", fontSize: "18px", verticalAlign: "middle" }}>
            Prihatin Brunei
          </span>
        </Link>
      </div>

      {/* Hamburger Icon (mobile only) */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Nav Links */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/discover" onClick={() => setMenuOpen(false)}>Discover</Link>
        <Link to="/getinvolved" onClick={() => setMenuOpen(false)}>Get Involved</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        
        {/* Login button opens modal */}
        <button 
          className="btn login-btn"
          onClick={() => {
            setMenuOpen(false);
            setShowLogin(true);
          }}
        >
          Login
        </button>
      </div>

      {/* Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </nav>
  );
}
