import React from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import {
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../designLayouts/Image";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, incrementCartCount } from "../../../redux/orebiSlice";
import axiosInstance from "../../../utils/axiosInstance";

const Product = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProductDetails = async () => {
    try {
      navigate(`/product/${props._id}`, { state: { productId: props._id } });
    } catch (error) {
      console.error("Error fetching product details:", error.message);
    }
  };
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const addItemToCart = async () => {
    // Check if the user is logged in
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user || !user.token) {
      // Alert the user and redirect to the sign-in page
      alert("You need to sign in to add products to your cart.");
      navigate("/signin");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "cart/add",
        {
          cartId: props.cartId,
          productId: props._id,
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

  return (
    <div className="w-full relative group">
      {/* Display Product Image */}
      <div className="max-w-80 max-h-80 relative overflow-hidden">
        <div>
          {/* Ensure props.img contains a valid image URL */}
          {props.img ? (
            <img
              className="w-full h-full object-cover"
              src={props.img} // Use the imgSrc (base64 data URL)
              alt={props.productName}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p>No Image Available</p>
            </div>
          )}
        </div>
        <div className="w-full h-30 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
          <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
            <li
              onClick={addItemToCart}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              Add to Cart
              <span>
                <FaShoppingCart />
              </span>
            </li>
            <li
              onClick={handleProductDetails}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              View Details
              <span className="text-lg">
                <MdOutlineLabelImportant />
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-80 py-6 flex flex-col gap-1 border-[1px] border-t-0 px-4">
        <div className="flex items-center justify-between font-titleFont">
          <h2 className="text-lg text-primeColor font-bold">
            {props.productName}
          </h2>
          <p className="text-[#767676] text-[14px]">
            {formatMoney(props.price)} VND
          </p>
        </div>
        <div>
          <p className="text-[#767676] text-[14px]">{props.des}</p>
        </div>
        <div>
          <p className="text-[#767676] text-[14px]">
            Purchases: {props.purchases ? props.purchases : 0}
          </p>
        </div>
        <div className="mt-2">{renderStars(props.ratingScore)}</div>
      </div>
    </div>
  );
};

export default Product;
