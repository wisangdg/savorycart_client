import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useSelector } from "react-redux";
import "../styles/address.css";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [form, setForm] = useState({
    addressName: "",
    kelurahan: "",
    kecamatan: "",
    kabupatenkota: "",
    provinsi: "",
    detail: "",
  });
  const [error, setError] = useState("");

  const handleSelectAddress = (address) => {
    setSelectedAddress(address._id);
    localStorage.setItem(
      "selectedAddress",
      JSON.stringify({
        _id: address._id,
        addressName: address.addressName,
        kelurahan: address.kelurahan,
        kecamatan: address.kecamatan,
        kabupatenkota: address.kabupatenkota,
        provinsi: address.provinsi,
        detail: address.detail,
      })
    );
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axiosInstance.get("/api/delivery-addresses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Response:", response.data);
        setAddresses(response.data.data || []);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch addresses");
      }
    };
    fetchAddresses();
    const savedAddress = localStorage.getItem("selectedAddress");
    if (savedAddress) {
      const parsedAddress = JSON.parse(savedAddress);
      setSelectedAddress(parsedAddress._id);
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post(
        "/api/delivery-addresses",
        {
          addressName: form.addressName,
          kelurahan: form.kelurahan,
          kecamatan: form.kecamatan,
          kabupatenkota: form.kabupatenkota,
          provinsi: form.provinsi,
          detail: form.detail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAddresses((prevAddresses) => [...prevAddresses, data]);

      setForm({
        addressName: "",
        kelurahan: "",
        kecamatan: "",
        kabupatenkota: "",
        provinsi: "",
        detail: "",
      });
      setFormVisible(false);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to add address");
    }
  };

  return (
    <div className="address-container">
      <h1>Addresses</h1>
      {error && <p className="error">{error}</p>}
      {addresses.length > 0 ? (
        <ul className="address-list">
          {addresses.map((address) => (
            <li
              key={address._id}
              className={`address-item ${
                selectedAddress === address._id ? "selected" : ""
              }`}
              onClick={() => handleSelectAddress(address)}
            >
              <div className="address-content">
                <div className="address-text">
                  {address.addressName}, {address.kelurahan},{" "}
                  {address.kecamatan}, {address.kabupatenkota},{" "}
                  {address.provinsi}, {address.detail}
                </div>
                <div className="address-actions">
                  {selectedAddress === address._id ? (
                    <span className="selected-badge">Alamat Terpilih ✓</span>
                  ) : (
                    <button
                      className="select-address-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAddress(address);
                      }}
                    >
                      Pilih Alamat
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No addresses available.</p>
      )}
      {!formVisible && (
        <button
          onClick={() => setFormVisible(true)}
          className="add-address-button"
        >
          Add Address
        </button>
      )}
      {formVisible && (
        <form onSubmit={handleSubmit} className="address-form">
          <input
            type="text"
            name="addressName"
            value={form.addressName}
            onChange={handleChange}
            placeholder="Nama Alamat"
            required
            className="form-input"
          />
          <input
            type="text"
            name="kelurahan"
            value={form.kelurahan}
            onChange={handleChange}
            placeholder="Kelurahan"
            required
            className="form-input"
          />
          <input
            type="text"
            name="kecamatan"
            value={form.kecamatan}
            onChange={handleChange}
            placeholder="Kecamatan"
            required
            className="form-input"
          />
          <input
            type="text"
            name="kabupatenkota"
            value={form.kabupatenkota}
            onChange={handleChange}
            placeholder="Kabupaten/Kota"
            required
            className="form-input"
          />
          <input
            type="text"
            name="provinsi"
            value={form.provinsi}
            onChange={handleChange}
            placeholder="Provinsi"
            required
            className="form-input"
          />
          <input
            type="text"
            name="detail"
            value={form.detail}
            onChange={handleChange}
            placeholder=""
            required
            className="form-input"
          />
          <button type="submit" className="submit-button">
            Add Address
          </button>
        </form>
      )}
    </div>
  );
};

export default Address;
