import { useCallback, memo } from "react";
import { useSearchParams } from "react-router-dom";
import SkeletonTagList from "../skeleton/SkeletonTag";
import { useQueryTags } from "../../hooks";

function Tags() {
	const [searchParams, setSearchParams] = useSearchParams();
	const { data: tags, isLoading, isError, error, refetch } = useQueryTags();

	// Tag aktif bersumber dari URL agar konsisten dengan katalog dan riwayat
	// Back/Forward: ?tag=id1,id2
	const activeIds = (searchParams.get("tag") || "")
		.split(",")
		.filter(Boolean);

	const toggleTag = useCallback(
		(tagId) => {
			const next = activeIds.includes(tagId)
				? activeIds.filter((id) => id !== tagId)
				: [...activeIds, tagId];

			const params = new URLSearchParams(searchParams);
			if (next.length > 0) {
				params.set("tag", next.join(","));
			} else {
				params.delete("tag");
			}
			setSearchParams(params, { replace: true });
		},
		[activeIds, searchParams, setSearchParams],
	);

	if (isError) {
		return (
			<section className="tags" aria-labelledby="tags-heading">
				<h2 className="tags-title" id="tags-heading">
					Tags:
				</h2>
				<div className="tags-error" role="alert" aria-live="assertive">
					<p className="error-message">
						Gagal memuat tag:{" "}
						{error?.message || "Silakan coba lagi."}
					</p>
					<button
						type="button"
						className="btn btn-outline"
						onClick={() => refetch()}
					>
						Coba lagi
					</button>
				</div>
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
				<ul
					className="tags-list"
					role="group"
					aria-label="Filter menu berdasarkan tag"
				>
					{Array.isArray(tags) &&
						tags.map((tag) => {
							const isActive = activeIds.includes(tag._id);
							return (
								<li key={tag._id}>
									<button
										type="button"
										className={`tag-item ${isActive ? "active" : ""}`}
										aria-pressed={isActive}
										onClick={() => toggleTag(tag._id)}
									>
										{tag.name}
									</button>
								</li>
							);
						})}
				</ul>
			)}
		</section>
	);
}

export default memo(Tags);
