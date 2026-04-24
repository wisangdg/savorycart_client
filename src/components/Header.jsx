import React from "react";
import Logo from "./header/Logo.jsx";
import Kategori from "./header/Kategori.jsx";
import Search from "./header/Search.jsx";
import CartList from "./header/CartList.jsx";
import AccountIcon from "./header/AccountIcon.jsx";
import "../styles/main.css";

const categoryNameMap = {
  mainDish: "Utama",
  snacks: "Snacks",
  drinks: "Minuman",
  pastry: "Dessert",
};

const Header = ({ handleSearchChange, categories = [], onSelectCategory }) => {
  const handleSelect = (option) => {
    onSelectCategory(
      option._id === "all" ? option : { ...option, name: option.originalName }
    );
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

  return (
    <header className="header">
      <Logo />
      <Kategori options={categoryOptions} onSelect={handleSelect} />
      <Search handleSearchChange={handleSearchChange} />
      <CartList />
      <AccountIcon />
    </header>
  );
};

export default Header;
