import React, { useEffect, useState, useCallback, memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddToCart from "./AddToCart.jsx";
import SkeletonList from "../skeleton/SkeletonList";
import { useQueryProducts } from "../../hooks";
import { CATEGORY_NAME_MAP } from "../../constants";
import { formatPrice } from "../../utils";
import OptimizedImage from "../common/OptimizedImage";

const apiBase = import.meta.env.VITE_API_URL || "";

// Bangun URL gambar yang robust terhadap berbagai kemungkinan nilai image_url
const buildImageUrl = (imageUrl) => {
	if (!imageUrl) return "";
	const val = String(imageUrl).trim();

	// Sudah absolute URL
	if (val.startsWith("http://") || val.startsWith("https://")) return val;

	// Normalisasi leading slash
	const ensureLeadingSlash = (p) => (p.startsWith("/") ? p : `/${p}`);

	// Sudah mengandung path images backend
	if (val.startsWith("/images/") || val.startsWith("images/")) {
		return `${apiBase}${ensureLeadingSlash(val)}`;
	}

	// Data lama: '/uploads/products/...'
	if (val.includes("uploads/products/")) {
		const normalized = ensureLeadingSlash(val).replace(
			"/uploads/products/",
			"/images/products/",
		);
		return `${apiBase}${normalized}`;
	}

	// Hanya nama file
	return `${apiBase}/images/products/${val}`;
};

// Memoize MenuItem component to prevent unnecessary re-renders
const MenuItem = memo(({ menu }) => {
	const imageSrc = buildImageUrl(menu.image_url);

	return (
		<article
			className="menu-item"
			aria-label={`${menu.name}, harga Rp.${formatPrice(menu.price)}`}
		>
			<OptimizedImage
				src={imageSrc}
				alt={menu.name}
				width={320}
				height={200}
				className="menu-item-image"
			/>

			<div className="menu-item-content">
				<h2>{menu.name}</h2>
				<p className="menu-description">{menu.description}</p>
				<div className="menu-item-footer">
					<p className="menu-price">Rp.{formatPrice(menu.price)}</p>
					<AddToCart menu={menu} />
				</div>
			</div>
		</article>
	);
});

function MenuItems({ searchKeyword = "", selectedCategory = null }) {
	const [currentPage, setCurrentPage] = useState(1);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	// Tag aktif bersumber dari URL (?tag=id1,id2) agar tombol Tags dan kartu
	// produk membaca sumber state yang sama.
	const tagIds = (searchParams.get("tag") || "").split(",").filter(Boolean);
	const tagKey = tagIds.join(",");

	const { data, isLoading, isError, error, refetch, prefetchNextPage } =
		useQueryProducts({
			page: currentPage,
			tags: tagIds.map((id) => ({ _id: id })),
			search: searchKeyword,
			category: selectedCategory,
		});

	const menus = data?.data;
	const totalPages = data?.totalPages;
	const isPendingData = isLoading || (!data && !isError);

	// Kembali ke halaman 1 hanya saat FILTER berubah, bukan saat loading/kosong.
	useEffect(() => {
		setCurrentPage(1);
	}, [searchKeyword, selectedCategory?._id, tagKey]);

	// Validasi batas halaman hanya setelah respons query terkait tersedia,
	// sehingga pilih halaman 2 yang belum ter-prefetch tidak langsung ter-reset.
	useEffect(() => {
		if (data && totalPages && currentPage > totalPages) {
			setCurrentPage(totalPages);
		}
	}, [data, totalPages, currentPage]);

	const handlePageChange = useCallback((page) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	useEffect(() => {
		if (data && currentPage < totalPages) {
			prefetchNextPage?.();
		}
	}, [data, currentPage, totalPages, prefetchNextPage]);

	const handleResetFilters = useCallback(() => {
		navigate("/");
	}, [navigate]);

	const categoryLabel = selectedCategory
		? CATEGORY_NAME_MAP[selectedCategory.name] || selectedCategory.name
		: "";
	const hasActiveFilter = Boolean(
		searchKeyword || selectedCategory || tagIds.length > 0,
	);

	return (
		<section className="menu" aria-labelledby="menu-heading">
			<h2 className="menu-title" id="menu-heading">
				Menu Kami
			</h2>

			{hasActiveFilter && (
				<div
					className="menu-filter-summary"
					role="status"
					aria-live="polite"
				>
					<span>Filter aktif:</span>
					{searchKeyword && (
						<span className="filter-chip">
							Pencarian: &ldquo;{searchKeyword}&rdquo;
						</span>
					)}
					{selectedCategory && (
						<span className="filter-chip">
							Kategori: {categoryLabel}
						</span>
					)}
					{tagIds.length > 0 && (
						<span className="filter-chip">
							{tagIds.length} tag dipilih
						</span>
					)}
					<button
						type="button"
						className="btn btn-outline btn-sm"
						onClick={handleResetFilters}
					>
						Reset filter
					</button>
				</div>
			)}

			<div className="menu-grid">
				{isError ? (
					<div
						className="menu-state"
						role="alert"
						aria-live="assertive"
					>
						<p className="error-message">
							Gagal memuat produk:{" "}
							{error?.message || "Silakan coba lagi."}
						</p>
						<button
							type="button"
							className="btn btn-primary"
							onClick={() => refetch()}
						>
							Coba lagi
						</button>
					</div>
				) : isPendingData ? (
					<div aria-hidden="true" aria-busy="true">
						<SkeletonList count={6} />
					</div>
				) : menus && menus.length > 0 ? (
					menus.map((menu) => <MenuItem key={menu._id} menu={menu} />)
				) : (
					<div className="no-results" role="status">
						<p>Menu tidak ditemukan</p>
						<p>Coba ubah kata kunci pencarian atau filter.</p>
						<button
							type="button"
							className="btn btn-outline"
							onClick={handleResetFilters}
						>
							Reset filter
						</button>
					</div>
				)}
			</div>

			{!isError && totalPages > 1 && (
				<nav
					className="pagination"
					role="navigation"
					aria-label="Navigasi halaman"
				>
					<button
						type="button"
						className="pagination-nav-button"
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage <= 1}
						aria-label="Halaman sebelumnya"
					>
						Sebelumnya
					</button>
					<span className="pagination-info" aria-live="polite">
						Halaman {currentPage} dari {totalPages}
					</span>
					<button
						type="button"
						className="pagination-nav-button"
						onClick={() => handlePageChange(currentPage + 1)}
						onMouseEnter={() => prefetchNextPage?.()}
						disabled={currentPage >= totalPages}
						aria-label="Halaman berikutnya"
					>
						Berikutnya
					</button>
				</nav>
			)}
		</section>
	);
}

export default memo(MenuItems);
