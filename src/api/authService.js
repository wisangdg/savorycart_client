import axiosInstance from "./axiosInstance";
import { setCredentials, logout } from "../store";

/**
 * Service untuk manajemen autentikasi dan siklus sesi.
 *
 * Menjadi satu-satunya pemilik alur refresh token dan penanganan 401,
 * agar tidak ada refresh ganda dan hasil sesi lama tidak menimpa sesi baru.
 */
class AuthService {
	constructor() {
		this._refreshPromise = null;
		this._sessionId = 0;
	}

	/**
	 * Nomor generasi sesi. Berubah setiap login/logout sehingga hasil request
	 * atau refresh dari sesi lama dapat diabaikan.
	 */
	get sessionId() {
		return this._sessionId;
	}

	/**
	 * Mengganti generasi sesi dan membatalkan refresh yang tertunda.
	 * @returns {number} generasi sesi baru
	 */
	rotateSession() {
		this._sessionId += 1;
		this._refreshPromise = null;
		return this._sessionId;
	}

	/**
	 * Menandai sesi berakhir: bersihkan state auth dan arahkan ke halaman login.
	 * @param {Function} dispatch - Redux dispatch
	 */
	endSession(dispatch) {
		this.rotateSession();
		localStorage.removeItem("token");
		dispatch(logout());
		if (!window.location.pathname.includes("/login")) {
			window.location.href = "/login";
		}
	}

	/**
	 * Login user
	 * @param {Object} credentials - Email dan password
	 * @returns {Promise} - Promise dengan data user dan token
	 */
	async login(credentials) {
		try {
			const response = await axiosInstance.post(
				"/auth/login",
				credentials,
			);
			return response.data;
		} catch (error) {
			throw (
				error.response?.data || { error: 1, message: "Network error" }
			);
		}
	}

	/**
	 * Logout user
	 * @returns {Promise} - Promise dengan status logout
	 */
	async logout() {
		try {
			const response = await axiosInstance.post("/auth/logout");
			return response.data;
		} catch (error) {
			throw (
				error.response?.data || { error: 1, message: "Network error" }
			);
		}
	}

	/**
	 * Register user
	 * @param {Object} userData - Data user untuk registrasi
	 * @returns {Promise} - Promise dengan data user
	 */
	async register(userData) {
		try {
			const response = await axiosInstance.post(
				"/auth/register",
				userData,
			);
			return response.data;
		} catch (error) {
			throw (
				error.response?.data || { error: 1, message: "Network error" }
			);
		}
	}

	/**
	 * Refresh access token. Request concurrent berbagi satu promise yang sama,
	 * dan hasilnya dibatalkan bila generasi sesi sudah berganti.
	 * @returns {Promise<Object>} payload `{ token, user }`
	 */
	async refreshToken() {
		if (this._refreshPromise) return this._refreshPromise;

		const sessionId = this._sessionId;
		this._refreshPromise = (async () => {
			const response = await axiosInstance.post(
				"/auth/refresh-token",
				{},
			);
			const payload = response.data?.data;

			if (!payload?.token) {
				throw new Error("Refresh token tidak valid");
			}
			if (this._sessionId !== sessionId) {
				throw new Error("Sesi sudah berakhir");
			}
			return payload;
		})();

		try {
			return await this._refreshPromise;
		} finally {
			this._refreshPromise = null;
		}
	}

	/**
	 * Setup interceptor untuk auto refresh token.
	 * @param {Function} dispatch - Redux dispatch function
	 */
	setupTokenRefresh(dispatch) {
		// Tandai tiap request dengan generasi sesi SAAT REQUEST DIBUAT.
		// Tanpa ini, respons 401 dari request lama dapat mematikan sesi baru.
		const requestInterceptor = axiosInstance.interceptors.request.use(
			(config) => {
				config.__sessionId = this._sessionId;
				return config;
			},
			(error) => Promise.reject(error),
		);

		const responseInterceptor = axiosInstance.interceptors.response.use(
			(response) => response,
			async (error) => {
				const response = error.response;

				if (response?.status !== 401) {
					return Promise.reject(error);
				}

				const originalRequest = error.config || {};
				// Generasi sesi yang tercatat saat request dibuat (bukan saat respons tiba).
				const requestSessionId = originalRequest.__sessionId;
				// Request tak bertanda (di luar jalur normal) dianggap milik sesi berjalan.
				const belongsToCurrentSession =
					requestSessionId === undefined ||
					requestSessionId === this._sessionId;

				// Respons milik sesi lama: abaikan total, jangan sentuh sesi saat ini.
				if (!belongsToCurrentSession) {
					return Promise.reject(error);
				}

				// Tidak dapat di-refresh: sudah pernah dicoba, atau bukan token kedaluwarsa.
				if (originalRequest._retry || !response.data?.needsRefresh) {
					this.endSession(dispatch);
					return Promise.reject(error);
				}

				originalRequest._retry = true;
				try {
					const payload = await this.refreshToken();

					// Sesi berganti (logout/login lain) selama refresh: jangan pulihkan.
					if (this._sessionId !== requestSessionId) {
						return Promise.reject(error);
					}

					dispatch(
						setCredentials({
							token: payload.token,
							user: payload.user,
						}),
					);
					originalRequest.headers = originalRequest.headers || {};
					originalRequest.headers.Authorization = `Bearer ${payload.token}`;
					return axiosInstance(originalRequest);
				} catch (refreshError) {
					// Hanya akhiri sesi bila request masih milik sesi berjalan.
					if (requestSessionId === this._sessionId) {
						this.endSession(dispatch);
					}
					return Promise.reject(refreshError);
				}
			},
		);

		return () => {
			axiosInstance.interceptors.request.eject(requestInterceptor);
			axiosInstance.interceptors.response.eject(responseInterceptor);
		};
	}
}

export default new AuthService();
