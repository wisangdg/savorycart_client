import React from "react";
import { Link } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import "../../styles/logo.css";

export default function Logo() {
  return (
    <div className="logo">
      <Link to="/" className="header-logo">
        <div className="header-logo-icon">
          <FaUtensils />
        </div>
        <span className="header-logo-text">SavoryCart</span>
      </Link>
    </div>
  );
}
