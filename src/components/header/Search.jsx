import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/search.css";

const Search = ({ id = "search-input" }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const timerRef = useRef(null);

	// URL adalah sumber nilai pencarian, sehingga reset filter, Back, dan
	// Forward otomatis menyinkronkan input (desktop & mobile).
	const urlValue = new URLSearchParams(location.search).get("search") || "";
	const [value, setValue] = useState(urlValue);

	useEffect(() => {
		setValue(urlValue);
	}, [urlValue]);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const commit = (nextValue) => {
		const params = new URLSearchParams(location.search);
		if (nextValue) {
			params.set("search", nextValue);
		} else {
			params.delete("search");
		}
		const query = params.toString();
		navigate(
			{ pathname: "/", search: query ? `?${query}` : "" },
			{ replace: location.pathname === "/" },
		);
	};

	const handleChange = (event) => {
		const nextValue = event.target.value;
		setValue(nextValue);
		if (timerRef.current) clearTimeout(timerRef.current);
		// Debounce 300ms agar tidak menulis riwayat URL tiap ketikan.
		timerRef.current = setTimeout(() => commit(nextValue), 300);
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			if (timerRef.current) clearTimeout(timerRef.current);
			commit(value);
		}
	};

	return (
		<div className="header-search">
			<label htmlFor={id} className="visually-hidden">
				Cari menu
			</label>
			<span className="search-icon" aria-hidden="true">
				<FaSearch />
			</span>
			<input
				id={id}
				type="search"
				placeholder="Cari menu berdasarkan nama..."
				className="search-input"
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				autoComplete="off"
			/>
		</div>
	);
};

export default Search;
