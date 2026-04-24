import axiosInstance from "../api/axiosInstance";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/orders.css"; // Pastikan untuk menambahkan style jika diperlukan

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || "Gagal mengambil data orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="order-container">
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <h3>Order ID: {order._id}</h3>
              <p>Total: Rp. {order.total?.toLocaleString()}</p>
              <p>Status: {order.status}</p>
              <button
                onClick={() => navigate(`/invoices/${order._id}`)}
                className="view-invoice-button"
              >
                View Invoice
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Order;
