import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { connectivity } from "./offline/ConnectivityMonitor";
import "./styles/index.css";
import { authService } from "./auth/AuthService";
import { lists } from "./store/ListsStore";
connectivity.start();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js"));
}
authService.onChange((u) => lists.attach(u?.uid ?? null));
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);