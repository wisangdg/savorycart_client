import axiosInstance from "../api/axiosInstance";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "../layouts/MainLayout";
import "../styles/invoices.css";

const Invoices = () => {
  const { orderId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        console.log("Fetching invoice for order ID:", orderId);
        const response = await axiosInstance.get(`/api/invoices/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Response data:", response.data);
        setInvoice(response.data);
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError(err.response?.data?.message || "Gagal mengambil data invoice");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchInvoice();
    }
  }, [orderId, token]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <MainLayout>
      <div className="invoice-container">
        <h1>Invoice</h1>
        {invoice && (
          <div>
            <h2>Order Number: {invoice.order?.order_number}</h2>
            <p>Subtotal: Rp. {invoice.sub_total?.toLocaleString()}</p>
            <p>Delivery Fee: Rp. {invoice.delivery_fee?.toLocaleString()}</p>
            <p>Total: Rp. {invoice.total?.toLocaleString()}</p>
            <h3>Delivery Address:</h3>
            <p>
              {invoice.delivery_address?.detail},{" "}
              {invoice.delivery_address?.kelurahan},{" "}
              {invoice.delivery_address?.kecamatan},{" "}
              {invoice.delivery_address?.kabupaten},{" "}
              {invoice.delivery_address?.provinsi}
            </p>
            <h3>Items:</h3>
            <ul>
              {invoice.order_items?.map((item) => (
                <li key={item._id}>
                  {item.name} - {item.qty}x @ Rp. {item.price?.toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button className="back-home-button" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </MainLayout>
  );
};

export default Invoices;
