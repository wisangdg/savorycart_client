import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/account.css";
import MainLayout from "../layouts/MainLayout";
import Profile from "../components/Profile.jsx";
import Address from "../components/Address.jsx";
import Order from "../components/Order.jsx";
import { useAuth } from "../hooks";

export default function Account() {
  const [currentView, setCurrentView] = useState("Profile");
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    logout();
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
          <h1 className="account-title">Account</h1>
          <div className="account-route">
            <h3
              className={`account-item ${
                currentView === "Profile" ? "active" : ""
              }`}
              onClick={() => setCurrentView("Profile")}
            >
              Profile
            </h3>
            <h3
              className={`account-item ${
                currentView === "Order" ? "active" : ""
              }`}
              onClick={() => setCurrentView("Order")}
            >
              Orders
            </h3>
            <h3
              className={`account-item ${
                currentView === "Address" ? "active" : ""
              }`}
              onClick={() => setCurrentView("Address")}
            >
              Address
            </h3>
            <h3 className="account-item" onClick={handleLogout}>
              Logout
            </h3>
          </div>
        </div>
        <div className="account-right">
          <div id="render">{renderContent()}</div>
        </div>
        {showConfirm && (
          <div className="confirm-dialog">
            <p>Are you sure you want to log out?</p>
            <button onClick={confirmLogout}>Yes</button>
            <button onClick={cancelLogout}>No</button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
