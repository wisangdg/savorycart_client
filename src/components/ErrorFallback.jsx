import React from "react";
import { Link } from "react-router-dom";

const ErrorFallback = ({ error, resetErrorBoundary, type = "general" }) => {
  const getErrorMessage = () => {
    if (
      error?.message?.includes("Network Error") ||
      error?.code === "ERR_NETWORK"
    ) {
      return {
        title: "Koneksi ke Server Gagal",
        message:
          "Tidak dapat terhubung ke server. Pastikan server backend berjalan di port 3000.",
        action: "Coba lagi setelah memastikan server backend berjalan.",
      };
    }

    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return {
        title: "Akses Ditolak",
        message:
          "Anda tidak memiliki izin untuk mengakses halaman ini atau sesi Anda telah berakhir.",
        action: "Silakan login kembali untuk melanjutkan.",
      };
    }

    if (error?.response?.status === 404) {
      return {
        title: "Halaman Tidak Ditemukan",
        message: "Halaman atau sumber daya yang Anda cari tidak ditemukan.",
        action: "Kembali ke halaman utama.",
      };
    }

    if (error?.response?.status === 500) {
      return {
        title: "Kesalahan Server",
        message:
          "Terjadi kesalahan pada server. Tim kami sedang menyelesaikan masalah ini.",
        action: "Silakan coba lagi nanti.",
      };
    }

    return {
      title: "Terjadi Kesalahan",
      message: error?.message || "Terjadi kesalahan yang tidak diketahui.",
      action: "Silakan coba lagi atau hubungi dukungan jika masalah berlanjut.",
    };
  };

  const errorInfo = getErrorMessage();

  const renderContent = () => {
    switch (type) {
      case "inline":
        return (
          <div className="inline-error">
            <p className="error-message">{errorInfo.message}</p>
            <button className="btn btn-primary" onClick={resetErrorBoundary}>
              Coba Lagi
            </button>
          </div>
        );

      case "minimal":
        return (
          <div className="minimal-error message message-error">
            <p>{errorInfo.message}</p>
            {resetErrorBoundary && (
              <button
                className="btn btn-sm btn-primary"
                onClick={resetErrorBoundary}
              >
                Coba Lagi
              </button>
            )}
          </div>
        );

      default:
        return (
          <div className="error-content">
            <h2>{errorInfo.title}</h2>
            <p>{errorInfo.message}</p>
            <p>{errorInfo.action}</p>
            <div className="error-actions">
              {resetErrorBoundary && (
                <button
                  className="btn btn-primary"
                  onClick={resetErrorBoundary}
                >
                  Coba Lagi
                </button>
              )}
              <Link to="/" className="btn btn-secondary">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        );
    }
  };

  if (type === "inline" || type === "minimal") {
    return renderContent();
  }

  return (
    <div className="error-fallback">
      <div className="error-container">{renderContent()}</div>
    </div>
  );
};

export default ErrorFallback;
