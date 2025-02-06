import React, { useState, useEffect } from "react";
import NavTitle from "./NavTitle";
import axiosInstance from "../../../../utils/axiosInstance";

const Category = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("product/category", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null); // Deselect if already selected
      onCategorySelect(null); // Notify parent that no category is selected
    } else {
      setSelectedCategory(categoryId); // Select new category
      onCategorySelect(categoryId); // Pass selected category ID to parent
    }
  };

  return (
    <div className="w-full">
      <NavTitle title="Shop by Category" icons={false} />
      <div className="cursor-pointer">
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {categories.map(({ categoryId, categoryName }) => (
            <li
              key={categoryId}
              onClick={() => handleCategoryClick(categoryId)}
              className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between ${
                selectedCategory === categoryId
                  ? "font-bold text-black"
                  : "hover:text-primeColor hover:border-gray-400 duration-300"
              }`}
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
