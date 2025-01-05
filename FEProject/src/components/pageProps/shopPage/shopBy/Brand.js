import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";
import axiosInstance from "../../../../utils/axiosInstance";

const Brand = () => {
  const [brands, setBrands] = useState([]); // Fixed syntax: removed the extra `]`
  const [showBrands, setShowBrands] = useState(false); // Added state for toggling brand visibility

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axiosInstance.get("product/brand", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div>
      <div
        // onClick={() => setShowBrands(!showBrands)}
        className="cursor-pointer"
      >
        <NavTitle title="Shop by Brand" />
        {/* {showBrands && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          > */}
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {brands.map((item) => (
            <li
              key={item.brandId}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
            >
              {item.brandName}
            </li>
          ))}
        </ul>
        {/* </motion.div> */}
        {/* )} */}
      </div>
    </div>
  );
};

export default Brand;
