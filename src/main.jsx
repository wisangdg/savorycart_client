import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import QueryProvider from "./providers/QueryProvider";
import App from "./App.jsx";
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { setupKeyboardNavigation } from "./utils/keyboardNavigation";
import ErrorBoundary from "./components/common/ErrorBoundary";
import * as Sentry from "@sentry/react";
import { registerSW } from "virtual:pwa-register";

// Base styles - foundational CSS only
import "./styles/variables.css";
import "./styles/design-system.css";

Sentry.init({
  dsn: "https://7ef1c4c659624d1270f410a840ddca50@o4509489612521472.ingest.us.sentry.io/4509489614487552",
  sendDefaultPii: true,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <QueryProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Setup PWA service worker registration
const updateSW = registerSW({
  onNeedRefresh() {
    // Optionally prompt user to reload for new updates
  },
  onOfflineReady() {
    console.log("App is ready to work offline.");
  },
});

// Setup keyboard navigation detection
setupKeyboardNavigation();
