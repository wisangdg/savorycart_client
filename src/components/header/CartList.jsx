import axiosInstance from "../../api/axiosInstance.js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaShoppingCart, FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart, clearLogoutNotice } from "../../store.js";
import {
	getSelectedAddressId,
	clearSelectedAddress,
} from "../../utils/selectedAddress";
import "../../styles/carts.css";

const formatAddress = (address) =>
	[
		address.addressName,
		address.detail,
		address.kelurahan,
		address.kecamatan,
		address.kabupatenkota,
		address.provinsi,
	]
		.filter(Boolean)
		.join(", ");

const CartList = () => {
	const { isLoggedIn, token, user } = useSelector((state) => state.auth);
	const logoutNotice = useSelector((state) => state.auth.logoutNotice);
	const cart = useSelector((state) => state.cart.items);
	const dispatch = useDispatch();
	// error: { message, action } — action menentukan tombol aksi yang ditampilkan.
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [isCartVisible, setIsCartVisible] = useState(false);
	const [cartQty, setCartQty] = useState(0);
	const [totalPrice, setTotalPrice] = useState(0);
	const [checkoutStatus, setCheckoutStatus] = useState(null);
	// selectedAddress: objek alamat yang SUDAH divalidasi terhadap daftar server.
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [addressesLoading, setAddressesLoading] = useState(false);
	const [addressError, setAddressError] = useState(null);
	const [isCheckingOut, setIsCheckingOut] = useState(false);
	// Mutasi per item diserialisasi: ref untuk penjagaan sinkron (klik cepat),
	// state untuk menampilkan pending state.
	const [pendingIds, setPendingIds] = useState([]);
	const pendingRef = useRef(new Set());
	const isMutating = pendingIds.length > 0;

	const navigate = useNavigate();
	const cartButtonRef = useRef(null);
	const cartDropdownRef = useRef(null);
	const panelRef = useRef(null);

	const formatPrice = (price) =>
		Number(price || 0).toLocaleString("id-ID", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		});

	const loadCart = useCallback(async () => {
		if (!isLoggedIn || !token) {
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			// unwrap() agar kegagalan fetch benar-benar terdeteksi (bukan sukses palsu).
			await dispatch(fetchCart(token)).unwrap();
			setError(null);
		} catch (err) {
			setError({
				message:
					typeof err === "string"
						? err
						: err?.message || "Gagal memuat keranjang.",
				action: "fetch",
			});
		} finally {
			setLoading(false);
		}
	}, [dispatch, isLoggedIn, token]);

	useEffect(() => {
		loadCart();
	}, [loadCart]);

	useEffect(() => {
		if (!cart) return;
		setCartQty(cart.length);
		const total = Array.isArray(cart)
			? cart.reduce((acc, item) => {
					if (!item.product) return acc;
					return acc + (item.product.price || 0) * (item.qty || 1);
				}, 0)
			: 0;
		setTotalPrice(total);
	}, [cart]);

	// Resolve alamat terpilih terkini dari storage per-user lalu VALIDASI ke
	// daftar alamat akun. Alamat basi (sudah dihapus / milik akun lain) dibuang.
	const resolveSelectedAddress = useCallback(async () => {
		if (!isLoggedIn || !token) {
			setSelectedAddress(null);
			return null;
		}
		const response = await axiosInstance.get("/api/delivery-addresses", {
			headers: { Authorization: `Bearer ${token}` },
		});
		const list = Array.isArray(response.data?.data)
			? response.data.data
			: [];
		const id = getSelectedAddressId(user?._id);
		const found = id ? list.find((item) => item._id === id) || null : null;
		if (id && !found) clearSelectedAddress(user?._id);
		setSelectedAddress(found);
		return found;
	}, [isLoggedIn, token, user]);

	// Selalu segarkan alamat saat dropdown dibuka agar tidak memakai pilihan lama.
	useEffect(() => {
		if (!isCartVisible || !isLoggedIn) return undefined;
		let cancelled = false;
		setAddressesLoading(true);
		setAddressError(null);
		resolveSelectedAddress()
			.catch(() => {
				if (!cancelled) {
					setAddressError(
						"Gagal memuat daftar alamat. Periksa koneksi lalu coba lagi.",
					);
					setSelectedAddress(null);
				}
			})
			.finally(() => {
				if (!cancelled) setAddressesLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [isCartVisible, isLoggedIn, resolveSelectedAddress]);

	const closeCart = useCallback(() => {
		setIsCartVisible(false);
		const panel = panelRef.current;
		const active = document.activeElement;
		// Kembalikan fokus ke tombol keranjang hanya bila fokus ada di dalam panel.
		if (
			cartButtonRef.current &&
			(!panel || panel.contains(active) || active === document.body)
		) {
			cartButtonRef.current.focus();
		}
	}, []);

	// Tutup saat klik di luar.
	useEffect(() => {
		if (!isCartVisible) return undefined;
		const handleClickOutside = (event) => {
			if (
				cartDropdownRef.current &&
				!cartDropdownRef.current.contains(event.target) &&
				cartButtonRef.current &&
				!cartButtonRef.current.contains(event.target)
			) {
				closeCart();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [isCartVisible, closeCart]);

	// Fokus panel saat dibuka, Escape untuk menutup, dan focus trap sederhana (Tab).
	useEffect(() => {
		if (!isCartVisible) return undefined;
		const panel = panelRef.current;
		panel?.focus();

		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				closeCart();
				return;
			}
			if (event.key !== "Tab" || !panelRef.current) return;
			const focusables = panelRef.current.querySelectorAll(
				'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
			);
			if (focusables.length === 0) {
				event.preventDefault();
				panelRef.current.focus();
				return;
			}
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown, true);
		return () =>
			document.removeEventListener("keydown", handleKeyDown, true);
	}, [isCartVisible, closeCart]);

	const toggleCartVisibility = () => {
		setIsCartVisible((visible) => !visible);
	};

	const goToAddress = () => {
		closeCart();
		navigate("/account?view=address");
	};

	const retryAddressCheck = async () => {
		setError(null);
		setAddressError(null);
		setAddressesLoading(true);
		try {
			await resolveSelectedAddress();
		} catch {
			setAddressError(
				"Gagal memuat daftar alamat. Periksa koneksi lalu coba lagi.",
			);
			setSelectedAddress(null);
		} finally {
			setAddressesLoading(false);
		}
	};

	const handleCheckout = async () => {
		setCheckoutStatus(null);
		if (!isLoggedIn || !token) {
			setError({
				message: "Anda harus login untuk checkout.",
				action: "login",
			});
			return;
		}
		if (pendingRef.current.size > 0) {
			setError({
				message: "Tunggu hingga perubahan keranjang selesai.",
				action: null,
			});
			return;
		}

		setError(null);
		setAddressError(null);
		setIsCheckingOut(true);

		// Selalu resolve ulang alamat saat checkout agar alamat basi tidak terkirim.
		let address;
		try {
			address = await resolveSelectedAddress();
		} catch {
			setError({
				message:
					"Gagal memeriksa alamat pengiriman. Periksa koneksi lalu coba lagi.",
				action: "address-fetch",
			});
			setIsCheckingOut(false);
			return;
		}

		if (!address) {
			setError({
				message: "Pilih alamat pengiriman yang valid terlebih dahulu.",
				action: "address",
			});
			setIsCheckingOut(false);
			return;
		}

		try {
			const response = await axiosInstance.post(
				"/api/orders",
				{ delivery_address: address._id }, // Ongkir ditentukan server
				{ headers: { Authorization: `Bearer ${token}` } },
			);

			// Server sudah mengosongkan cart saat order dibuat.
			await loadCart();
			closeCart();
			setCheckoutStatus("Checkout berhasil!");
			navigate("/orders", {
				state: {
					orderCreated: true,
					orderId: response.data?._id,
				},
			});
		} catch (err) {
			setError({
				message:
					err.response?.data?.message ||
					"Checkout gagal. Silakan coba lagi.",
				action: "checkout",
			});
		} finally {
			setIsCheckingOut(false);
		}
	};

	const handleErrorRetry = () => {
		if (!error) return;
		if (error.action === "fetch") {
			loadCart();
		} else if (error.action === "address") {
			goToAddress();
		} else if (error.action === "address-fetch") {
			retryAddressCheck();
		} else if (error.action === "login") {
			closeCart();
			navigate("/login");
		} else {
			handleCheckout();
		}
	};

	const startMutation = (id) => {
		if (pendingRef.current.has(id)) return false;
		pendingRef.current.add(id);
		setPendingIds(Array.from(pendingRef.current));
		return true;
	};

	const endMutation = (id) => {
		pendingRef.current.delete(id);
		setPendingIds(Array.from(pendingRef.current));
	};

	const handleAddItem = async (id) => {
		if (!startMutation(id)) return;
		try {
			// Server PUT memakai qty sebagai jumlah akhir (>= 1), bukan delta.
			const item = cart.find(
				(cartItem) => cartItem.product && cartItem.product._id === id,
			);
			const nextQty = (item?.qty || 0) + 1;
			await axiosInstance.put(
				`/api/carts/${id}`,
				{ qty: nextQty },
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			await loadCart();
		} catch (err) {
			setError({
				message:
					err.response?.data?.message ||
					"Gagal memperbarui keranjang.",
				action: "fetch",
			});
		} finally {
			endMutation(id);
		}
	};

	const handleRemoveItem = async (id) => {
		if (!startMutation(id)) return;
		try {
			const item = cart.find(
				(cartItem) => cartItem.product && cartItem.product._id === id,
			);
			// Server PUT memakai qty sebagai jumlah akhir; hapus item saat tinggal 1.
			if (!item || item.qty <= 1) {
				await axiosInstance.delete(`/api/carts/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
			} else {
				await axiosInstance.put(
					`/api/carts/${id}`,
					{ qty: item.qty - 1 },
					{ headers: { Authorization: `Bearer ${token}` } },
				);
			}
			await loadCart();
		} catch (err) {
			setError({
				message:
					err.response?.data?.message ||
					"Gagal memperbarui keranjang.",
				action: "fetch",
			});
		} finally {
			endMutation(id);
		}
	};

	// Redirect to login page when cart icon is clicked by non-logged in user
	const handleNotLoggedInClick = () => {
		navigate("/login");
	};

	const checkoutDisabled =
		!selectedAddress || isCheckingOut || isMutating || addressesLoading;

	return (
		<>
			{/* Notifikasi logout global: dirender di shell agar bertahan setelah
			    halaman terproteksi digantikan halaman Login. */}
			{logoutNotice && (
				<div className="cart-logout-notice" role="status">
					<span>{logoutNotice}</span>
					<button
						type="button"
						className="cart-logout-notice-close"
						onClick={() => dispatch(clearLogoutNotice())}
						aria-label="Tutup notifikasi"
					>
						<FaTimes aria-hidden="true" />
					</button>
				</div>
			)}

			<div className="cart-wrapper" ref={cartDropdownRef}>
				{isLoggedIn ? (
					<button
						type="button"
						className="header-cart"
						onClick={toggleCartVisibility}
						ref={cartButtonRef}
						aria-label={`Keranjang: ${cartQty} item`}
						aria-expanded={isCartVisible}
						aria-haspopup="dialog"
					>
						<FaShoppingCart aria-hidden="true" />
						{cartQty > 0 && (
							<span className="cart-badge">{cartQty}</span>
						)}
					</button>
				) : (
					<button
						type="button"
						className="header-cart"
						onClick={handleNotLoggedInClick}
						ref={cartButtonRef}
						aria-label="Keranjang (perlu login)"
					>
						<FaShoppingCart aria-hidden="true" />
						<span
							className="cart-badge cart-badge-login"
							title="Perlu login"
						>
							<span className="login-indicator">?</span>
						</span>
					</button>
				)}

				{isLoggedIn && isCartVisible && (
					<div
						className="dropdown-menu cart-dropdown"
						role="dialog"
						aria-modal="true"
						aria-labelledby="cart-heading"
						ref={panelRef}
						tabIndex={-1}
					>
						<div className="cart-header">
							<h2 id="cart-heading" className="cart-title">
								Keranjang Anda
							</h2>
							<button
								type="button"
								onClick={closeCart}
								className="cart-close-button"
								aria-label="Tutup keranjang"
							>
								<FaTimes aria-hidden="true" />
							</button>
						</div>

						{loading ? (
							<p className="cart-empty-message">
								Memuat keranjang...
							</p>
						) : (
							<div className="cart-items-list">
								{cart && cart.length > 0 ? (
									cart.map((cartItem) => {
										const productId = cartItem.product?._id;
										const isPending =
											pendingIds.includes(productId);
										return (
											<div
												key={cartItem._id}
												className={`cart-item ${
													isPending
														? "is-pending"
														: ""
												}`}
											>
												{cartItem.product && (
													<>
														<div className="cart-item-info">
															<span className="cart-item-name">
																{
																	cartItem
																		.product
																		.name
																}
															</span>
															<span className="cart-item-price">
																Rp.
																{formatPrice(
																	cartItem
																		.product
																		.price,
																)}
															</span>
														</div>
														<div className="cart-item-controls">
															<button
																type="button"
																className="cart-item-btn cart-item-decrease"
																onClick={() =>
																	handleRemoveItem(
																		productId,
																	)
																}
																disabled={
																	isPending
																}
																aria-busy={
																	isPending
																}
																aria-label={`Kurangi jumlah ${cartItem.product.name}`}
															>
																<FaMinus
																	size={12}
																	aria-hidden="true"
																/>
															</button>
															<span
																className="cart-item-quantity"
																aria-live="polite"
															>
																{cartItem.qty}
															</span>
															<button
																type="button"
																className="cart-item-btn cart-item-increase"
																onClick={() =>
																	handleAddItem(
																		productId,
																	)
																}
																disabled={
																	isPending
																}
																aria-busy={
																	isPending
																}
																aria-label={`Tambah jumlah ${cartItem.product.name}`}
															>
																<FaPlus
																	size={12}
																	aria-hidden="true"
																/>
															</button>
														</div>
													</>
												)}
											</div>
										);
									})
								) : (
									<div className="cart-empty-state">
										<p className="cart-empty-message">
											Keranjang Anda kosong.
										</p>
										<button
											type="button"
											className="btn btn-secondary"
											onClick={() => {
												closeCart();
												navigate("/");
											}}
										>
											Jelajahi menu
										</button>
									</div>
								)}
							</div>
						)}

						{error && (
							<div className="cart-error" role="alert">
								<p>{error.message}</p>
								<div className="cart-error-actions">
									<button
										type="button"
										className="btn btn-primary"
										onClick={handleErrorRetry}
										disabled={isCheckingOut}
									>
										{error.action === "address"
											? "Pilih alamat"
											: "Coba lagi"}
									</button>
								</div>
							</div>
						)}

						{!loading && cart && cart.length > 0 && (
							<div className="cart-footer">
								<div className="cart-total">
									<span>Subtotal</span>
									<span className="cart-total-price">
										Rp.{formatPrice(totalPrice)}
									</span>
								</div>
								<p className="cart-total-note">
									Belum termasuk ongkir. Ongkir dihitung
									server saat checkout.
								</p>

								<div className="cart-address">
									<div className="cart-address-head">
										<span className="cart-address-label">
											Dikirim ke
										</span>
										<button
											type="button"
											className="cart-address-change"
											onClick={goToAddress}
										>
											Ubah alamat
										</button>
									</div>
									{addressesLoading ? (
										<p className="cart-address-text cart-address-empty">
											Memuat alamat...
										</p>
									) : selectedAddress ? (
										<p className="cart-address-text">
											{formatAddress(selectedAddress)}
										</p>
									) : (
										<p className="cart-address-text cart-address-empty">
											Belum ada alamat terpilih.
										</p>
									)}
								</div>

								{addressError && (
									<div className="cart-warning" role="alert">
										{addressError}
									</div>
								)}

								{isMutating && (
									<div className="cart-warning">
										Menyimpan perubahan keranjang...
									</div>
								)}

								<button
									type="button"
									className="btn btn-primary btn-block"
									onClick={handleCheckout}
									disabled={checkoutDisabled}
									aria-busy={isCheckingOut}
								>
									{isCheckingOut
										? "Memproses..."
										: "Checkout"}
								</button>
								{checkoutStatus && (
									<div className="cart-success">
										{checkoutStatus}
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default CartList;
