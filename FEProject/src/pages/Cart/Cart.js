import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images/index";
import ItemCard from "./ItemCard";
import axiosInstance from "../../utils/axiosInstance";

const Cart = () => {
  const dispatch = useDispatch();
  const [cartDetails, setCartDetails] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };
  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (user && user.cartId && user.customerId) {
          const response = await axiosInstance.post(
            "cart/get",
            {
              cartId: user.cartId,
              customerId: user.customerId,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          const cartData = response.data.cart;
          setCartDetails(cartData);
          setCartItems(cartData.cartItemsList);
          calculateTotal(cartData.cartItemsList);
        }
      } catch (error) {
        console.error("Error fetching cart details:", error);
      }
    };

    fetchCartDetails();
  }, []);

  const calculateTotal = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.unitPrice * item.quantity;
    });
    setTotalAmt(total);
    setShippingCharge(total <= 200 ? 30 : total <= 400 ? 25 : 20);
  };

  const clearCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!user || !user.cartId) {
        console.error("No valid user or cartId found.");
        return;
      }

      const cartId = user.cartId;
      const response = await axiosInstance.delete("cart/clear", {
        params: { cartId },
      });
      if (response.status === 200) {
        // After successful removal, dispatch the decreaseQuantity action with the correct cartItemId
        window.location.reload();
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Cart" />
      {cartItems.length > 0 ? (
        <div className="pb-20">
          <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
            <h2 className="col-span-2">Product</h2>
            <h2>Price</h2>
            <h2>Quantity</h2>
            <h2>Sub Total</h2>
          </div>
          <div className="mt-5">
            {cartItems.map((cartDetail) => (
              <div key={cartDetail.cartItemId}>
                <ItemCard cartDetail={cartDetail} />
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
          >
            Reset cart
          </button>

          <div className="max-w-7xl gap-4 flex justify-end mt-4">
            <div className="w-96 flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-right">Cart totals</h1>
              <div>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Subtotal
                  <span className="font-semibold tracking-wide font-titleFont">
                    {formatMoney(totalAmt)} VND
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Shipping Charge
                  <span className="font-semibold tracking-wide font-titleFont">
                    {formatMoney(shippingCharge)} VND
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
                  Total
                  <span className="font-bold tracking-wide text-lg font-titleFont">
                    {formatMoney(totalAmt + shippingCharge)} VND
                  </span>
                </p>
              </div>
              <div className="flex justify-end">
                <Link to="/paymentgateway">
                  <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div>
            <img
              className="w-80 rounded-lg p-4 mx-auto"
              src={emptyCart}
              alt="emptyCart"
            />
          </div>
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Your Cart feels lonely.
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Your Shopping cart lives to serve. Give it purpose - fill it up.
            </p>
            <Link to="/shop">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Continue Shopping
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
