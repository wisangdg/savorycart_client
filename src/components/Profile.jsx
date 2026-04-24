import axiosInstance from "../api/axiosInstance";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../styles/profile.css";

export default function Profile() {
  const { isLoggedIn, token } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    customer_id: "",
    password: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) return;

        const response = await axiosInstance.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setUserData(response.data);
          setFormData({
            full_name: response.data.full_name,
            email: response.data.email,
            customer_id: response.data.customer_id,
            password: "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axiosInstance.put("/auth/me", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setUserData(response.data);
          alert("Profile updated successfully!");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      {isLoggedIn && userData ? (
        <>
          <h1>Profile</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Customer ID:</label>
              <input
                type="number"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Update Profile</button>
          </form>
        </>
      ) : (
        <p>Please log in to view and edit your profile.</p>
      )}
    </div>
  );
}
