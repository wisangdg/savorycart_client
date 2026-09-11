import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useSelector } from "react-redux";
import {
	getSelectedAddressId,
	saveSelectedAddress,
} from "../utils/selectedAddress";
import "../styles/address.css";

const EMPTY_FORM = {
	addressName: "",
	kelurahan: "",
	kecamatan: "",
	kabupatenkota: "",
	provinsi: "",
	detail: "",
};

const FIELD_LABELS = {
	addressName: "Nama alamat",
	kelurahan: "Kelurahan",
	kecamatan: "Kecamatan",
	kabupatenkota: "Kabupaten/Kota",
	provinsi: "Provinsi",
	detail: "Detail alamat",
};

const Address = () => {
	const [addresses, setAddresses] = useState([]);
	// Penanda pilihan konsisten: selalu id (bukan objek), agar highlight tetap ada
	// setelah remount.
	const [selectedAddressId, setSelectedAddressId] = useState(null);
	const [formVisible, setFormVisible] = useState(false);
	const [form, setForm] = useState(EMPTY_FORM);
	const [error, setError] = useState("");
	const [fieldErrors, setFieldErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [loading, setLoading] = useState(false);
	const token = useSelector((state) => state.auth.token);
	const user = useSelector((state) => state.auth.user);

	const fetchAddresses = useCallback(async () => {
		if (!token) return;
		setError("");
		setLoading(true);
		try {
			const response = await axiosInstance.get(
				"/api/delivery-addresses",
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			setAddresses(response.data.data || []);
		} catch (err) {
			setError(
				err.response?.data?.message || "Gagal memuat daftar alamat.",
			);
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		fetchAddresses();
	}, [fetchAddresses]);

	useEffect(() => {
		setSelectedAddressId(getSelectedAddressId(user?._id));
	}, [user]);

	const handleSelectAddress = (address) => {
		if (selectedAddressId === address._id) return;
		setSelectedAddressId(address._id);
		// Simpan snapshot lengkap agar tetap kompatibel dengan halaman pesanan,
		// sementara penanda pilihan memakai id.
		saveSelectedAddress(user?._id, {
			_id: address._id,
			addressName: address.addressName,
			kelurahan: address.kelurahan,
			kecamatan: address.kecamatan,
			kabupatenkota: address.kabupatenkota,
			provinsi: address.provinsi,
			detail: address.detail,
		});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prevForm) => ({ ...prevForm, [name]: value }));
		setFieldErrors((prev) => {
			if (!prev[name]) return prev;
			const next = { ...prev };
			delete next[name];
			return next;
		});
	};

	const validateForm = () => {
		const errors = {};
		Object.keys(EMPTY_FORM).forEach((name) => {
			if (!String(form[name] || "").trim()) {
				errors[name] = `${FIELD_LABELS[name]} wajib diisi.`;
			}
		});
		setFieldErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;
		setError("");
		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			const { data } = await axiosInstance.post(
				"/api/delivery-addresses",
				{
					addressName: form.addressName,
					kelurahan: form.kelurahan,
					kecamatan: form.kecamatan,
					kabupatenkota: form.kabupatenkota,
					provinsi: form.provinsi,
					detail: form.detail,
				},
				{ headers: { Authorization: `Bearer ${token}` } },
			);

			setAddresses((prevAddresses) => [...prevAddresses, data]);

			// Alamat baru langsung dipilih agar tidak perlu klik ulang.
			handleSelectAddress(data);

			setForm(EMPTY_FORM);
			setFieldErrors({});
			setFormVisible(false);
		} catch (err) {
			setError(
				err.response?.data?.message ||
					"Gagal menambahkan alamat. Coba lagi.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderField = (name, placeholder) => {
		const errorId = `address-${name}-error`;
		const hasError = Boolean(fieldErrors[name]);
		return (
			<div className="address-field">
				<label htmlFor={`address-${name}`}>{FIELD_LABELS[name]}</label>
				<input
					id={`address-${name}`}
					type="text"
					name={name}
					value={form[name]}
					onChange={handleChange}
					placeholder={placeholder}
					required
					className={`form-input ${hasError ? "input-error" : ""}`}
					aria-invalid={hasError ? "true" : undefined}
					aria-describedby={hasError ? errorId : undefined}
				/>
				{hasError && (
					<p className="field-error" id={errorId} role="alert">
						{fieldErrors[name]}
					</p>
				)}
			</div>
		);
	};

	return (
		<div className="address-container">
			<div className="address-header">
				<h1>Alamat Pengiriman</h1>
				{!formVisible && (
					<button
						type="button"
						onClick={() => setFormVisible(true)}
						className="add-address-button"
					>
						+ Tambah Alamat
					</button>
				)}
			</div>

			{error && (
				<div className="address-error" role="alert">
					<p className="error">{error}</p>
					<button
						type="button"
						className="btn btn-primary"
						onClick={fetchAddresses}
					>
						Coba lagi
					</button>
				</div>
			)}

			{loading && addresses.length === 0 && !error && (
				<p className="address-loading">Memuat alamat...</p>
			)}

			{addresses.length > 0 ? (
				<ul
					className="address-list"
					role="radiogroup"
					aria-label="Daftar alamat pengiriman"
				>
					{addresses.map((address) => {
						const isSelected = selectedAddressId === address._id;
						return (
							<li key={address._id}>
								<button
									type="button"
									className={`address-item ${
										isSelected ? "selected" : ""
									}`}
									role="radio"
									aria-checked={isSelected}
									onClick={() => handleSelectAddress(address)}
								>
									<span className="address-content">
										<span className="address-text">
											{address.addressName},{" "}
											{address.kelurahan},{" "}
											{address.kecamatan},{" "}
											{address.kabupatenkota},{" "}
											{address.provinsi}, {address.detail}
										</span>
										<span className="address-actions">
											{isSelected ? (
												<span className="selected-badge">
													Alamat Terpilih ✓
												</span>
											) : (
												<span className="select-hint">
													Pilih alamat ini
												</span>
											)}
										</span>
									</span>
								</button>
							</li>
						);
					})}
				</ul>
			) : (
				!loading && (
					<p>Belum ada alamat. Tambahkan alamat pengiriman Anda.</p>
				)
			)}

			{formVisible && (
				<form
					onSubmit={handleSubmit}
					className="address-form"
					noValidate
				>
					<h2 className="address-form-title">Alamat Baru</h2>
					{renderField("addressName", "Nama Alamat")}
					{renderField("kelurahan", "Kelurahan")}
					{renderField("kecamatan", "Kecamatan")}
					{renderField("kabupatenkota", "Kabupaten/Kota")}
					{renderField("provinsi", "Provinsi")}
					{renderField("detail", "Detail jalan, nomor rumah")}
					<div className="address-form-actions">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={() => {
								setFormVisible(false);
								setFieldErrors({});
							}}
							disabled={isSubmitting}
						>
							Batal
						</button>
						<button
							type="submit"
							className="submit-button"
							disabled={isSubmitting}
							aria-busy={isSubmitting}
						>
							{isSubmitting ? "Menyimpan..." : "Simpan Alamat"}
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default Address;
