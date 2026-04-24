import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axiosInstance from "./api/axiosInstance.js";
import authService from "./api/authService.js";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    isLoggedIn: !!localStorage.getItem("token"),
    user: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
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
          (tag) => tag._id !== newTag._id
        );
      } else {
        state.activeTags.push(newTag);
      }
    },
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
});

export const { setCredentials, logout } = authSlice.actions;
export const { addTag } = tagSlice.actions;
export const { setCart } = cartSlice.actions;

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (token, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/carts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Periksa apakah ada error dalam respons data
      if (response.data && response.data.error) {
        console.error("API Error fetching cart:", response.data);
        // Jika ada error JWT, coba logout pengguna
        if (
          response.data.message === "jwt malformed" ||
          response.data.message === "invalid signature"
        ) {
          dispatch(logout()); // Panggil action logout
        }
        return rejectWithValue(response.data); // Kembalikan error
      }

      console.log("API Response for /api/carts:", response.data);
      // Pastikan data adalah array sebelum dispatch
      if (Array.isArray(response.data)) {
        dispatch(setCart(response.data));
        return response.data;
      } else {
        // Jika data bukan array (misalnya object kosong atau struktur tak terduga dari API)
        console.warn(
          "Received non-array data for cart, setting to empty array:",
          response.data
        );
        dispatch(setCart([])); // Set keranjang jadi array kosong
        return [];
      }
    } catch (error) {
      console.error("Network error fetching cart:", error);
      // Jika error karena masalah otentikasi (misal status 401), coba logout
      if (error.response && error.response.status === 401) {
        dispatch(logout());
      }
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
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
if (authService && typeof authService.setupTokenRefresh === 'function') {
  authService.setupTokenRefresh(store.dispatch);
}
