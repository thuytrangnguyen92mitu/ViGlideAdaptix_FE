import React, { useState, useEffect } from "react";
import NavTitle from "./NavTitle";
import axiosInstance from "../../../../utils/axiosInstance";

const Brand = ({ onBrandSelect }) => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);

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

  const handleBrandClick = (brandId) => {
    if (selectedBrand === brandId) {
      setSelectedBrand(null); // Deselect if already selected
      onBrandSelect(null); // Notify parent that no brand is selected
    } else {
      setSelectedBrand(brandId); // Select new brand
      onBrandSelect(brandId); // Pass selected brand ID to parent
    }
  };

  return (
    <div>
      <div className="cursor-pointer">
        <NavTitle title="Shop by Brand" />
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {brands.map((item) => (
            <li
              key={item.brandId}
              onClick={() => handleBrandClick(item.brandId)}
              className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 ${
                selectedBrand === item.brandId
                  ? "font-bold text-black"
                  : "hover:text-primeColor hover:border-gray-400 duration-300"
              }`}
            >
              {item.brandName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Brand;
