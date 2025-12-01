"use client";
import React from "react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const CustomPhoneInput: React.FC<CustomInputProps> = ({
  className = "",
  ...props
}) => {
  return (
    <div className="flex border-2 border-[#B6B3B9] rounded-[24px] overflow-hidden w-full bg-white">
      <div className="bg-[#F5F2F8] flex items-center justify-center px-3 border-r-2 border-[#B6B3B9]">
        <span className="text- text-xs">▼</span>
      </div>

      <input
        type="text"
        className={`flex-1 px-3 py-2 text-base outline-none ${className}`}
        {...props}
      />
    </div>
  );
};

export default CustomPhoneInput;
