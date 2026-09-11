import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import "../../styles/kategori.css";

const LISTBOX_ID = "kategori-listbox";

// Nilai pembanding antara opsi kategori dan parameter URL (?category=).
const optionValue = (option) =>
	option.originalName || option.name || option._id;

export default function Kategori({ options = [], value = "all", onSelect }) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);
	const buttonRef = useRef(null);
	const optionRefs = useRef([]);

	// Pilihan dikendalikan oleh URL, bukan state lokal, agar Back/Forward,
	// reset filter, dan navigasi antar halaman tetap konsisten.
	const selectedIndex = Math.max(
		0,
		options.findIndex((option) => optionValue(option) === value),
	);
	const selectedOption = options[selectedIndex];

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (!isOpen) return;
			if (event.key === "Escape") {
				setIsOpen(false);
				buttonRef.current?.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);

	const handleSelect = (option) => {
		onSelect?.(option);
		setIsOpen(false);
		buttonRef.current?.focus();
	};

	const handleButtonKeyDown = (event) => {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			setIsOpen(true);
		}
	};

	const handleOptionKeyDown = (event, option, index) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleSelect(option);
		} else if (event.key === "ArrowDown") {
			event.preventDefault();
			optionRefs.current[
				Math.min(index + 1, options.length - 1)
			]?.focus();
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			optionRefs.current[Math.max(index - 1, 0)]?.focus();
		}
	};

	return (
		<div className="kategori" ref={dropdownRef}>
			<button
				type="button"
				className={`kategori-dropdown ${isOpen ? "active" : ""}`}
				onClick={() => setIsOpen((prev) => !prev)}
				onKeyDown={handleButtonKeyDown}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-controls={LISTBOX_ID}
				aria-label="Pilih kategori menu"
				ref={buttonRef}
			>
				{selectedOption ? selectedOption.name : "Kategori"}
				<span className="kategori-dropdown-icon" aria-hidden="true">
					<FaChevronDown />
				</span>
			</button>
			{isOpen && (
				<ul
					className="dropdown-menu"
					role="listbox"
					aria-label="Daftar kategori"
					id={LISTBOX_ID}
					tabIndex={-1}
				>
					{options.map((option, index) => {
						const isSelected = index === selectedIndex;
						return (
							<li
								key={option._id}
								ref={(el) => {
									optionRefs.current[index] = el;
								}}
								onClick={() => handleSelect(option)}
								onKeyDown={(event) =>
									handleOptionKeyDown(event, option, index)
								}
								role="option"
								aria-selected={isSelected}
								tabIndex={0}
								className={`dropdown-menu-item ${isSelected ? "active" : ""}`}
							>
								{option.name}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
