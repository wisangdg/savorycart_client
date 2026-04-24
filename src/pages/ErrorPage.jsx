import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import "../styles/error.css";

/**
 * ErrorPage component untuk menampilkan halaman error
 * Digunakan untuk error routing dan error lainnya
 */
const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  // Tentukan status code dan pesan berdasarkan error
  let statusCode = 500;
  let title = "Terjadi Kesalahan";
  let description = "Maaf, terjadi kesalahan saat memuat halaman ini.";

  if (error) {
    if (error.status === 404) {
      statusCode = 404;
      title = "Halaman Tidak Ditemukan";
      description = "Maaf, halaman yang Anda cari tidak ditemukan.";
    } else if (error.status) {
      statusCode = error.status;
    }

    if (error.data?.message) {
      description = error.data.message;
    } else if (error.message) {
      description = error.message;
    }
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <MainLayout>
      <div className="error-page">
        <h1 className="error-code">{statusCode}</h1>
        <h2 className="error-title">{title}</h2>
        <p className="error-description">{description}</p>

        {process.env.NODE_ENV === "development" && error && (
          <div className="error-details">
            <h3>Detail Error:</h3>
            <p className="error-message">{error.toString()}</p>
            {error.stack && <pre className="error-stack">{error.stack}</pre>}
          </div>
        )}

        <div className="error-actions">
          <button className="btn btn-primary" onClick={handleGoBack}>
            Kembali
          </button>
          <button className="btn btn-secondary" onClick={handleGoHome}>
            Ke Beranda
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ErrorPage;
