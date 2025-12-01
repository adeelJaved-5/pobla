"use client";
import { useState } from "react";
import { POIs, POI } from "@/utils/location";
import { useUser } from "@/context/UserContext";

export default function SelectInput({
  onSelect,
}: {
  onSelect: (poi: POI) => void;
}) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  if (!user) return false;
  const selected = POIs[user?.POIsCompleted];


  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full border border-[#8B5E3C] rounded-md overflow-hidden focus:outline-none"
      >
        <p className="text-left px-3 py-2">
          {selected
            ? `${selected.name} (${selected.lat}, ${selected.lng})`
            : "Select an option"}
        </p>
        <span className="bg-[#8B5E3C] px-3 py-2 text-white">▼</span>
      </button>

      {open && POIs.length > 0 && (
        <ul className="absolute mt-1 w-full bg-white border border-[#8B5E3C]z rounded-md shadow-lg z-10">
          {POIs.map((opt) => {
            const isSelectable = opt.id == user?.POIsCompleted;

            return (
              <li
                key={opt.id}
                onClick={() => {
                  if (!isSelectable) return;
                  setOpen(false);
                  onSelect(opt);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-[#8B5E3C]/10 ${!isSelectable ? "text-gray-400 cursor-not-allowed" : ""
                  }`}
              >
                <div className="font-medium">{opt.name}</div>
                <div className="text-xs">
                  ({opt.lat}, {opt.lng})
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
