import React from "react";
import Brand from "./shopBy/Brand";
import Category from "./shopBy/Category";
import Price from "./shopBy/Price";
import Type from "./shopBy/Type";

const ShopSideNav = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Category icons={false} />
      <Type />
      <Brand />
      <Price />
    </div>
  );
};

export default ShopSideNav;
