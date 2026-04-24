import React, { useState } from "react";
import HomeContent from "../components/HomeContent";
import MainLayout from "../layouts/MainLayout";

export default function Home({
  searchKeyword,
  handleSearchChange,
  categories,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    console.log("Category selected in App:", category);
    setSelectedCategory(category._id === "all" ? null : category); // If 'Semua' is selected, set to null to show all products
  };
  return (
    <MainLayout
      handleSearchChange={handleSearchChange}
      categories={categories}
      onSelectCategory={handleCategorySelect}
    >
      <HomeContent
        searchKeyword={searchKeyword}
        selectedCategory={selectedCategory}
      />
    </MainLayout>
  );
}
