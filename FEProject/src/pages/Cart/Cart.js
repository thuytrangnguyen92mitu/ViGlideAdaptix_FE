import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { emptyCart } from "../../assets/images/index";
import ItemCard from "./ItemCard";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Cart = () => {
  const dispatch = useDispatch();
  const [cartDetails, setCartDetails] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [totalAmt, setTotalAmt] = useState(0);
  const [finalTotal, setfinalTotal] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    cartId: "",
    address: "",
    email: "",
    phoneNumber: "",
    totalPrice: 0, // Initialize with 0
  });

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

          // Update formData with customerId and cartId
          setFormData((prev) => ({
            ...prev,
            customerId: user.customerId,
            cartId: user.cartId,
          }));

          // Fetch user profile
          const profileResponse = await axiosInstance.post(
            `customer/profile/${user.customerId}`
          );

          if (profileResponse.data) {
            setFormData((prev) => ({
              ...prev,
              customerName: profileResponse.data.customerName || "",
              address: profileResponse.data.address || "",
              email: profileResponse.data.email || "",
              phoneNumber: profileResponse.data.phoneNumber || "",
            }));
          }
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
    const shipping =
      total <= 10000000 ? 300000 : total <= 30000000 ? 500000 : 1000000;
    setShippingCharge(shipping);
    setfinalTotal(total + shipping); // This updates asynchronously
  };

  // Update formData.totalPrice whenever finalTotal changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, totalPrice: finalTotal }));
  }, [finalTotal]);

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
        navigate(0);
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

          <div className="max-w-7xl grid grid-cols-1 lgl:grid-cols-2 gap-8 mt-4">
            <div className="w-full flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-left">
                Shipping Info
              </h1>
              <div>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Customer Name
                  <span className="font-semibold ">
                    <input
                      type="text"
                      value={formData.customerName}
                      className="w-full text-right border border-gray-400 focus:border-primeColor focus:ring-2 focus:ring-primeColor  px-2 py-1 outline-none mx-4"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerName: e.target.value,
                        })
                      }
                    />
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Phone
                  <span className="font-semibold">
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      className="w-full text-right border border-gray-400 focus:border-primeColor focus:ring-2 focus:ring-primeColor  px-2 py-1 outline-none mx-4"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
                  Address
                  <span className="font-semibold">
                    <input
                      type="text"
                      value={formData.address}
                      className="w-full text-right border border-gray-400 focus:border-primeColor focus:ring-2 focus:ring-primeColor  px-2 py-1 outline-none mx-4"
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </span>
                </p>
              </div>
            </div>

            <div className="w-full flex flex-col gap-4">
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
                    {formatMoney(finalTotal)} VND
                  </span>
                </p>
              </div>
              <div className="flex justify-end">
                <Link
                  to="/paymentgateway"
                  state={{ formData }} // Passing formData as state
                >
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
          className="w-full h-96 flex flex-col justify-center items-center gap-5"
        >
          <img className="w-40" src={emptyCart} alt="empty cart" />
          {/* <h1 className="text-xl text-center font-semibold">
            Your cart is currently empty
          </h1> */}
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Your Cart feels lonely.
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Your Shopping cart lives to serve. Give it purpose - fill it with
              products and make it happy.
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
