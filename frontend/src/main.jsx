// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./App.css";
import { UpdatesProvider } from "./context/UpdatesContext"; // ✅ updated
import { SupporterProvider } from "./context/SupporterContext";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UpdatesProvider>
      <SupporterProvider>
        <App />
      </SupporterProvider>
    </UpdatesProvider>
  </BrowserRouter>
);
