import axiosInstance from "../api/axiosInstance";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../styles/profile.css";

export default function Profile() {
	const { isLoggedIn, token, user } = useSelector((state) => state.auth);
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchUserData = useCallback(async () => {
		if (!token) return;
		setLoading(true);
		setError(null);
		try {
			const response = await axiosInstance.get("/auth/me", {
				headers: { Authorization: `Bearer ${token}` },
			});
			// Kontrak server: data user ada di response.data.data
			setUserData(response.data?.data || null);
		} catch (err) {
			setError(
				err.response?.data?.message || "Gagal memuat data profil.",
			);
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		// Tampilkan data Redux lebih dulu (cepat), lalu selaraskan dengan /auth/me
		// sebagai sumber kanonik. Bila /auth/me gagal, data Redux tetap dipakai.
		if (user) {
			setUserData(user);
		}
		if (isLoggedIn) {
			fetchUserData();
		}
	}, [user, isLoggedIn, fetchUserData]);

	if (!isLoggedIn) {
		return (
			<div className="profile-container">
				<p>Silakan login untuk melihat profil Anda.</p>
			</div>
		);
	}

	if (loading && !userData) {
		return (
			<div className="profile-container">
				<p className="profile-loading">Memuat profil...</p>
			</div>
		);
	}

	if (error && !userData) {
		return (
			<div className="profile-container">
				<p className="error" role="alert">
					{error}
				</p>
				<button
					type="button"
					className="btn btn-primary"
					onClick={fetchUserData}
				>
					Coba lagi
				</button>
			</div>
		);
	}

	// Profil bersifat read-only: tidak ada endpoint update profil di server.
	const identifier = userData?.customer_id ?? userData?._id ?? "-";

	return (
		<div className="profile-container">
			<h1>Profil</h1>
			<dl className="profile-fields">
				<div className="profile-field">
					<dt>Nama lengkap</dt>
					<dd>{userData?.full_name || "-"}</dd>
				</div>
				<div className="profile-field">
					<dt>Email</dt>
					<dd>{userData?.email || "-"}</dd>
				</div>
				<div className="profile-field">
					<dt>ID Pelanggan</dt>
					<dd>{identifier}</dd>
				</div>
			</dl>
		</div>
	);
}
