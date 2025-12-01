"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CustomInput from "@/components/ui/Input";
import CustomButton from "@/components/ui/Button";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import Logo from "@/assets/logo_EACB.png";
import { useTranslations } from "next-intl";
const ResetPassword = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const t = useTranslations("Register");
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!password) {
            toast.error(t("enterPassword"));
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post("/api/auth/reset-password", { token, password });
            if (res.data.success) {
                toast.success(t("resetSuccess"));
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            } else {
                toast.error(res.data.error || t("resetFailed"));
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
                <div className="">
                    <h1 className="mb-2 text-darkblue">{t("field4")}*</h1>
                    <div className="relative">
                        <CustomInput
                            value={password}
                            type={showPassword ? "text" : "password"}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 cursor-pointer text-darkblue"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <CustomButton
                        onClick={handleResetPassword}
                        disabled={loading}
                        className="mt-4 w-full"
                    >
                        {loading ? t("resetting") : t("resetButton")}
                    </CustomButton>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
