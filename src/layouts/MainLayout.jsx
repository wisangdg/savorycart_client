import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import NetworkErrorBanner from "../components/NetworkErrorBanner";
import { useAuth } from "../hooks";

const MainLayout = ({ children }) => {
	// Dapatkan checkLoginStatus dari hook useAuth untuk digunakan sebagai onRetry
	const { checkLoginStatus } = useAuth();

	return (
		<div className="main-layout">
			<Header />
			{/* Tambahkan NetworkErrorBanner di sini, antara Header dan main content */}
			<NetworkErrorBanner onRetry={checkLoginStatus} />
			<main className="main-content" id="main-content" tabIndex="-1">
				{children}
			</main>
			<Footer />
		</div>
	);
};

export default MainLayout;
