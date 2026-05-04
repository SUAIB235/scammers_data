import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import CopyPaste from "./copypaste.jsx";
import Support from "./support.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/copypaste" element={<CopyPaste />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);