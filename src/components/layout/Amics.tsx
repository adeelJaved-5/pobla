"use client";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useUser } from "@/context/UserContext";
import ModelViewer from "./ModelViewer";

import finding1 from "@/assets/finding1.png";
import finding2 from "@/assets/finding2.png";
import finding3 from "@/assets/finding3.png";
import finding4 from "@/assets/finding4.png";
import finding5 from "@/assets/finding5.png";
import finding6 from "@/assets/finding6.png";
import finding7 from "@/assets/finding1.png";
import finding8 from "@/assets/finding2.png";
import finding9 from "@/assets/finding3.png";
import finding10 from "@/assets/finding4.png";
import finding11 from "@/assets/finding5.png";
import finding12 from "@/assets/finding6.png";
import Coin from "@/assets/card3.png";

interface Finding {
  img: StaticImageData;
  model: string;
  altKey: string;
  zoom: "moreless" | "less" | "normal" | "large";
  rotation?: number[];
  position?: number[];
}

const Amics = () => {
  const t = useTranslations("Amics");
  const router = useRouter();
  const { status } = useSession();
  const { user } = useUser();
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [activeModelZoom, setActiveModelZoom] = useState<string | null>(
    "normal"
  );
  const [isLoading, setIsLoading] = useState(true);

  const getBaseUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return process.env.NEXTAUTH_URL || "http://localhost:3000";
  };

  const HOST = getBaseUrl();

  const findings: Finding[] = [
    {
      img: Coin,
      model: `${HOST}/models/1. chariot.glb`,
      altKey: "finding1",
      zoom: "normal",
      rotation: [0.3, Math.PI / 0.49, 0],
      position: [0, 0.7, 0],
    },
    {
      img: Coin,
      model: `${HOST}/models/2. oil lamp.glb`,
      altKey: "finding2",
      zoom: "normal",
      rotation: [0, Math.PI / 0.4, 0],
      position: [0, 0.7, 0],
    },
    {
      img: Coin,
      model: `${HOST}/models/3. amphora.glb`,
      altKey: "finding3",
      zoom: "normal",
      rotation: [0, Math.PI / 0.4, 0],
      position: [0.01, 0.7, 0],
    },
    {
      img: Coin,
      model: `${HOST}/models/4. wheel noria.glb`,
      altKey: "finding4",
      zoom: "normal",
      rotation: [0, Math.PI / 0.39, 0],
      position: [0, 0.7, 0],
    },
    {
      img: Coin,
      model: `${HOST}/models/5. arabic carpet.glb`,
      altKey: "finding5",
      zoom: "normal",
      rotation: [1.5, Math.PI / 0.67, 0],
      position: [0, 0.7, 0],
    },
    {
      img: Coin,
      model: `${HOST}/models/6. arabic parchment.glb`,
      altKey: "finding6",
      zoom: "normal",
      rotation: [0, Math.PI / 0.65, 0],
      position: [0.01, 0.7, 0],
    },
    {
      img: Coin,
      model: `${HOST}/models/7. medieval sword.glb`,
      altKey: "finding7",
      zoom: "normal",
      rotation: [0, Math.PI / 0.4, 0],
      position: [0.02, 0.7, 0],
    },
    {
      img: Coin,
      model: `${HOST}/models/8. royal throne.glb`,
      altKey: "finding8",
      zoom: "normal",
      rotation: [0, Math.PI / 0.65, 0],
      position: [0.015, 0.7, 0],
    },
    {
      img: Coin,
      model: `${HOST}/models/9. butcher knive.glb`,
      altKey: "finding9",
      zoom: "normal",
      position: [0, 0.7, 0],
    },
    {
      img: Coin,
      model: `${HOST}/models/10. water tower.glb`,
      altKey: "finding10",
      zoom: "normal",
      rotation: [0, Math.PI / 0.9, 0],
      position: [0.01, 0.7, 0],
    },
    {
      img: Coin,
      model: `${HOST}/models/11. old book.glb`,
      altKey: "finding11",
      zoom: "normal",
      rotation: [0, Math.PI / 0.5, 0],
      position: [0.04, 0.7, 0],
    },
    {
      img: Coin,
      model: `${HOST}/models/12. roman coins.glb`,
      altKey: "finding12",
      zoom: "normal",
      rotation: [0, Math.PI / 0.8, 0],
      position: [0.05, 0.7, 0],
    },
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (user) {
      setUnlockedCount(user.POIsCompleted);
    }
  }, [user]);

  const handleClick = (index: number) => {
    if (index < unlockedCount) {
      setActiveModel(findings[index].model);
      setActiveModelZoom(findings[index].zoom);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lightgreen"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex flex-col items-center bg-white pb-10 md:pb-32">
      <div className="gradient-bg border-t-2 border-[#550A02] border-b-2 w-full flex h-24 md:h-28 items-center justify-center">
        <h1 className="text-2xl md:text-3xl font-semibold text-white text-center">
          {t("title")}
        </h1>
      </div>

      <div className="mt-8 w-full max-w-4xl pb-10">
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-5 md:gap-6 w-full px-5 md:px-0 justify-items-center">
          {findings.map((item, index) => {
            const isUnlocked = index < unlockedCount;
            return (
              <div
                key={index}
                className="w-[170px] h-[170px] rounded-[12px]"
                style={{
                  backgroundImage: "url(/bg.svg)",
                  backgroundSize: "cover",
                }}
              >
                <div
                  className={`relative aspect-square transition-all duration-300 ${
                    !isUnlocked
                      ? "opacity-50"
                      : "hover:scale-105 cursor-pointer"
                  }`}
                >
                  <button
                    onClick={() => handleClick(index)}
                    disabled={!isUnlocked}
                    className="w-full h-full"
                  >
                    <Image
                      src={item.img}
                      alt="img"
                      className="object-cover w-[89px] h-[96px] mx-auto gradient2-bg rounded-full p-2"
                    />

                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ModelViewer
        modelPath={activeModel || ""}
        rotation={
          (findings.find((f) => f.model === activeModel)?.rotation || [
            0, 0, 0,
          ]) as [number, number, number]
        }
        position={
          (findings.find((f) => f.model === activeModel)?.position || [
            0, 0, 0,
          ]) as [number, number, number]
        }
        isOpen={!!activeModel}
        onClose={() => setActiveModel(null)}
        zoomMode={
          (activeModelZoom as "normal" | "moreless" | "less" | "large") ??
          "normal"
        }
      />
    </div>
  );
};

export default Amics;
