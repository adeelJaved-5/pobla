"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import checkplus from "@/assets/checkplus.svg";
import checkminus from "@/assets/checkminus.svg";
import CustomButton from "../ui/Button";
import { useTranslations } from "next-intl";

const Faqs = () => {
  const t = useTranslations("FAQS");
  const [activeTab, setActiveTab] = useState("ar");
  const [openQuestions, setOpenQuestions] = useState<{
    [key: string]: boolean;
  }>({});

  const faqKeys = Object.keys(t.raw(`${activeTab}`) as Record<string, unknown>);

  const questions = faqKeys
    .filter((key) => key.startsWith("q"))
    .map((qKey) => {
      const num = qKey.replace("q", "");
      const question = t(`${activeTab}.q${num}`);
      const answer = t(`${activeTab}.a${num}`);
      return { id: `q${num}`, question, answer };
    });

  const toggleQuestion = (id: string) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const savedTab = localStorage.getItem("faqsActiveTab");
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    localStorage.setItem("faqsActiveTab", activeTab);
  }, [activeTab]);

  return (
    <div className="flex flex-col justify-center items-center pb-[51px] bg-white">
      <div className="gradient-bg w-full flex h-[100px] items-center justify-center border-t-2 border-[#550A02] border-b-2">
        <h1 className="text-[26px] font-semibold text-lightskin text-center">
          {t("title")}
        </h1>
      </div>
      <div className="flex w-full">
        <CustomButton
          className={`rounded-none border-none bg-none text-lightblack ${
            activeTab === "ar" ? "gradient-bg text-lightskin" : "bg-[#F7F7F7]"
          }`}
          onClick={() => setActiveTab("ar")}
        >
          {t("button1")}
        </CustomButton>
        <CustomButton
          className={`rounded-none border-none bg-none text-lightblack ${
            activeTab === "game" ? "gradient-bg text-lightskin" : "bg-[#F7F7F7]"
          }`}
          onClick={() => setActiveTab("game")}
        >
          {t("button2")}
        </CustomButton>
        <CustomButton
          className={`rounded-none border-none bg-none text-lightblack ${
            activeTab === "map" ? "gradient-bg text-lightskin" : "bg-[#F7F7F7]"
          }`}
          onClick={() => setActiveTab("map")}
        >
          {t("button3")}
        </CustomButton>
      </div>
      <div className="mt-[49px] flex flex-col w-full">
        {questions.map(({ id, question, answer }) => (
          <div key={id}>
            <div
              className="flex gap-[15px] cursor-pointer items-center px-[27px]"
              onClick={() => toggleQuestion(id)}
            >
              <Image
                src={openQuestions[id] ? checkminus : checkplus}
                alt="toggle"
              />
              <h1 className="text-lightblack text-[22px] font-bold">{question}</h1>
            </div>
            {openQuestions[id] && (
              <p className="text-lightblack mt-[15px] whitespace-pre-line px-[27px]">
                {answer}
              </p>
            )}
            <div className="border-1 border-border w-full my-5"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;
