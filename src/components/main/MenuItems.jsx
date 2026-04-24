import React, { useEffect, useState, useCallback, memo } from "react";
import AddToCart from "./AddToCart.jsx";
import { useSelector } from "react-redux";
import SkeletonList from "../skeleton/SkeletonList";
import { useQueryProducts } from "../../hooks";
import { formatPrice } from "../../utils";
import OptimizedImage from "../common/OptimizedImage";

// Memoize MenuItem component to prevent unnecessary re-renders
const MenuItem = memo(({ menu }) => {
  // Handle keyboard interaction
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const addToCartButton = e.currentTarget.querySelector(".btn-cart");
      if (addToCartButton) {
        addToCartButton.focus();
      }
    }
  };

  // Bangun URL gambar yang robust terhadap berbagai kemungkinan nilai image_url
  const apiBase = import.meta.env.VITE_API_URL || "";
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
        "/images/products/"
      );
      return `${apiBase}${normalized}`;
    }

    // Hanya nama file
    return `${apiBase}/images/products/${val}`;
  };

  const imageSrc = buildImageUrl(menu.image_url);

  return (
    <div
      key={menu._id}
      className="menu-card"
      tabIndex={0}
      role="article"
      aria-label={`${menu.name}, harga Rp.${formatPrice(menu.price)}`}
      onKeyDown={handleKeyDown}
    >
      <OptimizedImage
        src={imageSrc}
        alt={menu.name}
        width={320}
        height={200}
        className="menu-card-image"
      />

      <div className="menu-card-content">
        <h3 className="menu-card-title">{menu.name}</h3>
        <p className="menu-card-description">{menu.description}</p>
        <div className="menu-card-footer">
          <span className="menu-card-price">Rp.{formatPrice(menu.price)}</span>
          <AddToCart menu={menu} />
        </div>
      </div>
    </div>
  );
});

function MenuItems({ handleAddCart, searchKeyword, selectedCategory }) {
  const [currentPage, setCurrentPage] = useState(1);
  const activeTags = useSelector((state) => state.tags.activeTags);

  const { data, isLoading, isError, error, refetch, prefetchNextPage } =
    useQueryProducts({
      page: currentPage,
      tags: activeTags,
      search: searchKeyword,
      category: selectedCategory,
    });

  const menus = data?.data || [];
  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    if (currentPage > totalPages && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (currentPage < totalPages) {
      prefetchNextPage?.();
    }
  }, [currentPage, totalPages, prefetchNextPage]);

  if (isError) {
    return (
      <section className="menu" aria-labelledby="menu-heading">
        <h2 className="menu-title" id="menu-heading">
          Our Menu
        </h2>
        <p className="error-message" role="alert" aria-live="assertive">
          Failed to load products: {error?.message || "Please try again later."}
        </p>
      </section>
    );
  }

  return (
    <section className="menu" aria-labelledby="menu-heading">
      <h2 className="menu-title" id="menu-heading">
        Our Menu's
      </h2>
      <div className="menu-grid">
        {isLoading ? (
          <div aria-hidden="true">
            <SkeletonList count={6} />
          </div>
        ) : menus && menus.length > 0 ? (
          menus.map((menu) => <MenuItem key={menu._id} menu={menu} />)
        ) : (
          <div className="no-results" role="status">
            <p>No menus found</p>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <nav className="pagination" role="navigation" aria-label="Pagination">
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
