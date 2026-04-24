/**
 * Aplikasi utama Eduwork E-Commerce
 *
 * Komponen ini adalah root dari aplikasi yang menangani:
 * - Routing dengan React Router
 * - Lazy loading komponen untuk optimasi performa
 * - Error handling dengan ErrorBoundary
 * - Autentikasi dengan useAuth hook
 * - Pencarian produk
 *
 * @module App
 */
import React, {
  useEffect,
  useState,
  Suspense,
  lazy,
  useCallback,
  useRef,
} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "./hooks";
import { API_ENDPOINTS, ROUTES } from "./constants";
import axiosInstance from "./api/axiosInstance";
import { handleApiError } from "./utils/errorHandlers";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ErrorProvider from "./providers/ErrorProvider";
import ErrorPage from "./pages/ErrorPage";
import { getStartupHealth } from "./utils/serverHealth";

// Import component-specific and page styles
import "./styles/app.css";
import "./styles/main.css";
import "./styles/buttons.css";
import "./styles/cards.css";
import "./styles/layout.css";
import "./styles/animations.css";
import "./styles/header.css";
import "./styles/pagination.css";
import "./styles/carts.css";
import "./styles/orders.css";
import "./styles/accessibility.css";
import "./styles/error.css";
import "./styles/loading.css";

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Account = lazy(() => import("./pages/Account.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const Invoices = lazy(() => import("./components/Invoices.jsx"));

/**
 * Komponen fallback yang ditampilkan saat komponen lain sedang di-load
 *
 * Fitur:
 * - Menampilkan spinner loading
 * - Menampilkan pesan yang berbeda berdasarkan durasi loading
 * - Menampilkan tombol refresh jika loading terlalu lama (> 8 detik)
 * - Memoized untuk mencegah render ulang yang tidak perlu
 *
 * @component
 * @returns {React.ReactElement} Komponen loading fallback
 */
const LoadingFallback = React.memo(() => {
  // Use state to track loading time
  const [loadingTime, setLoadingTime] = React.useState(0);

  // Update loading time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setLoadingTime((prev) => prev + 1);
    }, 1000);

    // Cleanup timer on unmount
    return () => clearInterval(timer);
  }, []);

  /**
   * Mengembalikan pesan yang sesuai berdasarkan durasi loading
   *
   * @returns {string} Pesan loading yang sesuai
   */
  const getMessage = () => {
    if (loadingTime < 3) return "Loading...";
    if (loadingTime < 6) return "Almost there...";
    return "This is taking longer than expected. Please wait...";
  };

  return (
    <div className="loading-fallback">
      <div className="loading-spinner"></div>
      <p>{getMessage()}</p>
      {loadingTime > 8 && (
        <button
          className="btn btn-primary mt-3"
          onClick={() => window.location.reload()}
          aria-label="Refresh page"
        >
          Refresh Page
        </button>
      )}
    </div>
  );
});

/**
 * Komponen utama aplikasi yang menangani routing, autentikasi, dan state global
 *
 * @component
 * @returns {React.ReactElement} Aplikasi React
 */
function App() {
  // Get auth state and methods from custom hook
  const { checkLoginStatus, isAuthenticated } = useAuth();

  // State for categories and search
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [serverStatus, setServerStatus] = useState({
    isHealthy: false,
    checking: true,
  });

  /**
   * Mengambil data kategori dari API
   *
   * @async
   * @returns {Promise<Array>} Array berisi data kategori
   */
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return [];
    }
  }, []);

  // Check login status on mount
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  // Load categories on mount
  useEffect(() => {
    /**
     * Memuat data kategori dan menyimpannya ke state
     *
     * @async
     */
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };
    loadCategories();
  }, [fetchCategories]);

  // Check server health on mount with silent retries
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const health = await getStartupHealth();
      if (!cancelled) setServerStatus({ ...health, checking: false });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const location = useLocation();

  // Debounce timer reference
  const searchTimerRef = useRef(null);

  /**
   * Menangani perubahan input pencarian dengan debounce
   * untuk mengurangi jumlah request ke API
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Event perubahan input
   */
  const handleSearchChange = useCallback((event) => {
    const searchValue = event.target.value;

    // Clear previous timer
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    // Set new timer (300ms debounce)
    searchTimerRef.current = setTimeout(() => {
      setSearchKeyword(searchValue);
    }, 300);
  }, []);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  // Show server status if not healthy
  if (serverStatus.checking) {
    return <LoadingFallback />;
  }

  if (!serverStatus.isHealthy) {
    return (
      <div className="server-error">
        <h2>Server Connection Error</h2>
        <p>{serverStatus.message || serverStatus.error}</p>
        <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
          Attempts: {serverStatus.attempts}{" "}
          {serverStatus.db && `(DB: ${serverStatus.db})`}
        </p>
        <button onClick={() => window.location.reload()}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ErrorProvider>
        <div>
          <div className="skip-link">
            <a href="#main-content" className="visually-hidden focusable">
              Skip to main content
            </a>
          </div>
          <Suspense fallback={<LoadingFallback />}>
            <main id="main-content">
              <Routes>
                <Route
                  path={ROUTES.HOME}
                  element={
                    <Home
                      searchKeyword={searchKeyword}
                      handleSearchChange={handleSearchChange}
                      categories={categories}
                    />
                  }
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.LOGIN}
                  element={<Login />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.REGISTER}
                  element={<Register key={location.pathname} />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.ORDERS}
                  element={isAuthenticated ? <Orders /> : <Login />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.ACCOUNT}
                  element={isAuthenticated ? <Account /> : <Login />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.INVOICES(":orderId")}
                  element={isAuthenticated ? <Invoices /> : <Login />}
                  errorElement={<ErrorPage />}
                />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </main>
          </Suspense>
        </div>
      </ErrorProvider>
    </ErrorBoundary>
  );
}

export default App;
