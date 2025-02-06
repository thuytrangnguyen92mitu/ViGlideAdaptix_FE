import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { logoLight } from "../../assets/images";
import axiosInstance from "../../utils/axiosInstance";

const UpdateProfile = () => {
  // ============= Initial State Start here =============
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [address, setAddress] = useState("");

  const customer = JSON.parse(localStorage.getItem("loggedInUser"));
  const customerId = customer.customerId;

  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  // ============= Initial State End here ===============
  // ============= Error Msg Start here =================
  const [errcustomerName, setErrCustomerName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPhone, setErrPhone] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errConfPassword, setErrConfPassword] = useState("");
  const [errAddress, setErrAddress] = useState("");
  const navigate = useNavigate();
  // ============= Error Msg End here ===================
  const [successMsg, setSuccessMsg] = useState("");
  // ============= Event Handler Start here =============
  useEffect(() => {
    if (customerId) {
      axiosInstance
        .post(`customer/profile/${customerId}`)
        .then((response) => {
          const data = response.data;
          setFormData({
            customerName: data.customerName,
            address: data.address,
            email: data.email,
            password: data.password,
            confirmPassword: "",
            phoneNumber: data.phoneNumber,
          });
          setPassword(data.password);
        })
        .catch((error) => {
          console.error("There was an error fetching the user data!", error);
          alert("There was an error fetching the user data.");
        });
    }
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ============= Event Handler End here ===============
  // ================= Email Validation start here =============
  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
  };

  // ================= Email Validation End here ===============

  const handelUpdate = async (e) => {
    e.preventDefault();

    if (!formData.customerName) {
      setErrCustomerName("Enter your name");
    }
    if (!formData.email) {
      setErrEmail("Enter your email");
    } else {
      if (!EmailValidation(formData.email)) {
        setErrEmail("Enter a Valid email");
      }
    }

    if (!formData.phoneNumber) {
      setErrPhone("Enter your phone number");
    }
    if (!formData.password) {
      setErrPassword("Enter your new password");
    }
    if (!formData.confirmPassword) {
      setErrPassword("Enter your confirm password");
    }
    if (!(formData.password === formData.confirmPassword)) {
      setErrPassword("Mismatch confirm password");
    }
    if (!formData.address) {
      setErrAddress("Enter your address");
    }
    // ============== Getting the value ==============
    const updateData = {
      customerId: customerId,
      customerName: formData.customerName,
      address: formData.address,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
    };

    try {
      const response = await axiosInstance.post(
        "customer/profile",
        {
          customerId: updateData.customerId,
          customerName: updateData.customerName,
          password: updateData.password,
          address: updateData.address,
          phoneNumber: updateData.phoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.status === 200) {
        setSuccessMsg("Update successfully");
        alert("Updated successfully.");

        navigate("/");
      }
    } catch (error) {
      alert("Updated fail");
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-start">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <img src={logoLight} alt="logoImg" className="w-28" />
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">
              Stay sign in for more
            </h1>
            <p className="text-base">When you sign in, you are with us!</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Get started fast with ViGlideAdaptix
              </span>
              <br />
              Sign up today to explore our AI-integrated suspension systems that
              enhance your driving comfort and performance.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Access all our services
              </span>
              <br />
              Create an account to unlock exclusive benefits, accumulate reward
              points, and receive early notifications on special promotions and
              offers tailored just for you!
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Trusted by online Shoppers
              </span>
              <br />
              Join thousands of satisfied customers who trust ViGlideAdaptix for
              innovative suspension solutions and enjoy a smooth, secure
              shopping experience.
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <Link to="/">
              <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
                © VIGLIDEADAPTIX
              </p>
            </Link>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Terms
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Privacy
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Security
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lgl:w-1/2 h-full">
        <form className="w-full lgl:w-[500px] h-screen flex items-center justify-center">
          <div className="px-6 py-4 w-full h-[96%] flex flex-col justify-start overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
            <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-2xl mdl:text-3xl mb-4">
              Your account information
            </h1>
            <div className="flex flex-col gap-3">
              {/* client name */}
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Full Name
                </p>
                <input
                  name="customerName"
                  id="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="text"
                  placeholder="e.g viglideadaptix"
                />
                {errcustomerName && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errcustomerName}
                  </p>
                )}
              </div>
              {/* Email */}
              <div className="flex flex-col gap-.5">
                <p
                  readOnly
                  className="font-titleFont text-base font-semibold text-gray-600"
                >
                  Email
                </p>
                <input
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="email"
                  placeholder="viglideadaptix@gmail.com"
                />
                {errEmail && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errEmail}
                  </p>
                )}
              </div>
              {/* Phone Number */}
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Phone Number
                </p>
                <input
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="text"
                  placeholder="0797979799"
                />
                {errPhone && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errPhone}
                  </p>
                )}
              </div>
              {/* Password */}
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Password
                </p>
                <input
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="password"
                  placeholder="Your password here"
                />
                {errPassword && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errPassword}
                  </p>
                )}
              </div>
              {/* ConfirmPassword */}
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Confirm Password
                </p>
                <input
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={formData.password === password} // Disable unless password is changed
                  className={`w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] ${
                    formData.password === password
                      ? "bg-gray-200 cursor-not-allowed"
                      : "border-gray-400"
                  } outline-none`}
                  type="password"
                  placeholder="Confirm password here"
                />
                {errPassword && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errPassword}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Address
                </p>
                <input
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="text"
                  placeholder="123A Q1, HCM"
                />
                {errAddress && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errAddress}
                  </p>
                )}
              </div>

              <button
                onClick={handelUpdate}
                className={`bg-gray-500 text-gray-400 hover:bg-gray-900 hover:text-white-400 cursor-pointer w-full text-gray-200 text-base font-medium h-10 rounded-md hover:text-white duration-300`}
              >
                Update Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
