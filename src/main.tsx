// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

// Contexts
import { NotificationProvider } from "./contexts/NotificationContext";

// Create root and render
const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

createRoot(container).render(
  <React.StrictMode>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </React.StrictMode>
);