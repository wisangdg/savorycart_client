import axiosInstance from "../../api/axiosInstance.js";
import React, { useEffect, useState, useRef } from "react";
import { FaShoppingCart, FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../../store.js";
import "../../styles/carts.css";

const CartList = () => {
  const { isLoggedIn, token } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [cartQty, setCartQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkoutStatus, setCheckoutStatus] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();
  const cartButtonRef = useRef(null); // Ref for the cart button
  const cartDropdownRef = useRef(null); // Ref for the dropdown

  const formatPrice = (price) => {
    return price.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchCart(token));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError(error.response ? error.response.data : error);
        setLoading(false);
      }
    };

    if (isLoggedIn && token) {
      fetchCartData();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, token, dispatch]);

  useEffect(() => {
    // Update cartQty and totalPrice when cart changes
    if (cart) {
      setCartQty(cart.length);
      const total = Array.isArray(cart)
        ? cart.reduce((acc, item) => {
            // Check if product exists and has a price
            if (!item.product) {
              return acc;
            }
            const price = item.product.price || 0;
            const quantity = item.qty || 1;
            return acc + price * quantity;
          }, 0)
        : 0;
      setTotalPrice(total);
    }
  }, [cart]);

  useEffect(() => {
    // Load selected address from localStorage
    const savedAddress = localStorage.getItem("selectedAddress");
    if (savedAddress) {
      setSelectedAddress(JSON.parse(savedAddress));
    }
  }, []);

  // Add useEffect for closing cart on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(event.target) &&
        cartButtonRef.current &&
        !cartButtonRef.current.contains(event.target)
      ) {
        setIsCartVisible(false);
      }
    };

    // Menambahkan event listener untuk menyesuaikan posisi dropdown
    const handleResize = () => {
      // Memastikan dropdown tidak keluar batas layar
      if (cartDropdownRef.current && isCartVisible) {
        const cartRect = cartButtonRef.current?.getBoundingClientRect();
        if (cartRect) {
          const windowWidth = window.innerWidth;
          const cartDropdown =
            cartDropdownRef.current.querySelector(".cart-dropdown");
          if (cartDropdown) {
            // Jika posisi keranjang terlalu dekat dengan tepi kanan layar
            if (cartRect.right + 320 > windowWidth) {
              const rightOffset = Math.min(
                windowWidth - cartRect.right - 10,
                0
              );
              cartDropdown.style.right = `${-rightOffset}px`;
            }
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    // Panggil sekali untuk mengatur posisi awal
    handleResize();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isCartVisible]);

  // Add useEffect for closing cart with Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isCartVisible && event.key === "Escape") {
        setIsCartVisible(false);
        cartButtonRef.current?.focus(); // Return focus to the button
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartVisible]);

  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  const handleCheckout = async () => {
    if (!isLoggedIn || !token) {
      setError("You need to be logged in to checkout.");
      return;
    }

    const savedAddress = localStorage.getItem("selectedAddress");
    if (!savedAddress) {
      setError("Please select a delivery address first");
      return;
    }

    const deliveryAddress = JSON.parse(savedAddress);

    try {
      const response = await axiosInstance.post(
        "/api/orders",
        {
          delivery_fee: 10000,
          delivery_address: deliveryAddress._id, // Pastikan menggunakan ID alamat
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        try {
          // Clear cart
          await axiosInstance.delete("/api/carts", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Update local state
          dispatch(fetchCart(token));
          setIsCartVisible(false);
          setCheckoutStatus("Checkout successful!");

          // Redirect to orders page
          navigate("/orders", {
            state: {
              orderCreated: true,
              orderId: response.data._id,
            },
          });
        } catch (cartError) {
          console.error("Error clearing cart:", cartError);
          setError("Order created but failed to clear cart");
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      const errorMessage = error.response?.data?.message || "Checkout failed";
      setError(errorMessage);
    }
  };

  const handleAddItem = async (id) => {
    try {
      // Update ke server dengan format yang lebih sederhana
      await axiosInstance.put(
        `/api/carts/${id}`,
        { product: id, qty: 1 }, // menambah 1 quantity
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state lokal
      dispatch(fetchCart(token));
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const item = cart.find((item) => item.product && item.product._id === id);
      if (item.qty === 1) {
        await axiosInstance.delete(`/api/carts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        dispatch(fetchCart(token));
      } else {
        // Update ke server dengan format yang lebih sederhana
        await axiosInstance.put(
          `/api/carts/${id}`,
          { product: id, qty: -1 }, // mengurangi quantity
          { headers: { Authorization: `Bearer ${token}` } }
        );

        dispatch(fetchCart(token));
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // Redirect to login page when cart icon is clicked by non-logged in user
  const handleNotLoggedInClick = () => {
    navigate("/login");
  };

  if (loading) return <p>Loading cart...</p>; // Consider using a Skeleton loader here
  // Error handling can be improved, maybe using the ErrorFallback component
  if (error)
    return (
      <div className="message message-error">
        Error: {error.message || JSON.stringify(error)}
      </div>
    );

  return (
    <div className="cart-wrapper" ref={cartDropdownRef}>
      {isLoggedIn ? (
        <div
          className="header-cart"
          onClick={toggleCartVisibility}
          ref={cartButtonRef}
          aria-label={`Cart items: ${cartQty}`}
          aria-expanded={isCartVisible}
          role="button"
          tabIndex="0"
        >
          <FaShoppingCart />
          {cartQty > 0 && <span className="cart-badge">{cartQty}</span>}
        </div>
      ) : (
        <div
          className="header-cart"
          onClick={handleNotLoggedInClick}
          ref={cartButtonRef}
          aria-label="Cart (login required)"
          role="button"
          tabIndex="0"
        >
          <FaShoppingCart />
          <span className="cart-badge cart-badge-login" title="Login required">
            <span className="login-indicator">?</span>
          </span>
        </div>
      )}

      {isLoggedIn && isCartVisible && (
        <div
          className="dropdown-menu cart-dropdown"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-heading"
          style={{ right: 0 }}
        >
          <div className="cart-header">
            <h2 id="cart-heading" className="cart-title">
              Keranjang Anda
            </h2>
            <button
              onClick={toggleCartVisibility}
              className="cart-close-button"
              aria-label="Close cart"
            >
              <FaTimes />
            </button>
          </div>
          <div className="cart-items-list">
            {cart && cart.length > 0 ? (
              cart.map((cartItem) => (
                <div key={cartItem._id} className="cart-item">
                  {cartItem.product && (
                    <>
                      <div className="cart-item-info">
                        <span className="cart-item-name">{cartItem.product.name}</span>
                        <span className="cart-item-price">Rp.{formatPrice(cartItem.product.price)}</span>
                      </div>
                      <div className="cart-item-controls">
                        <button
                          className="cart-item-btn cart-item-decrease"
                          onClick={() => handleRemoveItem(cartItem.product._id)}
                          aria-label={`Decrease quantity of ${cartItem.product.name}`}
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="cart-item-quantity">{cartItem.qty}</span>
                        <button
                          className="cart-item-btn cart-item-increase"
                          onClick={() => handleAddItem(cartItem.product._id)}
                          aria-label={`Increase quantity of ${cartItem.product.name}`}
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="cart-empty-message">Keranjang Anda kosong.</p>
            )}
          </div>
          {cart && cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span className="cart-total-price">Rp.{formatPrice(totalPrice)}</span>
              </div>
              {!selectedAddress && (
                <div className="cart-warning">Pilih alamat pengiriman sebelum checkout.</div>
              )}
              <button className="btn-primary btn-block" onClick={handleCheckout} disabled={!selectedAddress}>
                Checkout
              </button>
              {error && <div className="cart-error">{error}</div>}
              {checkoutStatus && <div className="cart-success">{checkoutStatus}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartList;

