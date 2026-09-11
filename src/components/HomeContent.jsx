import React from "react";
import HomeTitle from "./main/HomeTitle.jsx";
import Tags from "./main/Tags.jsx";
import MenuItems from "./main/MenuItems.jsx";
import "../styles/main.css";

export default function HomeContent({ searchKeyword, selectedCategory }) {
	return (
		<div className="homecontent">
			<HomeTitle />
			<Tags />
			<MenuItems
				searchKeyword={searchKeyword}
				selectedCategory={selectedCategory}
			/>
		</div>
	);
}
