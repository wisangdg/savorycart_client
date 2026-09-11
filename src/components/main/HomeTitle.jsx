export default function HomeTitle() {
	const handleExplore = () => {
		document
			.getElementById("menu-heading")
			?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return (
		<section className="hero" aria-labelledby="hero-title">
			<div className="hero-content">
				<p className="hero-eyebrow">Pesan antar makanan</p>
				<h1 id="hero-title" className="hero-title">
					Lapar? Pesan di SavoryCart.
				</h1>
				<p className="hero-description">
					Temukan menu favoritmu dan pesan antar langsung ke pintu
					rumah.
				</p>
				<button
					type="button"
					className="hero-cta"
					onClick={handleExplore}
				>
					Jelajahi menu
				</button>
			</div>

			<div className="hero-visual" aria-hidden="true">
				<div className="hero-visual-plate">
					<span className="hero-visual-emoji">🍜</span>
				</div>
				<span className="hero-visual-badge hero-visual-badge--tl">
					🥗
				</span>
				<span className="hero-visual-badge hero-visual-badge--br">
					🥤
				</span>
			</div>
		</section>
	);
}
