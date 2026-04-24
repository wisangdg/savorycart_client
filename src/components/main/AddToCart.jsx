import axiosInstance from "../../api/axiosInstance.js";
import React, { useState } from "react";
import { MdShoppingCart } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../../store.js";
import "../../styles/main.css";

const AddToCart = ({ menu }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCart = async () => {
    try {
      setIsLoading(true);

      if (!token) {
        showNotification("Silahkan login terlebih dahulu", "warning");
        return;
      }

      if (!menu._id) {
        showNotification("ID produk tidak valid", "error");
        return;
      }

      const cartData = { product: menu._id, qty: 1 };

      await axiosInstance.post("/api/carts", cartData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await dispatch(fetchCart(token));
      showNotification("Sukses menambahkan produk ke keranjang", "success");
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Gagal menambahkan produk ke keranjang",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = "info") => {
    const existingNotifications = document.querySelectorAll(".message");
    existingNotifications.forEach((n) => {
      document.body.contains(n) && document.body.removeChild(n);
    });

    const notification = document.createElement("div");
    notification.className = `message message-${type}`;
    notification.setAttribute("role", "alert");
    notification.setAttribute("aria-live", "assertive");
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.zIndex = "9999";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  return (
    <button
      onClick={handleAddCart}
      className={`btn-cart ${isLoading ? "btn-loading" : ""}`}
      disabled={isLoading}
      aria-label={`Tambahkan ${menu.name} ke keranjang belanja`}
      aria-busy={isLoading}
    >
      <MdShoppingCart
        aria-hidden="true"
        style={{ color: "white", fontSize: "1.2rem" }}
        className="cart-icon"
      />
      <span>{isLoading ? "Menambahkan..." : "Add to Cart"}</span>
    </button>
  );
};

export default AddToCart;

