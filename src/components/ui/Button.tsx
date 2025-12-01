"use client";
import React from "react";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`bg-gradient-to-b from-[#F2B427] to-[#D67D05] border-3 border-[#550A02] border-b-10 rounded-[32px] text-[20px] text-[#FFF6D8] font-semibold py-2 max-w-[499px] w-full hover:cursor-pointer px-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
