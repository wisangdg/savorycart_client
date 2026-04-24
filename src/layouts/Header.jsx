import React, { useState } from "react";
import Logo from "../components/header/Logo.jsx";
import Kategori from "../components/header/Kategori.jsx";
import Search from "../components/header/Search.jsx";
import CartList from "../components/header/CartList.jsx";
import AccountIcon from "../components/header/AccountIcon.jsx";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/header.css";

// Moved to constants file
const categoryNameMap = {
  mainDish: "Utama",
  snacks: "Snacks",
  drinks: "Minuman",
  pastry: "Dessert",
};

const Header = ({ handleSearchChange, categories = [], onSelectCategory }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelect = (option) => {
    onSelectCategory(
      option._id === "all" ? option : { ...option, name: option.originalName }
    );
    setMobileMenuOpen(false);
  };

  const safeCategories = Array.isArray(categories) ? categories : [];
  const categoryOptions = [
    { _id: "all", name: "Semua", originalName: "all" },
    ...safeCategories.map((cat) => ({
      ...cat,
      name: categoryNameMap[cat.name] || cat.name,
      originalName: cat.name,
    })),
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header" role="banner">
      <div className="skip-link">
        <a href="#main-content" className="visually-hidden focusable">
          Skip to main content
        </a>
      </div>

      <div className="header-container">
        <Logo />

        <button
          className="mobile-menu-button d-lg-none"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav
          className={`header-nav ${mobileMenuOpen ? "mobile-active" : ""}`}
          aria-label="Main Navigation"
        >
          <Kategori options={categoryOptions} onSelect={handleSelect} />
          <div className="d-md-none mobile-search">
            <Search handleSearchChange={handleSearchChange} />
          </div>
        </nav>

        <div className="d-none d-lg-block">
          <Search handleSearchChange={handleSearchChange} />
        </div>

        <div
          className="header-actions"
          role="navigation"
          aria-label="User actions"
        >
          <CartList />
          <AccountIcon />
        </div>
      </div>
    </header>
  );
};

export default Header;
