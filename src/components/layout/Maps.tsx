"use client";
import Image from "next/image";
import React from "react";
import Map from "@/assets/mapa.svg";
import CustomButton from "../ui/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Loading from "./Loading";

const stop = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
];

const stopTitle = [
  "first_title",
  "second_title",
  "third_title",
  "fourth_title",
  "fifth_title",
  "sixth_title",
]

const Maps = () => {
  const { user } = useUser();
  const t = useTranslations("Map");
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => { 
    if (status === "unauthenticated") { 
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (!user) return <Loading />;

  const destination = stop[user?.POIsCompleted];
  const destinationTitle = stopTitle[user?.POIsCompleted];

  return (
    <div className="pb-20 px-3.5 bg-white min-h-[80vh]">
      <div className="flex justify-center">
        <Image src={Map} alt="Map" className="mt-[88px] w-[192px] h-[192px]" />
      </div>
      <h1 className="text-2xl font-bold text-center text-blue mt-[44px]">
        {t(destination)} {t("title1")}
      </h1>
      <h1 className="text-[36px] font-medium text-center text-lightblack mt-[10px] leading-8">
        {t(destinationTitle)}
      </h1>
      <div className="flex flex-col justify-center items-center mt-[14vh]">
        <CustomButton
          onClick={() => {
            router.push("/mapp");
          }}
        >
          {t("button")}
        </CustomButton>
      </div>
    </div>
  );
};

export default Maps;
