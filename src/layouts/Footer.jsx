import React from "react";
import "../styles/footer.css"; // Import the CSS file

const Footer = () => {
	return (
		<footer className="footer">
			<p>
				&copy; {new Date().getFullYear()} SavoryCart. Seluruh hak cipta
				dilindungi.
			</p>
		</footer>
	);
};

export default Footer;
