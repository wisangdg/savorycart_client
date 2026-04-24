import axiosInstance from "../api/axiosInstance";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import "../styles/orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          skip: 0,
          limit: 10,
        },
      });
      setOrders(response.data.data.reverse() || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
    const savedAddress = localStorage.getItem("selectedAddress");
    if (savedAddress) {
      setSelectedAddress(JSON.parse(savedAddress));
    }
  }, [fetchOrders]);

  useEffect(() => {
    if (location.state?.orderCreated) {
      fetchOrders();
    }
  }, [location.state, fetchOrders]);

  const handleDeleteOrder = async (orderId) => {
    try {
      await axiosInstance.delete(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchOrders(); // Refresh orders after deletion
    } catch (err) {
      console.error("Error deleting order:", err);
      setError(err.response?.data?.message || "Failed to delete order");
    }
  };

  const handleConfirmOrder = async (orderId) => {
    console.log("Confirming order with ID:", orderId);

    try {
      const response = await axiosInstance.post(
        "/api/invoices",
        { order_id: orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Invoice created:", response.data);
      navigate(`/invoices/${orderId}`);
    } catch (err) {
      console.error("Error creating invoice:", err);
      setError(err.response?.data?.message || "Failed to create invoice");
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <MainLayout>
      <div className="orders-container">
        <h1>Orders</h1>

        {selectedAddress && (
          <div className="selected-address-container">
            <h3>Alamat Pengiriman:</h3>
            <p>
              {selectedAddress.addressName}, {selectedAddress.kelurahan},
              {selectedAddress.kecamatan}, {selectedAddress.kabupatenkota},
              {selectedAddress.provinsi}, {selectedAddress.detail}
            </p>
          </div>
        )}

        {orders.length > 0 ? (
          <ul className="orders-list">
            {orders.map((order) => (
              <li key={order._id} className="orders-item">
                <h3>Order #{order.order_number}</h3>
                <p>Order id: {order._id}</p>
                <p>
                  Status:{" "}
                  <span className={`status-${order.status}`}>
                    {order.status}
                  </span>
                </p>
                <p>
                  Sub Total: Rp.{" "}
                  {order.sub_total ? order.sub_total.toLocaleString() : "N/A"}
                </p>
                <p>
                  Delivery Fee: Rp.{" "}
                  {order.delivery_fee
                    ? order.delivery_fee.toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  Total: Rp.{" "}
                  {order.total ? order.total.toLocaleString() : "N/A"}
                </p>
                <p>Total Items: {order.items_count}</p>
                <div className="orders-items">
                  <h4>Items:</h4>
                  <ul>
                    {order.order_items.map((item) => (
                      <li key={item._id}>
                        {item.name} - {item.qty}x @ Rp.{" "}
                        {item.price.toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
                {order.delivery_address && (
                  <div className="delivery-address">
                    <h4>Delivery Address:</h4>
                    <p>
                      {order.delivery_address.detail},{" "}
                      {order.delivery_address.kelurahan},
                      {order.delivery_address.kecamatan},{" "}
                      {order.delivery_address.kabupaten},
                      {order.delivery_address.provinsi}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="delete-order-button"
                >
                  Hapus Order
                </button>
                <button
                  onClick={() => handleConfirmOrder(order._id)}
                  className="confirm-order-button"
                >
                  Konfirmasi
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-orders">No orders found.</p>
        )}
      </div>
    </MainLayout>
  );
};

export default Orders;
