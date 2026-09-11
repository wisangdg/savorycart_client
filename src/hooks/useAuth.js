import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout, setLogoutNotice } from "../store";
import axiosInstance from "../api/axiosInstance";
import authService from "../api/authService";
import { API_ENDPOINTS } from "../constants";
import { handleApiError } from "../utils/errorHandlers";

/**
 * Custom hook for authentication
 * @returns {Object} Object containing auth state and methods
 */
const useAuth = () => {
	const dispatch = useDispatch();
	const { token, user } = useSelector((state) => state.auth);

	/**
	 * Check if user is authenticated
	 * @returns {boolean} True if user is authenticated
	 */
	const isAuthenticated = !!token;

	/**
	 * Login user
	 * @param {string} email - User email
	 * @param {string} password - User password
	 * @returns {Promise} Promise that resolves to login result
	 */
	const login = useCallback(
		async (email, password) => {
			try {
				const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
					email,
					password,
				});

				// Server membungkus hasil dalam { error, message, data: { user, token } }
				const payload = response.data?.data;
				if (!payload?.token) {
					return {
						success: false,
						message: response.data?.message || "Login gagal",
					};
				}

				// Sesi baru: batalkan refresh/pemeriksaan dari sesi sebelumnya
				authService.rotateSession();
				dispatch(
					setCredentials({
						token: payload.token,
						user: payload.user,
					}),
				);

				return { success: true };
			} catch (error) {
				return {
					success: false,
					message: handleApiError(error),
				};
			}
		},
		[dispatch],
	);

	/**
	 * Register user
	 * @param {Object} userData - User registration data
	 * @returns {Promise} Promise that resolves to registration result
	 */
	const register = useCallback(async (userData) => {
		try {
			const response = await axiosInstance.post(
				API_ENDPOINTS.REGISTER,
				userData,
			);

			return {
				success: true,
				data: response.data,
			};
		} catch (error) {
			return {
				success: false,
				message: handleApiError(error),
			};
		}
	}, []);

	/**
	 * Check login status
	 * @returns {Promise} Promise that resolves to check result
	 */
	const checkLoginStatus = useCallback(async () => {
		const sessionId = authService.sessionId;
		try {
			const currentToken = localStorage.getItem("token");
			if (!currentToken) {
				dispatch(logout());
				return { success: false };
			}

			const response = await axiosInstance.get(API_ENDPOINTS.ME, {
				headers: {
					Authorization: `Bearer ${currentToken}`,
				},
			});

			// Abaikan respons dari sesi yang sudah berganti (logout/login lain)
			if (sessionId !== authService.sessionId) {
				return { success: false };
			}

			const payload = response.data?.data;
			if (payload?._id) {
				dispatch(
					setCredentials({
						// Ambil token terbaru: bisa saja baru di-refresh saat request ini
						token: localStorage.getItem("token"),
						user: payload,
					}),
				);
				return { success: true };
			}

			dispatch(logout());
			return { success: false };
		} catch (error) {
			// Hanya 401/403 (sesi tidak valid) yang boleh memicu logout.
			// Error jaringan/5xx tidak boleh mengeluarkan pengguna.
			const status = error.response?.status;
			const isSessionError = status === 401 || status === 403;
			if (isSessionError && sessionId === authService.sessionId) {
				dispatch(logout());
			}
			return {
				success: false,
				message: handleApiError(error),
				networkError: !error.response,
			};
		}
	}, [dispatch]);

	/**
	 * Logout user
	 * @returns {Promise<{serverRevoked: boolean}>} hasil pencabutan sesi di server
	 */
	const logoutUser = useCallback(async () => {
		// Batalkan refresh/pemeriksaan sesi yang sedang berjalan
		authService.rotateSession();

		let serverRevoked = false;
		try {
			// Cabut sesi di server (blacklist access token + revoke refresh token)
			const result = await authService.logout();
			serverRevoked = result?.error === 0;
		} catch (error) {
			// Gagal mencabut di server tidak menghalangi pembersihan state lokal.
			serverRevoked = false;
		}

		// Selalu bersihkan sesi lokal, lalu titipkan hasilnya ke notifikasi global
		// agar tidak hilang saat halaman terproteksi digantikan halaman Login.
		dispatch(logout());
		dispatch(
			setLogoutNotice(
				serverRevoked
					? "Anda telah keluar dari akun."
					: "Sesi lokal berakhir, tetapi pencabutan sesi di server belum terkonfirmasi.",
			),
		);
		return { serverRevoked };
	}, [dispatch]);

	return {
		isAuthenticated,
		user,
		token,
		login,
		register,
		logout: logoutUser,
		checkLoginStatus,
	};
};

export default useAuth;
