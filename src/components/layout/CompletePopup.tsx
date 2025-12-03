"use client";
import { useTranslations } from "next-intl";
import CustomButton from "../ui/Button";
import { useRouter } from "next/navigation";
import ChatTalk from "@/assets/chat_talk.png";
import Image from "next/image";

const CompletePopup = ({ handleClose }: { handleClose: () => void }) => {
  const router = useRouter();
  const t = useTranslations("Dashboard");

  return (
    <div
      className={`fixed inset-0 p-4 flex flex-col items-end justify-end bg-black/70 z-50`}
    >
      <div className="relative w-full max-w-md bg-[#F5F3ED] rounded-2xl shadow-2xl p-3">
        <div className="space-y-4 flex flex-col">
          <div className="space-y-2">
            <h2 className="text-lg text-center">{t("complete1")}</h2>
            <h2 className="text-lg font-bold text-center">{t("complete2")}</h2>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <CustomButton onClick={handleClose} className="rounded-xl">
              {t("keep_playing")}
            </CustomButton>
          </div>
        </div>
        <div className="w-[90px] h-[90px] absolute bottom-[-90px] right-50">
          <Image src={ChatTalk} alt="Chat icon" width={90} height={90} />
        </div>
      </div>
      <div className="flex justify-center">
        <img
          src="/intro.gif"
          alt="Intro Gif"
          className="w-[230px] rounded-lg"
        />
      </div>
    </div>
  );
};

export default CompletePopup;
