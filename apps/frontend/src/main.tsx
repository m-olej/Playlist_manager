import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { SpotifyLogin } from "./components";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {!localStorage.getItem("AccessToken") ? <SpotifyLogin /> : <App />}
  </StrictMode>
);
