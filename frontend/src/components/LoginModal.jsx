import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaBuilding, FaUser } from "react-icons/fa";

export default function LoginModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="modal-overlay">
      <div className="modal login-modal">
        {/* Close button */}
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        {/* Modal Header */}
        <h2>Login</h2>
        <p className="login-subtext">Please choose how you want to log in.</p>

        {/* Options */}
        <div className="login-options">
          <button
            className="btn login-option"
            onClick={() => {
              onClose();
              navigate("/dashboard"); // NGO Dashboard
            }}
          >
            <FaBuilding className="login-icon" /> Login as NGO
          </button>

          <button
            className="btn login-option"
            onClick={() => {
              onClose();
              navigate("/supporter"); // Supporter Dashboard (or landing page)
            }}
          >
            <FaUser className="login-icon" /> Login as Supporter
          </button>
        </div>
      </div>
    </div>
  );
}

