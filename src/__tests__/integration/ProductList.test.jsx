import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import MenuItems from "../../components/main/MenuItems.jsx";
import { clearCache } from "../../utils/storageCache";

// Mock axios
vi.mock("axios", () => {
	const mockAxios = {
		get: vi.fn(),
		create: vi.fn(() => mockAxios),
		defaults: {},
		interceptors: {
			request: { use: vi.fn(), eject: vi.fn() },
			response: { use: vi.fn(), eject: vi.fn() },
		},
	};
	return { default: mockAxios };
});

// Mock redux store
const createMockStore = (initialState) => {
	return configureStore({
		reducer: {
			tags: (state = initialState.tags, action) => state,
			auth: (state = initialState.auth, action) => state,
			cart: (state = initialState.cart, action) => state,
		},
		preloadedState: initialState,
	});
};

const renderMenuItems = () => {
	const mockStore = createMockStore({
		tags: { activeTags: [] },
		auth: { token: null },
		cart: { items: [] },
	});

	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	return render(
		<BrowserRouter>
			<Provider store={mockStore}>
				<QueryClientProvider client={queryClient}>
					<MenuItems searchKeyword="" selectedCategory={null} />
				</QueryClientProvider>
			</Provider>
		</BrowserRouter>,
	);
};

describe("Product List Integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
		clearCache();
	});

	test("displays products when API call is successful", async () => {
		// Mock successful API response
		const mockProducts = {
			data: [
				{
					_id: "1",
					name: "Product 1",
					description: "Description 1",
					price: 10000,
					image_url: "product1.jpg",
				},
				{
					_id: "2",
					name: "Product 2",
					description: "Description 2",
					price: 20000,
					image_url: "product2.jpg",
				},
			],
			totalPages: 1,
		};

		axios.get.mockResolvedValueOnce({ data: mockProducts });

		renderMenuItems();

		// Wait for products to load
		await waitFor(() => {
			expect(screen.getByText("Product 1")).toBeInTheDocument();
			expect(screen.getByText("Product 2")).toBeInTheDocument();
			expect(screen.getByText("Rp.10.000")).toBeInTheDocument();
			expect(screen.getByText("Rp.20.000")).toBeInTheDocument();
		});
	});

	test("displays error message when API call fails", async () => {
		// Mock failed API response
		axios.get.mockRejectedValueOnce(new Error("Network error"));

		renderMenuItems();

		// Wait for error message to be displayed
		await waitFor(() => {
			expect(
				screen.getByText(/Gagal memuat produk/i),
			).toBeInTheDocument();
		});
	});

	test('displays "Menu tidak ditemukan" when API returns empty array', async () => {
		// Mock empty API response
		const mockProducts = {
			data: [],
			totalPages: 0,
		};

		axios.get.mockResolvedValueOnce({ data: mockProducts });

		renderMenuItems();

		// Wait for "Menu tidak ditemukan" message to be displayed
		await waitFor(() => {
			expect(
				screen.getByText("Menu tidak ditemukan"),
			).toBeInTheDocument();
		});
	});
});
