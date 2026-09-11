import {
	configureStore,
	createSlice,
	createAsyncThunk,
} from "@reduxjs/toolkit";
import axiosInstance from "./api/axiosInstance.js";
import authService from "./api/authService.js";
import { selectedAddressKey } from "./utils/selectedAddress.js";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: localStorage.getItem("token"),
		isLoggedIn: !!localStorage.getItem("token"),
		user: null,
		// Pesan global yang bertahan setelah halaman terproteksi berganti ke Login.
		logoutNotice: null,
	},
	reducers: {
		setCredentials: (state, action) => {
			state.token = action.payload.token;
			state.user = action.payload.user;
			state.isLoggedIn = true;
			state.logoutNotice = null;
			localStorage.setItem("token", action.payload.token);
		},
		// Notifikasi logout dirender di shell (Header/CartList) agar tidak hilang
		// saat halaman terproteksi digantikan halaman Login.
		setLogoutNotice: (state, action) => {
			state.logoutNotice = action.payload;
		},
		clearLogoutNotice: (state) => {
			state.logoutNotice = null;
		},
		logout: (state) => {
			// Bersihkan alamat terpilih milik user yang sedang aktif.
			if (state.user?._id) {
				localStorage.removeItem(selectedAddressKey(state.user._id));
			}
			localStorage.removeItem("selectedAddress");
			state.token = null;
			state.user = null;
			state.isLoggedIn = false;
			localStorage.removeItem("token");
		},
	},
});

const tagSlice = createSlice({
	name: "tags",
	initialState: {
		activeTags: [],
	},
	reducers: {
		addTag: (state, action) => {
			const newTag = { ...action.payload, className: "activeTags" };
			if (state.activeTags.find((tag) => tag._id === newTag._id)) {
				state.activeTags = state.activeTags.filter(
					(tag) => tag._id !== newTag._id,
				);
			} else {
				state.activeTags.push(newTag);
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(authSlice.actions.logout, (state) => {
			state.activeTags = [];
		});
	},
});

const cartSlice = createSlice({
	name: "cart",
	initialState: {
		items: [],
	},
	reducers: {
		setCart: (state, action) => {
			state.items = action.payload;
		},
	},
	extraReducers: (builder) => {
		// Logout harus mengosongkan keranjang agar tidak terbawa ke akun lain.
		builder.addCase(authSlice.actions.logout, (state) => {
			state.items = [];
		});
	},
});

export const { setCredentials, logout, setLogoutNotice, clearLogoutNotice } =
	authSlice.actions;
export const { addTag } = tagSlice.actions;
export const { setCart } = cartSlice.actions;

export const fetchCart = createAsyncThunk(
	"cart/fetchCart",
	async (token, { dispatch, rejectWithValue }) => {
		// Snapshot generasi sesi saat request DIBUAT. Respons dari sesi lama
		// (mis. 401 akun sebelumnya yang terlambat) tidak boleh mengubah state
		// akun yang sedang aktif.
		const sessionId = authService.sessionId;
		const isCurrentSession = () => sessionId === authService.sessionId;

		try {
			const response = await axiosInstance.get("/api/carts", {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!isCurrentSession()) return null;

			// Periksa apakah ada error dalam respons data
			if (response.data && response.data.error) {
				// Jika ada error JWT, coba logout pengguna
				if (
					response.data.message === "jwt malformed" ||
					response.data.message === "invalid signature"
				) {
					dispatch(logout()); // Panggil action logout
				}
				return rejectWithValue(response.data); // Kembalikan error
			}

			// Pastikan data adalah array sebelum dispatch
			if (Array.isArray(response.data)) {
				dispatch(setCart(response.data));
				return response.data;
			}

			// Struktur tak terduga: jangan tampilkan data lama milik sesi lain.
			dispatch(setCart([]));
			return [];
		} catch (error) {
			if (!isCurrentSession()) return null;

			// Hanya 401 yang mengakhiri sesi; error lain tidak mengeluarkan user.
			if (error.response && error.response.status === 401) {
				dispatch(logout());
			}
			return rejectWithValue(
				error.response ? error.response.data : error.message,
			);
		}
	},
);

export const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		tags: tagSlice.reducer,
		cart: cartSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				// Ignore these action types
				ignoredActions: ["auth/setCredentials", "auth/logout"],
			},
		}),
});

// Setup token refresh interceptor
if (authService && typeof authService.setupTokenRefresh === "function") {
	authService.setupTokenRefresh(store.dispatch);
}
