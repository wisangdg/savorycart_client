import { useCallback, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTag } from "../../store";
import SkeletonTagList from "../skeleton/SkeletonTag";
import { useQueryTags } from "../../hooks";

function Tags() {
  const dispatch = useDispatch();
  const activeTags = useSelector((state) => state.tags.activeTags);
  const { data: tags, isLoading, isError, error } = useQueryTags();

  const handleClickTags = useCallback(
    (tag) => {
      dispatch(addTag(tag));
    },
    [dispatch]
  );

  if (isError) {
    return (
      <section className="tags" aria-labelledby="tags-heading">
        <h2 className="tags-title" id="tags-heading">
          Tags:
        </h2>
        <p className="error-message" role="alert" aria-live="assertive">
          Failed to load tags: {error?.message || "Please try again later."}
        </p>
      </section>
    );
  }

  return (
    <section className="tags" aria-labelledby="tags-heading">
      <h2 className="tags-title" id="tags-heading">
        Tags:
      </h2>
      {isLoading ? (
        <div aria-live="polite" aria-busy="true">
          <SkeletonTagList count={8} />
        </div>
      ) : (
        <ul className="tags-list" role="listbox" aria-label="Filter menu by tags">
          {Array.isArray(tags) &&
            tags.map((tag) => {
              const isActive = activeTags.find((t) => t._id === tag._id);
              return (
                <li
                  key={tag._id}
                  className={`tag-item ${isActive ? "active" : ""}`}
                  onClick={() => handleClickTags(tag)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleClickTags(tag);
                    }
                  }}
                  role="option"
                  aria-selected={isActive}
                  tabIndex="0"
                  aria-label={`Filter by ${tag.name} ${isActive ? "(selected)" : ""}`}
                >
                  {tag.name}
                </li>
              );
            })}
        </ul>
      )}
    </section>
  );
}

export default memo(Tags);

