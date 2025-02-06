import React from "react";
import Brand from "./shopBy/Brand";
import Category from "./shopBy/Category";
import Price from "./shopBy/Price";

const ShopSideNav = ({ onCategorySelect, onBrandSelect }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Category onCategorySelect={onCategorySelect} />
      <Brand onBrandSelect={onBrandSelect} />
    </div>
  );
};

export default ShopSideNav;
