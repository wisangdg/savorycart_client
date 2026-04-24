import React from "react";
import "./Skeleton.css";

/**
 * SkeletonCard component for displaying a loading placeholder for menu items
 * Uses CSS animations for a more engaging loading experience
 *
 * @returns {JSX.Element} A skeleton card component
 */
const SkeletonCard = React.memo(() => {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-image pulse"></div>
      <div className="skeleton-content">
        <div className="skeleton-title pulse"></div>
        <div className="skeleton-text pulse"></div>
        <div className="skeleton-text pulse" style={{ width: "70%" }}></div>
        <div className="skeleton-price pulse"></div>
        <div className="skeleton-button pulse"></div>
      </div>
    </div>
  );
});

export default SkeletonCard;
