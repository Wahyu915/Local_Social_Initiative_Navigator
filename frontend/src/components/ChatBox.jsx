import React, { useState } from "react"

export default function ChatBox() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <div className="chat-window">
          <div style={{ padding: "10px", background: "#0077b6", color: "white" }}>
            <strong>AI Assistant</strong>
            <button
              style={{
                float: "right",
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer"
              }}
              onClick={() => setOpen(false)}
            >
              ✖
            </button>
          </div>
          <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
            <p>Hello! How can I help you today?</p>
          </div>
          <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #ccc" }}>
            <input type="text" placeholder="Type a message..." style={{ flex: 1, padding: "8px" }} />
            <button className="btn">Send</button>
          </div>
        </div>
      )}

      <button className="chat-button" onClick={() => setOpen(!open)}>
        💬
      </button>
    </>
  )
}
