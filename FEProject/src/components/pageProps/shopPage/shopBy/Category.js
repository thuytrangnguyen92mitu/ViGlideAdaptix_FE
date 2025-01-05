import React, { useState, useEffect } from "react";
import NavTitle from "./NavTitle";
import axiosInstance from "../../../../utils/axiosInstance";

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("product/category", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        setCategories(response.data); // Assuming the API returns an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full">
      <NavTitle title="Shop by Category" icons={false} />
      <div className="cursor-pointer">
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {categories.map(({ categoryId, categoryName }) => (
            <li
              key={categoryId}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between"
            >
              {categoryName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;
