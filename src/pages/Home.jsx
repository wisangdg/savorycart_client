import React from "react";
import { useSearchParams } from "react-router-dom";
import HomeContent from "../components/HomeContent";
import MainLayout from "../layouts/MainLayout";

export default function Home() {
	const [searchParams] = useSearchParams();

	// Filter katalog dibaca dari URL agar bisa diakses dari halaman mana pun.
	const searchKeyword = searchParams.get("search") || "";
	const categoryName = searchParams.get("category") || "";
	const selectedCategory = categoryName
		? { _id: categoryName, name: categoryName }
		: null;

	return (
		<MainLayout>
			<HomeContent
				searchKeyword={searchKeyword}
				selectedCategory={selectedCategory}
			/>
		</MainLayout>
	);
}
