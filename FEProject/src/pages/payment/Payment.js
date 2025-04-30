import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";

const Payment = () => {
  const location = useLocation();
  const { formData } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);
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

  // (Optional) Local state if you need to show cart details here
  // (Not used in this example.)
  const [cartDetails, setCartDetails] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const confirmOrder = async (orderId) => {
    try {
      await axiosInstance.post(`order/confirm/${orderId}`);
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  const handlePaymentClick = async (action) => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (action === "cod") {
      alert(
        `Payment option "${action}" is not implemented yet. Try again later`
      );
      setIsProcessing(false);
      return;
    }

    try {
      // Call checkout API which returns a new cart ID and order ID.
      const checkoutResponse = await axiosInstance.post("cart/checkout", {
        cartId: formData.cartId,
        customerId: formData.customerId,
        paymentMethodId: 2,
      });

      const { newCartId, orderId } = checkoutResponse.data;
      console.log("Checkout response:", checkoutResponse.data);

      await confirmOrder(orderId);

      // Update the user's cartId in localStorage.
      let user = JSON.parse(localStorage.getItem("loggedInUser"));
      console.log("Old user data:", user);
      user.cartId = newCartId;
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      console.log("New user data:", user);

      // Dispatch a custom event so that any mounted components know about the update.
      window.dispatchEvent(new Event("updateCart"));

      // Introduce a small delay (100ms) before redirecting
      const redirectToPayment = (url) => {
        setTimeout(() => {
          window.location.href = url;
        }, 100);
      };

      // Redirect to the external payment service.
      if (action === "momo") {
        const paymentRequest = {
          method: "momo",
          amount: formData.totalPrice,
          extraData: "Order from ViGlide Adaptix",
          orderInfo: `Order for ${formData.customerName}`,
          clientIp: "",
        };
        const response = await axiosInstance.post(
          "https://localhost:7255/api/payments/momo/create",
          paymentRequest
        );
        console.log("MoMo response:", response.data);
        if (response.data.paymentUrl) {
          redirectToPayment(response.data.paymentUrl);
        }
      } else if (action === "vnpay") {
        // Retrieve public IP for VNPay.
        const ipResponse = await fetch("https://checkip.amazonaws.com");
        const publicIp = (await ipResponse.text()).trim();
        const paymentRequest = {
          method: "vnpay",
          amount: formData.totalPrice,
          extraData: "Order_from_ViGlideAdaptix",
          orderInfo: `Order_for_${formData.customerName}`,
          clientIp: publicIp,
        };
        const response = await axiosInstance.post(
          "https://localhost:7255/api/payments/vnpay/create",
          paymentRequest
        );
        console.log("VNPay response:", response.data);
        if (response.data.paymentUrl) {
          redirectToPayment(response.data.paymentUrl);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
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
