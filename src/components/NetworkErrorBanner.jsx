import React, { useState, useEffect } from "react";
import "../styles/error.css";
import axiosInstance from "../api/axiosInstance";

/**
 * Banner error jaringan.
 * Banner ini bersifat lokal (position: relative di error.css) dan TIDAK menutupi
 * seluruh aplikasi. Muncul hanya jika endpoint health check tidak merespons.
 */
const NetworkErrorBanner = ({ onRetry }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [isChecking, setIsChecking] = useState(false);

	const checkServerAvailability = async () => {
		try {
			const response = await axiosInstance.get("/api/ping", {
				timeout: 5000,
			});
			const available = response.status === 200;
			setIsVisible(!available);
			return available;
		} catch (error) {
			console.error("Server check failed:", error);
			setIsVisible(true);
			return false;
		}
	};

	useEffect(() => {
		checkServerAvailability();

		// Periksa ulang setiap 30 detik
		const intervalId = setInterval(checkServerAvailability, 30000);

		return () => clearInterval(intervalId);
	}, []);

	const handleRetry = async () => {
		setIsChecking(true);
		if (onRetry) {
			onRetry();
		}
		await checkServerAvailability();
		setIsChecking(false);
	};

	if (!isVisible) {
		return null;
	}

	return (
		<div
			className="network-error-banner"
			role="alert"
			aria-live="assertive"
		>
			<span>
				Tidak dapat terhubung ke server. Periksa koneksi internet atau
				pastikan server backend berjalan.
			</span>
			<button type="button" onClick={handleRetry} disabled={isChecking}>
				{isChecking ? "Menghubungkan…" : "Coba lagi"}
			</button>
		</div>
	);
};

export default NetworkErrorBanner;
