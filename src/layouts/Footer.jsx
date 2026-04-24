import React from "react";
import "../styles/footer.css"; // Import the CSS file

const Footer = () => {
  return (
    // Use className instead of inline styles
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} Foodstore Company. All rights
        reserved.
      </p>
    </footer>
  );
};

// Remove inline styles object

export default Footer;
