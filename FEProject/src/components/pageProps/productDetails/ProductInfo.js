import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import axiosInstance from "../../../utils/axiosInstance";

const ProductInfo = ({ productInfo, categoryName, brandName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const halfStar = rating % 1 >= 0.5; // Check if there's a half star
    const emptyStars = 5 - Math.ceil(rating); // Remaining empty stars

    return (
      <div className="flex items-center">
        {Array(Math.max(0, fullStars))
          .fill(0)
          .map((_, index) => (
            <FaStar key={`full-${index}`} className="text-yellow-500" />
          ))}
        {halfStar && <FaStarHalfAlt className="text-yellow-500" />}
        {Array(Math.max(0, emptyStars))
          .fill(0)
          .map((_, index) => (
            <FaRegStar key={`empty-${index}`} className="text-yellow-500" />
          ))}
      </div>
    );
  };

  const addItemToCart = async () => {
    // Check if the user is logged in
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    try {
      const response = await axiosInstance.post(
        "cart/add",
        {
          cartId: user.cartId,
          productId: productInfo.productId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      navigate(0);
    } catch (error) {
      console.error("Error adding item into cart:", error);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.productName}</h2>
      <p className="text-xl font-semibold">
        {formatMoney(productInfo.unitPrice)} VND{" "}
        {productInfo.unitPrice === 0 && (
          <span className="text-red-500">(Contact for Price)</span>
        )}
      </p>
      <p className="font-normal text-sm">
        <span className="text-base font-semibold"> Brand:</span> {brandName}
      </p>
      <p className="text-base text-gray-600">
        {productInfo.productDescription}
      </p>

      <button
        onClick={addItemToCart}
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont"
      >
        Add to Cart
      </button>
      <p className="font-normal text-sm">
        <span className="text-base font-semibold"> Categorie:</span>{" "}
        {categoryName}
      </p>
      <div className="font-normal text-sm flex items-center">
        <span className="text-base font-semibold mr-2">Rating:</span>
        {renderStars(productInfo.ratingScore)}
      </div>
    </div>
  );
};

export default ProductInfo;
