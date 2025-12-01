"use client";

import { useState, useRef, useEffect } from "react";
import CustomButton from "../ui/Button";
import { useTranslations, useLocale } from "next-intl";
import ARView from "./ARView";
import ChatTalk from "@/assets/chat_talk.png";
import Image from "next/image";

const Intro = ({ handleClose }: { handleClose: () => void }) => {
    const locale = useLocale();
    const t = useTranslations("intro");
    const steps = [
        {
            title: t("title1"),
            // text: t("text1"),
            buttons: [t("button1"), t("button2")],
        },
        {
            title: t("title2"),
            // text: t("text2"),
            buttons: [t("button1"), t("button3")],
        },
        // {
        //     title: t("title3"),
        //     text: t("text3"),
        //     buttons: [t("button1"), t("button3")],
        // },
    ];

    const [stepIndex, setStepIndex] = useState(0);
    const [showARView, setShowARView] = useState(false);

    const { title, buttons } = steps[stepIndex];

    const handleAction = (label: string) => {
        if (label === t("button1")) {
            handleClose();
            return;
        }

        if (label === t("button3") && stepIndex === steps.length - 1) {
            setShowARView(true);
            return;
        }

        if (stepIndex < steps.length - 1) {
            setStepIndex((prev) => prev + 1);
        } else {
            handleClose();
        }
    };

    return (
        <div className={`fixed inset-0 p-4 flex flex-col ${showARView ? "items-center justify-center" : "items-end justify-end"} bg-black/70 z-50`}>
            {!showARView ? (
                <>
                    <div className="relative w-full max-w-md bg-[#F5F3ED] rounded-2xl shadow-2xl p-3">
                        <div className="space-y-4 flex flex-col">
                            {/* Title + text */}
                            <div className="space-y-2">
                                <h2 className="text-lg font-bold text-center">{title}</h2>
                                {/* <p className="text-sm text-gray-700 text-center">{text}</p> */}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-center gap-3 pt-2">
                                {buttons.map((label, idx) => (
                                    <CustomButton
                                        key={idx}
                                        onClick={() => handleAction(label)}
                                        className="rounded-xl"
                                    >
                                        {label}
                                    </CustomButton>
                                ))}
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
                            className="w-[150px] rounded-lg"
                        />
                    </div>
                </>
            ) : (
                <ARView setShowARView={setShowARView} handleClose={handleClose} audioUrl={`/audios/${["en", "fr", "es", "ca"].includes(locale) ? locale : "en"}/intro.mp3`} linkLoad={true} from="intro" />
            )}
        </div>
    );
};

export default Intro;