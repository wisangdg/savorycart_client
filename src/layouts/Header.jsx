import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/header/Logo.jsx";
import Kategori from "../components/header/Kategori.jsx";
import Search from "../components/header/Search.jsx";
import CartList from "../components/header/CartList.jsx";
import AccountIcon from "../components/header/AccountIcon.jsx";
import { FaBars, FaTimes } from "react-icons/fa";
import { useQueryCategories } from "../hooks";
import "../styles/header.css";

const Header = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	// Kategori diambil dari cache/hook yang sama dengan katalog, sehingga
	// navigasi kategori tersedia konsisten dari halaman mana pun tanpa perlu
	// setiap halaman mengoper prop `categories`.
	const { data: categories } = useQueryCategories();

	const categoryOptions =
		Array.isArray(categories) && categories.length > 0
			? categories
			: [{ _id: "all", name: "Semua", originalName: "all" }];

	const currentCategory =
		new URLSearchParams(location.search).get("category") || "all";

	// Kategori & pencarian adalah navigasi berbasis URL ke halaman katalog,
	// sehingga tetap berfungsi dari halaman mana pun (login, akun, pesanan).
	const handleSelect = (option) => {
		const params = new URLSearchParams(location.search);
		const value = option.originalName || option.name;
		if (!value || value === "all") {
			params.delete("category");
		} else {
			params.set("category", value);
		}
		const query = params.toString();
		navigate(query ? `/?${query}` : "/");
		setMobileMenuOpen(false);
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	return (
		<header className="header" role="banner">
			<div className="header-container">
				<Logo />

				<button
					type="button"
					className="mobile-menu-button"
					onClick={toggleMobileMenu}
					aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
					aria-expanded={mobileMenuOpen}
				>
					{mobileMenuOpen ? <FaTimes /> : <FaBars />}
				</button>

				<nav
					className={`header-nav ${mobileMenuOpen ? "mobile-active" : ""}`}
					aria-label="Navigasi utama"
				>
					<Kategori
						options={categoryOptions}
						value={currentCategory}
						onSelect={handleSelect}
					/>
					<div className="mobile-search">
						<Search id="search-input-mobile" />
					</div>
				</nav>

				<div className="desktop-search">
					<Search />
				</div>

				<div
					className="header-actions"
					role="navigation"
					aria-label="Aksi pengguna"
				>
					<CartList />
					<AccountIcon />
				</div>
			</div>
		</header>
	);
};

export default Header;
