"use client";
import Image from "next/image";
import React from "react";
import Logo from "@/assets/04 1.jpg"
import Magma from "@/assets/magma.png";
import CustomButton from "../ui/Button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const StartQuiz = () => {
  const router = useRouter();
    const t = useTranslations("StartQuiz");
  
  return (
    <div className="flex flex-col justify-center items-center pb-[23px] bg-white">
      <div>
        <Image src={Logo} alt="Logo" width={430} height={242}/>
      </div>
      <div className="mt-[57px]">
        <Image src={Magma} alt="Logo" width={128} height={128}/>
      </div>
      <h1 className="text-primary mt-[29px] text-2xl font-bold">{t("title")}</h1>
      <p className="text-secondary text-center mt-[18px] px-[32px]">
        {t("description")}
      </p>
      <div className="flex flex-col w-full px-[15px]">
        <CustomButton
          className="mt-24 w-full"
          onClick={() => {
            router.push("/quiz1");
          }} 
        >
          {t("button1")}
        </CustomButton>
      </div>
    </div>
  );
};

export default StartQuiz;
