import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/account.css";
import MainLayout from "../layouts/MainLayout";
import Profile from "../components/Profile.jsx";
import Address from "../components/Address.jsx";
import Order from "../components/Order.jsx";
import { useAuth } from "../hooks";

const VIEWS = {
	Profile: "Profil",
	Order: "Pesanan",
	Address: "Alamat",
};

export default function Account() {
	const [searchParams] = useSearchParams();
	const initialView =
		searchParams.get("view") === "address" ? "Address" : "Profile";
	const [currentView, setCurrentView] = useState(initialView);
	const [showConfirm, setShowConfirm] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const navigate = useNavigate();
	const { logout } = useAuth();

	const handleLogout = () => {
		setShowConfirm(true);
	};

	// Hasil logout ditampilkan lewat notifikasi global (store), bukan dialog ini,
	// karena halaman akun langsung digantikan halaman Login setelah sesi lokal dibersihkan.
	const confirmLogout = async () => {
		if (isLoggingOut) return;
		setIsLoggingOut(true);
		try {
			await logout();
		} finally {
			setIsLoggingOut(false);
			setShowConfirm(false);
		}
		navigate("/", { replace: true });
	};

	const cancelLogout = () => {
		setShowConfirm(false);
	};

	const renderContent = () => {
		switch (currentView) {
			case "Profile":
				return <Profile />;
			case "Order":
				return <Order />;
			case "Address":
				return <Address />;
			default:
				return <Profile />;
		}
	};

	return (
		<MainLayout>
			<div className="account">
				<div className="account-left">
					<h1 className="account-title">Akun</h1>
					<div className="account-route">
						{["Profile", "Order", "Address"].map((view) => (
							<button
								key={view}
								type="button"
								className={`account-item ${
									currentView === view ? "active" : ""
								}`}
								onClick={() => setCurrentView(view)}
							>
								{VIEWS[view]}
							</button>
						))}
						<button
							type="button"
							className="account-item"
							onClick={handleLogout}
						>
							Keluar
						</button>
					</div>
				</div>
				<div className="account-right">
					<div id="render">{renderContent()}</div>
				</div>
				{showConfirm && (
					<div
						className="confirm-dialog"
						role="alertdialog"
						aria-modal="true"
					>
						<p>Yakin ingin keluar dari akun?</p>
						<button
							type="button"
							onClick={confirmLogout}
							disabled={isLoggingOut}
						>
							{isLoggingOut ? "Memproses..." : "Ya"}
						</button>
						<button
							type="button"
							onClick={cancelLogout}
							disabled={isLoggingOut}
						>
							Tidak
						</button>
					</div>
				)}
			</div>
		</MainLayout>
	);
}
