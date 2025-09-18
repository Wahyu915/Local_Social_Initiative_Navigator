import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // 🔹 track login modal

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <Link to="/">Prihatin Brunei</Link>
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
        
        {/* 🔹 Login button now opens modal */}
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

      {/* 🔹 Render Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </nav>
  );
}

