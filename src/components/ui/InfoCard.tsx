import React from "react";
import { createRoot } from "react-dom/client";
import Image from "next/image";
import place_img from "@/assets/image 9.png";
import car from "@/assets/direction-car.png";
import walk from "@/assets/direction-walk.png";
import location from "@/assets/location.png"


// Define props type
interface InfoCardProps {
  title: string;
  subtitle: string;
  onModeSelect?: (mode: "walking" | "driving") => void;
}

export const createInfoCard = ({ title, subtitle, onModeSelect }: InfoCardProps) => {
  const el = document.createElement("div");
  const root = createRoot(el);

  root.render(
    <div className="w-40 relative">
      

      <div className="flex justify-center">
        <Image
          src={location}
          alt="place"
          className="w-[80px] h-[80px] rounded-full object-cover"
        />
      </div>

      <h2 className="text-center text-gray-700 font-medium mt-3">
        {title} <br /> {subtitle}
      </h2>

      <div className="flex justify-center gap-8 mt-4">
        <Image
          src={walk}
          alt="walking"
          className="w-[32px] h-[32px] cursor-pointer"
          onClick={() => onModeSelect?.("walking")}
        />
        <Image
          src={car}
          alt="driving"
          className="w-[32px] h-[32px] cursor-pointer"
          onClick={() => onModeSelect?.("driving")}
        />
      </div>

    </div>
  );

  return el;
};
