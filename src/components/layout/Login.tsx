"use client";
import React from "react";
import Image from "next/image";
import Logo from "@/assets/logo_EACB.png";
import Logo1 from "@/assets/tactica 1.jpg";
import Logo2 from "@/assets/logo_som_experiencies 3.png";
import { useRouter } from "next/navigation";
import CustomButton from "../ui/Button";
import { useTranslations } from "next-intl";



const Login = () => {
  const router = useRouter();
  const t = useTranslations("Login");
  return (
    <div className="flex flex-col items-center py-6 px-4 min-h-screen">
      <div className="desktop:max-w-[400px] tablet:w-full mobile:w-full">
        <div className="flex justify-center">
          <Image src={Logo} alt="Logo" width={277} height={233} />
        </div>
        <div className="mt-[21px]">
          <Image
            src={Logo1}
            alt="Logo1"
            width={399}
            height={399}
            className="rounded-lg"
            priority
          />
        </div>
        <div className="flex flex-col mt-[21px] gap-4">
          <CustomButton onClick={() => router.push("/dashboard")}>
            {t("button1")}
          </CustomButton>
          <CustomButton
            className="bg-secondary"
            onClick={() => router.push("/register")}
          >
            {t("button2")}
          </CustomButton>
          
        </div>
        <div className="flex justify-center mt-8">
          <Image src={Logo2} alt="Logo2" width={118} height={63} />z
        </div>
      </div>
    </div>
  );
};

export default Login;
