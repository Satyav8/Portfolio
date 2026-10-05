import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./fonts.css";
import "./styles.css";
import "./v2.css";
import "./v3.css";
import "./v4.css";
import "./v5.css";
import "./v6.css";
import "./v7.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
