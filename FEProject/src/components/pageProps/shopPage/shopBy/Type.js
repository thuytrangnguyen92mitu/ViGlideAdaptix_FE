import React, { useState } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";

const Type = () => {
  const [showTypes, setShowTypes] = useState(true);

  const types = [
    {
      _id: 9001,
      title: "Adaptive Damping System",
    },
    {
      _id: 9002,
      title: "Pneumatic Shock Absorber",
    },
    {
      _id: 9003,
      title: "Magnetic Shock Absorber",
    },
    {
      _id: 9004,
      title: "Electronic Shock Absorber",
    },
  ];

  return (
    <div>
      <div
        onClick={() => setShowTypes(!showTypes)}
        className="cursor-pointer"
      >
        <NavTitle title="Shop by Types" icons={true} />
      </div>
      {showTypes && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
         <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {types.map((type) => (
              <li
                key={type._id}
                className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
              >
                <span className="font-normal">{type.title}</span> {/* Tắt in đậm */}
                <p className="text-xs lg:text-sm text-[#555555]">
                  {type.description}
                </p>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Type;
