import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { paginationItems } from "../../../constants";
import axiosInstance from "../../../utils/axiosInstance";

// Import useNavigate from react-router-dom
import { useNavigate } from "react-router-dom";

const HeaderBottom = () => {
  // const products = useSelector((state) => state.orebiReducer.products);
  const [showUser, setShowUser] = useState(false);
  const [categories, setCategories] = useState([]); // State for categories
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartId, setCartId] = useState("");
  const [loginUser, setLoginUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [cartDetails, setCartDetails] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Check if customer is logged in
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user && user.token) {
      setCartId(user.cartId);
      setLoginUser(user);
      setIsLoggedIn(true);
    }

    const handelStorageChange = () => {
      const newUser = JSON.parse(localStorage.getItem("loggedInUser"));

      if (!newUser || !newUser.token) {
        setIsLoggedIn(false);
        setLoginUser();
        navigate("/signin");
      }
    };
    window.addEventListener("storage", handelStorageChange);
    return () => {
      window.removeEventListener("storage", handelStorageChange);
    };
  }, [navigate]);

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("product/category", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        setCategories(response.data); // Assuming the API returns an array of categories
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

  // Define fetchCartDetails outside useEffect
  const fetchCartDetails = async (newCartId, customerId) => {
    try {
      const response = await axiosInstance.post(
        "cart/get",
        { cartId: newCartId, customerId: customerId },
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
    } catch (error) {
      console.error("Error fetching updated cart:", error);
    }
  };

  useEffect(() => {
    if (cartId && loginUser.customerId) {
      fetchCartDetails(cartId, loginUser.customerId);
    }
  }, [cartId, loginUser.customerId]);

  useEffect(() => {
    const handleUpdateCart = () => {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (user && user.customerId) {
        fetchCartDetails(user.cartId, user.customerId);
      }
    };

    window.addEventListener("updateCart", handleUpdateCart);
    return () => {
      window.removeEventListener("updateCart", handleUpdateCart);
    };
  }, []);

  useEffect(() => {
    const filtered = paginationItems.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);

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
