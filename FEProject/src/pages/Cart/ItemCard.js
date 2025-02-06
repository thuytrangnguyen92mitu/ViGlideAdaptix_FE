import React, { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  deleteItem,
  drecreaseQuantity,
  increaseQuantity,
} from "../../redux/orebiSlice";
import axiosInstance from "../../utils/axiosInstance";

const ItemCard = ({ cartDetail }) => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null); // Single product object
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch product details when the component mounts or cartDetail changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // Fetch the product details
        const response = await axiosInstance.get(
          `product/${cartDetail.productId}`
        );
        const rawProduct = response.data;

        console.log("Raw product details:", rawProduct);

        // Set the product details with the base64 image directly
        setProduct(rawProduct);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [cartDetail.productId]);

  const increaseQuantity = async () => {
    try {
      const response = await axiosInstance.post(
        "cart/add",
        {
          cartId: cartDetail.cartId,
          productId: cartDetail.productId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.status === 200) {
        navigate(0);
      }
    } catch (error) {
      console.error("Error adding item from cart ", error);
    }
  };

  const decreaseQuantity = async () => {
    try {
      const response = await axiosInstance.post(
        "cart/remove",
        {
          cartId: cartDetail.cartId,
          cartItemId: cartDetail.cartItemId,
          productId: cartDetail.productId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.status === 200) {
        // After successful removal, dispatch the decreaseQuantity action with the correct cartItemId
        navigate(0);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      const cartId = cartDetail.cartId;
      const response = await axiosInstance.delete("cart/clear", {
        params: { cartId },
      });
      if (response.status === 200) {
        navigate(0);
      }
    } catch (error) {
      console.error("Error to clear cart", error);
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  if (loading) {
    return (
      <div className="w-full text-center py-10">Loading product details...</div>
    );
  }

  if (!product) {
    return (
      <div className="w-full text-center py-10">
        Failed to load product details.
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-5 mb-4 border py-2">
      <div className="flex col-span-5 mdl:col-span-2 items-center gap-4 ml-4">
        <img
          className="w-32 h-32"
          src={`data:image/jpeg;base64,${product.productImage}`} // Use base64 directly
          alt={product.productName}
        />
        <h1 className="font-titleFont font-semibold">{product.productName}</h1>
      </div>
      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
        <div className="flex w-1/3 items-center text-lg font-semibold">
          {formatMoney(cartDetail.unitPrice)} VND{" "}
        </div>
        <div className="w-1/3 flex items-center gap-6 text-lg">
          <span
            onClick={decreaseQuantity} // Call decrease quantity API and Redux action
            className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
          >
            -
          </span>
          <p>{cartDetail.quantity}</p>
          <span
            onClick={increaseQuantity}
            className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
          >
            +
          </span>
        </div>
        <div className="w-1/3 flex items-center font-titleFont font-bold text-lg">
          <p>{formatMoney(cartDetail.quantity * cartDetail.unitPrice)} VND</p>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
