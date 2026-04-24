import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import "../../styles/kategori.css";

export default function Kategori({ options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  const toggleOptions = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event, option) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect(option);
    }
  };

  return (
    <div className="kategori" ref={dropdownRef}>
      <button
        className={`kategori-dropdown ${isOpen ? "active" : ""}`}
        onClick={toggleOptions}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select category"
        ref={buttonRef}
      >
        {selectedOption ? selectedOption.name : "Kategori"}
        <span className="kategori-dropdown-icon">
          <FaChevronDown />
        </span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu" role="listbox" aria-label="Categories" tabIndex="-1">
          {options.map((option) => {
            const isSelected = selectedOption && selectedOption._id === option._id;
            return (
              <li
                key={option._id}
                onClick={() => handleSelect(option)}
                onKeyDown={(e) => handleKeyDown(e, option)}
                role="option"
                aria-selected={isSelected}
                tabIndex="0"
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

