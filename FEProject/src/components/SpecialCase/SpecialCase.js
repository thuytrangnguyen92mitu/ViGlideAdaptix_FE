import React, { useState, useRef, useEffect } from "react";

import { Link } from "react-router-dom";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { MdSwitchAccount } from "react-icons/md";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";

const SpecialCase = () => {
  const [cartId, setCartId] = useState("");
  const [loginUser, setLoginUser] = useState([]);
  const [cartCount, setCartCount] = useState(0);

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

      const cartItems = response.data?.cart?.cartItemsList || [];
      setCartCount(cartItems.length);
    } catch (error) {
      console.error("Error fetching updated cart:", error);
    }
  };

  useEffect(() => {
    // Check if customer is logged in
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user && user.token) {
      setCartId(user.cartId);
      setLoginUser(user);
    }
  }, []);

  useEffect(() => {
    if (cartId && loginUser?.customerId) {
      fetchCartDetails(cartId, loginUser.customerId);
    }
  }, [cartId, loginUser]);

  useEffect(() => {
    const handleUpdateCart = () => {
      if (loginUser?.customerId) {
        fetchCartDetails(loginUser.cartId, loginUser.customerId);
      }
    };

    window.addEventListener("updateCart", handleUpdateCart);
    return () => {
      window.removeEventListener("updateCart", handleUpdateCart);
    };
  }, [loginUser]);

  return (
    <div className="fixed top-52 right-2 z-20 hidden md:flex flex-col gap-2">
      <Link to="/profile">
        <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer">
          <div className="flex justify-center items-center">
            <MdSwitchAccount className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />

            <MdSwitchAccount className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
          </div>
          <p className="text-xs font-semibold font-titleFont">Profile</p>
        </div>
      </Link>
      <Link to="/cart">
        <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer relative">
          <div className="flex justify-center items-center">
            <RiShoppingCart2Fill className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />

            <RiShoppingCart2Fill className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
          </div>
          <p className="text-xs font-semibold font-titleFont">Pay Now</p>
          {cartCount > 0 && (
            <p className="absolute top-1 right-2 bg-primeColor text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold">
              {cartCount}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default SpecialCase;
