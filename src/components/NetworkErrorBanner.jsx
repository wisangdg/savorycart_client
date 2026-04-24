import React, { useState, useEffect } from "react";
import "../styles/error.css";
import axiosInstance from "../api/axiosInstance";

const NetworkErrorBanner = ({ onRetry }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isServerAvailable, setIsServerAvailable] = useState(true);

  useEffect(() => {
    // Fungsi untuk memeriksa ketersediaan server
    const checkServerAvailability = async () => {
      try {
        const response = await axiosInstance.get("/api/ping", {
          timeout: 5000,
        });
        if (response.status === 200) {
          setIsServerAvailable(true);
          setIsVisible(false);
        } else {
          setIsServerAvailable(false);
          setIsVisible(true);
        }
      } catch (error) {
        console.error("Server check failed:", error);
        setIsServerAvailable(false);
        setIsVisible(true);
      }
    };

    // Periksa ketersediaan server saat komponen dimount
    checkServerAvailability();

    // Periksa ketersediaan server setiap 30 detik
    const intervalId = setInterval(checkServerAvailability, 30000);

    // Cleanup interval saat komponen unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    window.location.reload();
  };

  if (!isVisible || isServerAvailable) {
    return null;
  }

  return (
    <div className="network-error-banner">
      <span>
        Tidak dapat terhubung ke server. Pastikan server backend berjalan.
      </span>
      <button onClick={handleRetry}>Coba Lagi</button>
    </div>
  );
};

export default NetworkErrorBanner;
