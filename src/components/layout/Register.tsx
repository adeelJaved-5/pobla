"use client";
import { Checkbox } from "@heroui/react";
import Image from "next/image";
import Logo from "@/assets/logo_EACB.png";
import React from "react";
import CustomButton from "../ui/Button";
import CustomInput from "../ui/Input";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import CustomPhoneInput from "../ui/PhoneField";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import PrivacyPolicyPopup from "./PrivacyPolicyPopup";

const Register = () => {
  const router = useRouter();
  const t = useTranslations("Register");
  const { data: session, update } = useSession();
  const t2 = useTranslations("Auth");
  const locale = useLocale();

  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    origin: "",
  });
  const [loading, setLoading] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [privacyAccepted, setPrivacyAccepted] = React.useState(false);

  const handleChange = (field: any, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\s+/g, "");
    return /^\+?\d{7,15}$/.test(cleaned);
  };


  const handleSubmit = async () => {
    if (!validateEmail(formData.email)) {
      toast.error(t("invalidEmail"));
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error(t("invalidPhone"));
      return;
    }
    // if (!termsAccepted) {

    //   toast.error(t("termsRequired"));
    //   return;
    // }

    if (!privacyAccepted) {
      toast.error(t("privacyRequired"));
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-locale": locale },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({} as any));
      if (res.ok) {
        await update?.({
          ...session?.user,
          ...data.user,
        });
        console.log("User created", data);
        toast.success(t("registerSuccess"));
        setTimeout(() => {
          router.push(`/verify-email?userId=${data.userId}`);
        }, 2000);

      } else {
        const message =
          (data && (data.error || data.message)) ||
          `Request failed (${res.status})`;
        toast.error(message);
      }
    } catch (err: any) {
      alert(err?.message || t("generalError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-4 min-h-screen bg-[#F2F0F4] pb-5">
      {showPrivacyPolicy && <PrivacyPolicyPopup handleClose={() => { setShowPrivacyPolicy(false); }} />}
      <div className="desktop:max-w-[400px] tablet:max-w-[400px] mobile:w-full">
        {/* <div className="flex justify-center">
          <Image src={Logo} alt="Logo" width={176} height={148} />
        </div> */}
        <div className="mt-[49px] flex flex-col gap-[22px] text-lightblack">
          <div>
            <h1 className="mb-2 font-medium">{t("field1")}*</h1>
            <CustomInput
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </div>
          <div>
            <h1 className="mb-2 font-medium">{t("field2")}*</h1>
            <CustomInput
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>
          <div>
            <h1 className="mb-2 font-medium">{t("field3")}*</h1>
            <CustomInput
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div>
            <h1 className="mb-2 font-medium">{t("field4")}*</h1>
            <div className="relative">
              <CustomInput
                value={formData.password}
                type={showPassword ? "text" : "password"}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 cursor-pointer text-lightblack"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div>
            <h1 className="mb-2 font-medium">{t("field5")}*</h1>
            <CustomPhoneInput
              value={formData.phone}
              onChange={(e) => {
                const value = e.target ? e.target.value : e;
                handleChange("phone", value);
              }}
            />
          </div>
          <div>
            <h1 className="mb-2 font-medium">{t("field6")}*</h1>
            <CustomInput
              value={formData.origin}
              onChange={(e) => handleChange("origin", e.target.value)}
            />
          </div>
        </div>
        <div className="mt-[47px] flex flex-col gap-7">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              color="success"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <span className="text-lightblack">{t("check1")}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              color="success"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
            />
            <span className="text-lightblack">
              {t("check21")}{" "}
              <span onClick={() => setShowPrivacyPolicy(true)} className="text-red-500">{t("check22")}</span>
            </span>
          </label>
        </div>


        <div className="flex flex-col gap-4 mt-[45px]">
          <CustomButton onClick={handleSubmit} disabled={loading}>{loading ? t("processing") : t("button1")}</CustomButton>
          <div className="mt-3">
            <span> {t2("HaveAccount")}  <a href="/login" className="  mt-6 font-bold">
              {t2("LoginAccount")}
            </a></span>
          </div>

          <div className="flex items-center">
            <div className="flex-1 border-t border-black"></div>

            <span className="poppins-medium font-medium text-black text-[17px] leading-none !mx-4">
              OR
            </span>

            <div className="flex-1 border-t border-black"></div>
          </div>
        </div>
        <CustomButton
          onClick={() => {
            signIn("google", { callbackUrl: "/login" });
          }}
          className="flex w-full items-center justify-center gap-2 mt-[18px]"
        >
          <FcGoogle size={20} /> Continue with Google
        </CustomButton>
        <CustomButton
          onClick={() => signIn("azure-ad", { callbackUrl: "/login" })}
          className="flex w-full items-center justify-center gap-2 mt-[16px]"
        >
          <FaMicrosoft size={20} /> Continue with Microsoft
        </CustomButton>

      </div>
    </div>
  );
};

export default Register;
