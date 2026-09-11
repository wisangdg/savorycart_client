import axiosInstance from "../../api/axiosInstance.js";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdShoppingCart } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../../store.js";
import "../../styles/main.css";

const AddToCart = ({ menu }) => {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.token);
	const [isLoading, setIsLoading] = useState(false);
	const [notification, setNotification] = useState(null);
	const timerRef = useRef(null);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const showNotification = (message, type = "info") => {
		if (timerRef.current) clearTimeout(timerRef.current);
		setNotification({ message, type });
		timerRef.current = setTimeout(() => setNotification(null), 3000);
	};

	const handleAddCart = async () => {
		if (!token) {
			showNotification("Silakan login terlebih dahulu", "warning");
			return;
		}

		if (!menu._id) {
			showNotification("ID produk tidak valid", "error");
			return;
		}

		const cartData = { product: menu._id, qty: 1 };

		try {
			setIsLoading(true);
			await axiosInstance.post("/api/carts", cartData, {
				headers: { Authorization: `Bearer ${token}` },
			});

			// Produk sudah masuk server. Kegagalan fetch di sini hanya berarti
			// tampilan keranjang belum tersinkron, bukan produk gagal ditambahkan.
			showNotification("Produk ditambahkan ke keranjang", "success");
			try {
				await dispatch(fetchCart(token)).unwrap();
			} catch {
				showNotification(
					"Produk ditambahkan, namun keranjang gagal diperbarui. Muat ulang halaman.",
					"warning",
				);
			}
		} catch (error) {
			showNotification(
				error.response?.data?.message ||
					"Gagal menambahkan produk ke keranjang",
				"error",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<button
				type="button"
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
				<span>
					{isLoading ? "Menambahkan..." : "Tambah ke keranjang"}
				</span>
			</button>

			{notification &&
				createPortal(
					<div
						className={`app-notification message-${notification.type}`}
						role="alert"
						aria-live="assertive"
					>
						{notification.message}
					</div>,
					document.body,
				)}
		</>
	);
};

export default AddToCart;
