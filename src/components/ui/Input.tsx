"use client";
import React from "react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string; 
}

const CustomInput: React.FC<CustomInputProps> = ({
  className = "",
  type = "text",
  ...props
}) => {
  return (
    <input
      type={type}
      className={`border-2 border-[#B6B3B9] rounded-[24px] bg-white px-3 py-2 
        text-base focus:outline-none w-full ${className}`}
      {...props}
    />
  );
};

export default CustomInput;
