"use client";
import React, { useEffect } from 'react';
import Image from "next/image";
import Logo from "@/assets/logo_EACB.png";
import CustomButton from "../ui/Button";
import CustomInput from "../ui/Input";
import CustomPhoneInput from "../ui/PhoneField";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const AdditionalInfo = () => {
    const router = useRouter();
    const t = useTranslations("Register");
    const { data: session, update, status } = useSession();
    const phone = (session?.user as any)?.phone || "";
    const origin = (session?.user as any)?.address || "";

    const [formData, setFormData] = React.useState({
        phone: phone,
        origin: origin,
    });

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validatePhone = (phone: string) => {
        const cleaned = phone.replace(/\s+/g, "");
        return /^\+?\d{7,15}$/.test(cleaned);
    };

    const handleSubmit = async () => {
        if (!validatePhone(formData.phone)) {
            toast.error(t("invalidPhone"));
            return;
        }

        if (!formData.origin) {
            t("enterAddress");     
            return;
        }


        try {
            const res = await fetch("/api/microsoft-personal-account-additional-info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, email: session?.user?.email }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(t("updateSuccess"));
                await update?.({
                    ...session?.user,
                    phone: data.user.phone,
                    address: data.user.origin,
                    firstName: data.user.firstName,
                    lastName: data.user.lastName,
                });

                router.push("/login");
            } else {
                const data = await res.json();
                toast.error(t("updateError"));
            }
        } catch (err: any) {
            toast.error(err?.message || t("generalError"));
        }
    };

    useEffect(() => {
        if (status !== "loading" && !session?.user) {
            router.push("/register");
        }
    }, [session, status, router]);
    return (
        <div className="flex flex-col items-center py-5 px-4 h-[80vh] bg-white">
            <div className="desktop:max-w-[400px] tablet:max-w-[400px] mobile:w-full">
                {/* <div className="flex justify-center">
                    <Image src={Logo} alt="Logo" width={176} height={148} />
                </div> */}

                <div className="mt-[40px] flex flex-col gap-[22px]">
                    <div>
                        <h1 className="mb-2 text-darkblue">{t("field5")}*</h1>
                        <CustomPhoneInput
                            value={formData.phone}
                            onChange={(e: string | React.ChangeEvent<HTMLInputElement>) => {
                                let value: string;

                                if (typeof e === "string") {
                                    value = e;
                                }
                                else if ("target" in e && e.target?.value) {
                                    value = e.target.value;
                                } else {
                                    value = "";
                                }

                                handleChange("phone", value);
                            }}
                        />

                    </div>
                    <div>
                        <h1 className="mb-2 text-darkblue">{t("field6")}*</h1>
                        <CustomInput
                            value={formData.origin}
                            onChange={(e) => handleChange("origin", e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4 mt-[45px]">
                    <CustomButton onClick={handleSubmit}>{t("button1")}</CustomButton>
                </div>
            </div>
        </div>
    );
};

export default AdditionalInfo;
