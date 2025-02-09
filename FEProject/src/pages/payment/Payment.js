import React, { useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import axiosInstance from "../../utils/axiosInstance";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

const Payment = () => {
  const location = useLocation();
  const { formData } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false); // Track payment process state
  const dispatch = useDispatch();
  const paymentOptions = [
    {
      id: 1,
      name: "MoMo Wallet",
      description: "Fast and secure payment with MoMo.",
      action: "momo",
      bgColor: "bg-red-500",
    },
    {
      id: 2,
      name: "VNPay",
      description: "Convenient payment with VNPay.",
      action: "vnpay",
      bgColor: "bg-green-500",
    },
    {
      id: 3,
      name: "COD",
      description: "Pay after successful shipping.",
      action: "cod",
      bgColor: "bg-blue-500",
    },
  ];

  const [cartDetails, setCartDetails] = useState([]);
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
      const cartItems = response.data.cart.cartItemsList;
      setCartDetails(cartItems);
      setCartCount(cartItems.length);
    } catch (error) {
      console.error("Error fetching updated cart:", error);
    }
  };

  const confirmOrder = async (orderId) => {
    try {
      const response = await axiosInstance.post(`order/confirm/${orderId}`);
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  const handlePaymentClick = async (action) => {
    if (isProcessing) return; // Prevent multiple clicks
    setIsProcessing(true);

    try {
      const checkoutResponse = await axiosInstance.post("cart/checkout", {
        cartId: formData.cartId,
        customerId: formData.customerId,
        paymentMethodId: 2,
      });

      const { newCartId, orderId } = checkoutResponse.data;

      await confirmOrder(orderId);

      // Save new cartId in localStorage
      let user = JSON.parse(localStorage.getItem("loggedInUser"));
       user.cartId = newCartId;
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      window.dispatchEvent(new Event("updateCart"));

      if (action === "momo") {
        const paymentRequest = {
          method: "momo",
          amount: formData.totalPrice,
          extraData: "Order from ViGlide Adaptix",
          orderInfo: `Order for ${formData.customerName}`,
          clientIp: "",
        };

        const response = await axiosInstance.post(
          `https://localhost:7255/api/payments/momo/create`,
          paymentRequest
        );

        if (response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        }
      } else if (action === "vnpay") {
        // First, retrieve the public IP address
        const ipResponse = await fetch("https://checkip.amazonaws.com");
        const publicIp = (await ipResponse.text()).trim(); // Extract the IP address from the response
        console.log(publicIp);

        const paymentRequest = {
          method: "vnpay",
          amount: formData.totalPrice,
          extraData: "Order_from_ViGlideAdaptix",
          orderInfo: `Order_for_${formData.customerName}`,
          clientIp: publicIp,
        };

        console.log(paymentRequest);
        const response = await axiosInstance.post(
          `https://localhost:7255/api/payments/vnpay/create`,
          paymentRequest
        );

        if (response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        }
      } else {
        alert(
          `Payment option "${action}" is not implemented yet. Try again later`
        );
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs title="Payment Gateway" />

      <div className="pb-10 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Choose Your Payment Method
        </h1>
        <p className="text-gray-600 mb-8">
          Select a payment option below to proceed with your transaction.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paymentOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handlePaymentClick(option.action)}
              className={`cursor-pointer p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 ${option.bgColor} text-white`}
            >
              <h2 className="text-xl font-bold mb-2">{option.name}</h2>
              <p className="text-sm">{option.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link to="/cart">
            <button className="w-52 h-10 bg-gray-800 text-white text-lg hover:bg-gray-600 transition-colors">
              Go back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Payment;
