"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import CustomButton from "../ui/Button";
import Image from "next/image";
import Logo from "@/assets/logo_EACB.png";
import { useLocale, useTranslations } from "next-intl";


export default function VerifyEmail() {
    const locale = useLocale();
    const t = useTranslations("Verify Email");

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(60);

    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");

    const handleChange = (index: number, value: string) => {
        const digit = value.replace(/[^0-9]/g, "");
        const newCode = [...code];
        newCode[index] = digit;
        setCode(newCode);

        if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData("Text")
            .replace(/[^0-9]/g, "")
            .slice(0, 6)
            .split("");

        const newCode = [...code];
        for (let i = 0; i < 6; i++) newCode[i] = pastedData[i] || "";
        setCode(newCode);

        const nextIndex = newCode.findIndex((d) => d === "");
        inputRefs.current[nextIndex === -1 ? 5 : nextIndex]?.focus();
    };


    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            const verificationCode = code.join("");

            if (verificationCode.length < 6) {
                toast.error(t("enter_full_code"));
                return;
            }

            try {
                setLoading(true);
                const response = await axios.post("/api/auth/verify", {
                    userId,
                    code: verificationCode,
                },
                    {
                        headers: {
                            "x-locale": locale
                        }
                    }
                );

                if (response.data.success) {
                    toast.success(t("email_verified"));
                    router.push("/login");
                } else {
                    toast.error(t("verification_failed"));
                }
            } catch (error: any) {
                toast.error(error.response?.data?.error || t("something_wrong"));
            } finally {
                setLoading(false);
            }
        },
        [code, router, userId]
    );

    useEffect(() => {
        if (code.every((digit) => digit !== "")) {
            handleSubmit(new Event("submit") as any);
        }
    }, [code, handleSubmit]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleResend = async () => {
        try {
            setResendLoading(true);
            const response = await axios.post("/api/auth/resend-code", { userId }, {
                headers: {
                    "x-locale": locale
                }
            });
            if (response.data.success) {
                toast.success(t("new_code_sent"));
                setTimer(60);
            } else {
                toast.error(response.data.error || "Failed to resend code");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || t("something_wrong"));
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="flex py-5 px-4 h-[80vh] bg-white">
            <div className=" rounded-2xl desktop:max-w-[400px] tablet:max-w-[400px] mobile:w-full">
                {/* <div className="flex justify-center">
                    <Image src={Logo} alt="Logo" width={176} height={148} />
                </div> */}
                <form onSubmit={handleSubmit} className="space-y-6 mt-10">
                    <div className="flex justify-between">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }} type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-12 h-12 text-center text-base m-1 font-bold bg-white text-black border-2 border-darkblue rounded-[8px] focus:outline-none"
                            />
                        ))}


                    </div>

                    <CustomButton
                        onClick={handleSubmit}
                        disabled={loading || code.some((digit) => !digit)}

                    >
                        {loading ? t("loading") : t("verify_email")}
                    </CustomButton>
                </form>

                <div className="text-center mt-4">
                    {timer > 0 ? (
                        <p className="text-sm text-gray-500">
                            {t("resend_timer", { seconds: timer })}
                        </p>
                    ) : (
                        <CustomButton
                            onClick={handleResend}
                            disabled={resendLoading}
                            className="bg-torquoise "
                        >
                            {resendLoading ? t("sending") : t("resend_code")}
                        </CustomButton>

                    )}
                </div>
            </div>
        </div>
    );
}
