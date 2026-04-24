import React from "react";
import "./Skeleton.css";

/**
 * SkeletonTag component for displaying a loading placeholder for tag items
 *
 * @returns {JSX.Element} A skeleton tag component
 */
const SkeletonTag = React.memo(() => {
  return <div className="skeleton-tag pulse" aria-hidden="true"></div>;
});

/**
 * SkeletonTagList component for displaying multiple skeleton tags
 * Optimized with React.memo and useMemo to prevent unnecessary re-renders
 *
 * @param {Object} props - Component props
 * @param {number} props.count - Number of skeleton tags to display
 * @returns {JSX.Element} A list of skeleton tags
 */
const SkeletonTagList = React.memo(({ count = 5 }) => {
  // Pre-generate array of keys for better performance
  const skeletonTags = React.useMemo(() => {
    return Array(count)
      .fill()
      .map((_, index) => <SkeletonTag key={`skeleton-tag-${index}`} />);
  }, [count]);

  return (
    <div className="skeleton-tag-list" aria-hidden="true">
      {skeletonTags}
    </div>
  );
});

export default SkeletonTagList;
