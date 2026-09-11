import axiosInstance from "../api/axiosInstance";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "../layouts/MainLayout";
import "../styles/invoices.css";

const formatRupiah = (value) =>
	`Rp. ${Number(value || 0).toLocaleString("id-ID")}`;

const STATUS_LABELS = {
	"waiting payment": "Menunggu pembayaran",
	processing: "Diproses",
	in_delivery: "Dikirim",
	delivered: "Selesai",
};

const PAYMENT_LABELS = {
	waiting_payment: "Menunggu pembayaran",
	paid: "Lunas",
};

const Invoices = () => {
	const { orderId } = useParams();
	const [invoice, setInvoice] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const token = useSelector((state) => state.auth.token);
	const navigate = useNavigate();

	const fetchInvoice = useCallback(async () => {
		if (!orderId) return;
		setLoading(true);
		// Reset error tiap request agar pesan lama tidak tertinggal.
		setError(null);
		setInvoice(null);
		try {
			const response = await axiosInstance.get(
				`/api/invoices/${orderId}`,
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			setInvoice(response.data);
		} catch (err) {
			const status = err.response?.status;
			let message;
			if (status === 404) {
				message = "Invoice tidak ditemukan untuk pesanan ini.";
			} else if (status === 403) {
				message = "Anda tidak berizin melihat invoice ini.";
			} else if (!err.response) {
				message =
					"Gangguan jaringan. Periksa koneksi Anda lalu coba lagi.";
			} else {
				message =
					err.response?.data?.message ||
					"Gagal mengambil data invoice.";
			}
			setError({ message, status });
		} finally {
			setLoading(false);
		}
	}, [orderId, token]);

	useEffect(() => {
		fetchInvoice();
	}, [fetchInvoice]);

	return (
		<MainLayout>
			<div className="invoice-container">
				<h1>Invoice</h1>

				{loading && <p className="loading">Memuat invoice...</p>}

				{!loading && error && (
					<div className="invoice-error" role="alert">
						<p className="error">{error.message}</p>
						<div className="invoice-actions">
							{error.status !== 404 && (
								<button
									type="button"
									className="btn btn-primary"
									onClick={fetchInvoice}
								>
									Coba lagi
								</button>
							)}
							<button
								type="button"
								className="btn btn-secondary"
								onClick={() => navigate("/orders")}
							>
								Kembali ke pesanan
							</button>
						</div>
					</div>
				)}

				{!loading && !error && invoice && (
					<article className="invoice-document">
						<header className="invoice-meta">
							<div className="invoice-meta-item">
								<span className="invoice-meta-label">
									Nomor pesanan
								</span>
								<span className="invoice-meta-value">
									#{invoice.order?.order_number ?? "-"}
								</span>
							</div>
							<div className="invoice-meta-item">
								<span className="invoice-meta-label">
									Status pesanan
								</span>
								<span className="invoice-meta-value">
									{STATUS_LABELS[invoice.order?.status] ||
										invoice.order?.status ||
										"-"}
								</span>
							</div>
							<div className="invoice-meta-item">
								<span className="invoice-meta-label">
									Pembayaran
								</span>
								<span className="invoice-meta-value">
									{PAYMENT_LABELS[invoice.payment_status] ||
										invoice.payment_status ||
										"-"}
								</span>
							</div>
						</header>

						<section className="invoice-section">
							<h2>Item</h2>
							{invoice.order_items?.length ? (
								<ul className="invoice-items">
									{invoice.order_items.map((item) => (
										<li
											key={item._id}
											className="invoice-item"
										>
											<span className="invoice-item-name">
												{item.name}
											</span>
											<span className="invoice-item-qty">
												{item.qty}x
											</span>
											<span className="invoice-item-price">
												{formatRupiah(item.price)}
											</span>
										</li>
									))}
								</ul>
							) : (
								<p className="invoice-empty">
									Tidak ada item pada invoice ini.
								</p>
							)}
						</section>

						<section className="invoice-section">
							<h2>Alamat pengiriman</h2>
							<p className="invoice-address">
								{invoice.delivery_address?.detail},{" "}
								{invoice.delivery_address?.kelurahan},{" "}
								{invoice.delivery_address?.kecamatan},{" "}
								{invoice.delivery_address?.kabupaten},{" "}
								{invoice.delivery_address?.provinsi}
							</p>
						</section>

						<section className="invoice-summary">
							<div className="invoice-summary-row">
								<span>Subtotal</span>
								<span>{formatRupiah(invoice.sub_total)}</span>
							</div>
							<div className="invoice-summary-row">
								<span>Ongkos kirim</span>
								<span>
									{formatRupiah(invoice.delivery_fee)}
								</span>
							</div>
							<div className="invoice-summary-row invoice-summary-total">
								<span>Total</span>
								<span>{formatRupiah(invoice.total)}</span>
							</div>
						</section>
					</article>
				)}

				<div className="invoice-actions invoice-actions-bottom">
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => navigate("/orders")}
					>
						Kembali ke pesanan
					</button>
					<button
						type="button"
						className="back-home-button"
						onClick={() => navigate("/")}
					>
						Kembali ke Beranda
					</button>
				</div>
			</div>
		</MainLayout>
	);
};

export default Invoices;
