import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../styles/account.css";

function AccountIcon() {
  const token = useSelector((state) => state.auth.token);
  const destination = token ? "/account" : "/login";
  const label = token ? "View account" : "Login";

  return (
    <Link to={destination} className="header-profile" aria-label={label}>
      <div className="header-icon-wrapper">
        <FaUser size={12} />
      </div>
      {token && <span className="profile-name">Akun</span>}
    </Link>
  );
}

export default AccountIcon;

