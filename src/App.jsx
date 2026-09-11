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
import React, { useEffect, useState, Suspense, lazy, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "./hooks";
import { ROUTES } from "./constants";
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

	// Status koneksi server
	const [serverStatus, setServerStatus] = useState({
		isHealthy: false,
		checking: true,
	});

	// Check login status on mount
	useEffect(() => {
		checkLoginStatus();
	}, [checkLoginStatus]);

	// Check server health on mount with silent retries.
	// Bisa dipanggil ulang dari tombol "Coba lagi" pada banner koneksi.
	const checkServer = useCallback(async () => {
		setServerStatus((prev) => ({ ...prev, checking: true }));
		const health = await getStartupHealth();
		setServerStatus({ ...health, checking: false });
	}, []);

	useEffect(() => {
		checkServer();
	}, [checkServer]);

	const location = useLocation();

	// Tampilkan status koneksi sebagai banner tanpa menghilangkan shell aplikasi.
	const showConnectionBanner =
		!serverStatus.checking && !serverStatus.isHealthy;

	return (
		<ErrorBoundary>
			<ErrorProvider>
				<div>
					{showConnectionBanner && (
						<div className="server-error-banner" role="alert">
							<span>
								Tidak dapat terhubung ke server.
								{serverStatus.message || serverStatus.error
									? ` ${serverStatus.message || serverStatus.error}`
									: ""}
							</span>
							<button
								type="button"
								className="btn btn-primary btn-sm"
								onClick={checkServer}
							>
								Coba lagi
							</button>
						</div>
					)}
					<Suspense fallback={<LoadingFallback />}>
						<div className="app-content">
							<Routes>
								<Route
									path={ROUTES.HOME}
									element={<Home />}
									errorElement={<ErrorPage />}
								/>
								<Route
									path={ROUTES.LOGIN}
									element={<Login />}
									errorElement={<ErrorPage />}
								/>
								<Route
									path={ROUTES.REGISTER}
									element={
										<Register key={location.pathname} />
									}
									errorElement={<ErrorPage />}
								/>
								<Route
									path={ROUTES.ORDERS}
									element={
										isAuthenticated ? <Orders /> : <Login />
									}
									errorElement={<ErrorPage />}
								/>
								<Route
									path={ROUTES.ACCOUNT}
									element={
										isAuthenticated ? (
											<Account />
										) : (
											<Login />
										)
									}
									errorElement={<ErrorPage />}
								/>
								<Route
									path={ROUTES.INVOICES(":orderId")}
									element={
										isAuthenticated ? (
											<Invoices />
										) : (
											<Login />
										)
									}
									errorElement={<ErrorPage />}
								/>
								<Route path="*" element={<ErrorPage />} />
							</Routes>
						</div>
					</Suspense>
				</div>
			</ErrorProvider>
		</ErrorBoundary>
	);
}

export default App;
