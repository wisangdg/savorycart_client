import React, { useState, useEffect } from "react";
import HomeTitle from "./main/HomeTitle.jsx";
import Tags from "./main/Tags.jsx";
import MenuItems from "./main/MenuItems.jsx";
import Loading from "../pages/Loading";
import { useLocation } from "react-router-dom";
import "../styles/main.css";

export default function HomeContent({ searchKeyword, selectedCategory }) {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [location.pathname]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="homecontent">
          <HomeTitle />
          <Tags />
          <MenuItems
            searchKeyword={searchKeyword}
            selectedCategory={selectedCategory}
          />
        </div>
      )}
    </>
  );
}
