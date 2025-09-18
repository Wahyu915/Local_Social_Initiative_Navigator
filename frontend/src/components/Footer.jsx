import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© 2025 Prihatin Brunei. All rights reserved.</p>
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/getinvolved">Get Involved</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </footer>
  );
}
