import React from "react";
import { FaSearch } from "react-icons/fa";
import "../../styles/search.css";

const Search = ({ handleSearchChange }) => {
  return (
    <div className="header-search">
      <label htmlFor="search-input" className="visually-hidden">
        Search for menu items
      </label>
      <span className="search-icon">
        <FaSearch />
      </span>
      <input
        id="search-input"
        type="search"
        placeholder="Cari menu berdasarkan nama..."
        className="search-input"
        onChange={handleSearchChange}
        aria-label="Search for menu items by name"
        autoComplete="off"
      />
    </div>
  );
};

export default Search;

