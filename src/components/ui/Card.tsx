"use client";
import React from "react";

interface PrimaryBoxProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<PrimaryBoxProps> = ({ children, className = "", onClick }) => {
  return (
    <div
      className={`border-2 border-[#962000] rounded-[12px] w-[120px] h-[152px] 
        flex flex-col gap-4 items-center justify-center bg-[#FEF7EF] cursor-pointer
         hover:bg-skin px-2 py-2 text-center relative overflow-hidden ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;