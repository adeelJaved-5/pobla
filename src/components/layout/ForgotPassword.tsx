"use client";
import React, { useState } from "react";
import CustomInput from "@/components/ui/Input";
import CustomButton from "@/components/ui/Button";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Logo from "@/assets/logo_EACB.png";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations("Register");

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error(t("enterEmail"));
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post("/api/auth/forgot-password", { email });
            if (res.data.success) {
                toast.success(t("emailSent"));
                
            } else {
                toast.error(res.data.error || t("sendFailed"));
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || t("somethingWrong"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-[22px] py-5 px-4 h-[80vh] bg-white">
            <div className="desktop:max-w-[400px] tablet:max-w-[400px] mobile:w-full mt-10">
                {/* <div className="flex justify-center">
                    <Image src={Logo} alt="Logo" width={176} height={148} />
                </div> */}
                <div>
                    <h1 className="mb-2 text-darkblue">{t("field3")}*</h1>
                    <CustomInput
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("field3")}
                    />
                </div>
                <CustomButton
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="mt-[16px]"
                >
                    {loading ? t("sending") : t("sendLink")}
                </CustomButton>
            </div>
        </div>
    );
};

export default ForgotPassword;
