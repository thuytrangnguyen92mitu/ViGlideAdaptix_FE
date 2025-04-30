import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { paginationItems } from "../../../constants";
import axiosInstance from "../../../utils/axiosInstance";

const HeaderBottom = () => {
  const [showUser, setShowUser] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartId, setCartId] = useState("");
  const [loginUser, setLoginUser] = useState(null);
  const [cartDetails, setCartDetails] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Helper function: update user from localStorage and fetch cart details.
  const updateUserFromLocalStorage = () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("Updating user from localStorage:", user);
    if (user && user.token && user.customerId) {
      setCartId(user.cartId);
      setLoginUser(user);
      setIsLoggedIn(true);
      fetchCartDetails(user.cartId, user.customerId);
    }
  };

  // Fetch cart details from the API.
  const fetchCartDetails = async (currentCartId, customerId) => {
    try {
      const response = await axiosInstance.post(
        "cart/get",
        { cartId: currentCartId, customerId },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const cartItems = response.data.cart.cartItemsList;
      setCartDetails(cartItems);
      setCartCount(cartItems.length);
      console.log("Fetched cart details for cartId:", currentCartId);
    } catch (error) {
      console.error("Error fetching updated cart:", error);
    }
  };

  // On mount, update user from localStorage.
  useEffect(() => {
    updateUserFromLocalStorage();
  }, []);

  // Listen for the custom "updateCart" event.
  useEffect(() => {
    const handleUpdateCart = () => {
      console.log("Received updateCart event");
      updateUserFromLocalStorage();
    };
    window.addEventListener("updateCart", handleUpdateCart);
    return () => {
      window.removeEventListener("updateCart", handleUpdateCart);
    };
  }, []);

  // Listen for the window "focus" event.
  useEffect(() => {
    const handleFocus = () => {
      console.log("Window regained focus");
      updateUserFromLocalStorage();
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Listen for the "pageshow" event (to catch navigation from bfcache).
  useEffect(() => {
    const handlePageShow = (event) => {
      console.log("pageshow event fired", event.persisted);
      updateUserFromLocalStorage();
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  // Listen for storage events from other tabs.
  useEffect(() => {
    const handleStorageChange = () => {
      updateUserFromLocalStorage();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  // (Optional) Fetch categories if used for navigation.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("product/category", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    setIsLoggedIn(false);
    navigate(0);
  };

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <div className="flex flex-row items-center justify-end w-full px-4 h-24">
          {/* User Dropdown */}
          <div className="relative flex gap-4 cursor-pointer">
            <div
              onClick={() => setShowUser(!showUser)}
              className="flex items-center gap-1"
            >
              <FaUser />
              <FaCaretDown />
            </div>
            {showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 left-0 z-50 bg-primeColor w-44 text-[#767676] h-auto p-4 pb-6"
              >
                {isLoggedIn ? (
                  <>
                    <Link to="/profile">
                      <li className="text-gray-400 px-4 py-1 border-b border-gray-400 hover:border-white hover:text-white duration-300 cursor-pointer">
                        Profile
                      </li>
                    </Link>
                    <li
                      onClick={handleLogout}
                      className="text-gray-400 px-4 py-1 border-b border-gray-400 hover:border-white hover:text-white duration-300 cursor-pointer"
                    >
                      Sign Out
                    </li>
                  </>
                ) : (
                  <>
                    <Link to="/signin">
                      <li className="text-gray-400 px-4 py-1 border-b border-gray-400 hover:border-white hover:text-white duration-300 cursor-pointer">
                        Sign In
                      </li>
                    </Link>
                    <Link to="/signup">
                      <li className="text-gray-400 px-4 py-1 border-b border-gray-400 hover:border-white hover:text-white duration-300 cursor-pointer">
                        Sign Up
                      </li>
                    </Link>
                  </>
                )}
              </motion.ul>
            )}
            {/* Cart Icon */}
            <Link to="/cart">
              <div className="relative">
                <FaShoppingCart />
                <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
                  {cartCount}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
