import Header from "@/components/layout/Header";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import Quiz from "@/components/layout/Quiz";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="desktop:max-w-[400px] tablet:w-full mobile:w-full">
        <Header />
        <Quiz />
      </div>
    </div>
  );
};

export default page;
