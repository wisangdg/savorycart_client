import React from "react";
import SkeletonCard from "./SkeletonCard";
import "./Skeleton.css";

/**
 * SkeletonList component for displaying multiple skeleton cards
 * Optimized with React.memo to prevent unnecessary re-renders
 *
 * @param {Object} props - Component props
 * @param {number} props.count - Number of skeleton cards to display
 * @returns {JSX.Element} A list of skeleton cards
 */
const SkeletonList = React.memo(({ count = 6 }) => {
  // Pre-generate array of keys for better performance
  const skeletonItems = React.useMemo(() => {
    return Array(count)
      .fill()
      .map((_, index) => <SkeletonCard key={`skeleton-${index}`} />);
  }, [count]);

  return (
    <div className="skeleton-list" aria-hidden="true">
      {skeletonItems}
    </div>
  );
});

export default SkeletonList;
