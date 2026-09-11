import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../../layouts/Footer";

describe("Footer component", () => {
	test("renders footer with copyright text", () => {
		render(<Footer />);

		// Get the current year for comparison
		const currentYear = new Date().getFullYear();

		// Check if the footer contains the copyright text with current year
		const copyrightElement = screen.getByText(
			new RegExp(
				`© ${currentYear} SavoryCart. Seluruh hak cipta dilindungi.`,
				"i",
			),
		);
		expect(copyrightElement).toBeInTheDocument();
	});
});
