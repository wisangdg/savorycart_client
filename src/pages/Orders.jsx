import axiosInstance from "../api/axiosInstance";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getSelectedAddress } from "../utils/selectedAddress";
import "../styles/orders.css";

const PAGE_SIZE = 10;

const formatRupiah = (value) =>
	value === null || value === undefined
		? "N/A"
		: Number(value).toLocaleString("id-ID", {
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			});

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasMore, setHasMore] = useState(false);
	const [error, setError] = useState(null);
	const [navigatingId, setNavigatingId] = useState(null);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const token = useSelector((state) => state.auth.token);
	const user = useSelector((state) => state.auth.user);
	const location = useLocation();
	const navigate = useNavigate();

	const fetchOrders = useCallback(
		async ({ skip = 0, append = false } = {}) => {
			if (append) {
				setLoadingMore(true);
			} else {
				setLoading(true);
			}
			setError(null);
			try {
				const response = await axiosInstance.get("/api/orders", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
					params: {
						skip,
						limit: PAGE_SIZE,
					},
				});
				const rows = Array.isArray(response.data?.data)
					? [...response.data.data].reverse()
					: [];
				setOrders((prev) => (append ? [...prev, ...rows] : rows));

				const total = response.data?.total ?? response.data?.count;
				setHasMore(
					typeof total === "number"
						? skip + rows.length < total
						: rows.length === PAGE_SIZE,
				);
			} catch (err) {
				setError(
					err.response?.data?.message ||
						err.message ||
						"Gagal memuat pesanan.",
				);
			} finally {
				setLoading(false);
				setLoadingMore(false);
			}
		},
		[token],
	);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	useEffect(() => {
		if (location.state?.orderCreated) {
			fetchOrders();
		}
	}, [location.state, fetchOrders]);

	useEffect(() => {
		setSelectedAddress(getSelectedAddress(user?._id));
	}, [user]);

	const handleLoadMore = () => {
		fetchOrders({ skip: orders.length, append: true });
	};

	// Invoice sudah dibuat server saat checkout, jadi cukup navigasi.
	const handleViewInvoice = (orderId) => {
		setNavigatingId(orderId);
		navigate(`/invoices/${orderId}`);
	};

	if (loading) {
		return (
			<MainLayout>
				<p className="loading">Memuat pesanan...</p>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<div className="orders-container">
				<h1>Pesanan</h1>

				{error && orders.length === 0 && (
					<div className="orders-error" role="alert">
						<p className="error">Terjadi kesalahan: {error}</p>
						<button
							type="button"
							className="btn btn-primary"
							onClick={() => fetchOrders()}
						>
							Coba lagi
						</button>
					</div>
				)}

				{error && orders.length > 0 && (
					<p className="error" role="alert">
						{error}
					</p>
				)}

				{selectedAddress && (
					<div className="selected-address-container">
						<h3>Alamat Pengiriman:</h3>
						<p>
							{selectedAddress.addressName},{" "}
							{selectedAddress.kelurahan},
							{selectedAddress.kecamatan},{" "}
							{selectedAddress.kabupatenkota},
							{selectedAddress.provinsi}, {selectedAddress.detail}
						</p>
					</div>
				)}

				{orders.length > 0 ? (
					<>
						<ul className="orders-list">
							{orders.map((order) => (
								<li key={order._id} className="orders-item">
									<h3>Pesanan #{order.order_number}</h3>
									<p>ID pesanan: {order._id}</p>
									<p>
										Status:{" "}
										<span
											className={`status-${order.status}`}
										>
											{order.status}
										</span>
									</p>
									<p>
										Subtotal: Rp.{" "}
										{formatRupiah(order.sub_total)}
									</p>
									<p>
										Ongkos kirim:{" "}
										{order.delivery_fee === null ||
										order.delivery_fee === undefined
											? "N/A"
											: Number(order.delivery_fee) === 0
												? "Gratis"
												: `Rp. ${formatRupiah(order.delivery_fee)}`}
									</p>
									<p>
										Total: Rp. {formatRupiah(order.total)}
									</p>
									<p>Jumlah item: {order.items_count}</p>
									<div className="orders-items">
										<h4>Item:</h4>
										<ul>
											{order.order_items?.map((item) => (
												<li key={item._id}>
													{item.name} - {item.qty}x @
													Rp.{" "}
													{formatRupiah(item.price)}
												</li>
											))}
										</ul>
									</div>
									{order.delivery_address && (
										<div className="delivery-address">
											<h4>Alamat pengiriman:</h4>
											<p>
												{order.delivery_address.detail},{" "}
												{
													order.delivery_address
														.kelurahan
												}
												,
												{
													order.delivery_address
														.kecamatan
												}
												,{" "}
												{
													order.delivery_address
														.kabupaten
												}
												,
												{
													order.delivery_address
														.provinsi
												}
											</p>
										</div>
									)}
									<button
										type="button"
										onClick={() =>
											handleViewInvoice(order._id)
										}
										className="confirm-order-button"
										disabled={navigatingId === order._id}
									>
										Lihat invoice
									</button>
								</li>
							))}
						</ul>

						{hasMore && (
							<div className="orders-load-more">
								<button
									type="button"
									className="btn btn-outline"
									onClick={handleLoadMore}
									disabled={loadingMore}
								>
									{loadingMore ? "Memuat..." : "Muat lainnya"}
								</button>
							</div>
						)}
					</>
				) : (
					!error && (
						<div className="empty-orders">
							<p className="no-orders">Belum ada pesanan.</p>
							<button
								type="button"
								className="shop-now"
								onClick={() => navigate("/")}
							>
								Jelajahi menu
							</button>
						</div>
					)
				)}
			</div>
		</MainLayout>
	);
};

export default Orders;
