"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Map from "@/assets/card1.png";
import Profile from "@/assets/card2.png";
import Amics from "@/assets/card3.png";
import Axe from "@/assets/card4.png";
import Faq from "@/assets/card5.png";
import Direction from "@/assets/card6.png";
import Logo from "@/assets/dashboardLogo.png";
import Card from "../ui/Card";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import SplashPopUp from "./Popup";
import Welcome from "./Welcome";
import Intro from "./Intro";
import api from "@/lib/axios";
import { useUser } from "@/context/UserContext";
import CompletePopup from "./CompletePopup";
import Notification from "@/assets/notification.png";

const Dashboard = () => {
  const { user, refreshUser, loading: userLoading } = useUser();
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("Dashboard");
  const [loading, setLoading] = useState(false);
  const [ShowMorePopup, setShowMorePopup] = useState(false);
  const [ShowCompletePopup, setShowCompletePopup] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showMapNotification, setShowMapNotification] = useState(false);
  const [showAmicsNotification, setShowAmicsNotification] = useState(false);

  useEffect(() => {
    refreshUser();
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setLoading(true);
      const timer = setTimeout(() => {
        localStorage.setItem("hasSeenWelcome", "true");
        setLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && status === "authenticated") {
      const currentPOIs = user.POIsCompleted || 0;

      const lastSeenMapPOIsStr = localStorage.getItem("lastSeenMapPOIs");
      const lastSeenAmicsPOIsStr = localStorage.getItem("lastSeenAmicsPOIs");

      const lastSeenMapPOIs = lastSeenMapPOIsStr
        ? parseInt(lastSeenMapPOIsStr)
        : null;
      const lastSeenAmicsPOIs = lastSeenAmicsPOIsStr
        ? parseInt(lastSeenAmicsPOIsStr)
        : null;
      console.log(lastSeenAmicsPOIs, lastSeenMapPOIsStr);

      if (lastSeenMapPOIs === null || currentPOIs > lastSeenMapPOIs) {
        setShowMapNotification(true);
      } else {
        setShowMapNotification(false);
      }

      if (lastSeenAmicsPOIs === null || currentPOIs > lastSeenAmicsPOIs) {
        setShowAmicsNotification(true);
      } else {
        setShowAmicsNotification(false);
      }
    }
  }, [user, status, userLoading]);

  useEffect(() => {
    const checkIntro = async () => {
      if (user && user.hasSeenPopup === false) {
        setShowIntro(true);
      }
    };
    const checkPOI = async () => {
      if (user && user.POIsCompleted === 12) {
        setShowCompletePopup(true);
      }
    };
    checkIntro();
    checkPOI();
  }, [user, status, userLoading]);

  const updateIntroStatus = async () => {
    try {
      await api.post("/user", {
        hasSeenPopup: true,
      });
    } catch (err: any) {
      console.error("Failed to update:", err.response?.data || err.message);
    }
  };

  const handleMapClick = () => {
    if (user) {
      localStorage.setItem("lastSeenMapPOIs", user.POIsCompleted.toString());
      setShowMapNotification(false);
    }

    if (user && user.POIsCompleted === 12) {
      setShowCompletePopup(true);
    } else {
      router.push("/mapa");
    }
  };

  const handleAmicsClick = () => {
    if (user) {
      localStorage.setItem("lastSeenAmicsPOIs", user.POIsCompleted.toString());
      setShowAmicsNotification(false);
    }
    router.push("/amics");
  };

  if (loading) return <Welcome />;

  return (
    <>
      {ShowMorePopup && (
        <SplashPopUp
          handleClose={() => {
            setShowMorePopup(false);
          }}
        />
      )}
      {ShowCompletePopup && (
        <CompletePopup
          handleClose={() => {
            setShowCompletePopup(false);
          }}
        />
      )}
      {showIntro && (
        <Intro
          handleClose={() => {
            setShowIntro(false);
            updateIntroStatus();
          }}
        />
      )}
      <div className="gradient-bg text-lightblack pb-10">
        <div className="">
          <Image
            src={Logo}
            alt="Logo"
            className="object-cover h-[340px] w-[500px] object-[35%_24%] bg-gradient-to-r from-[#fff6d8] to-[#ef948a] "
          />
        </div>
        <div className="flex justify-between mt-[33px] px-4 gap-4">
          <Card onClick={handleMapClick}>
            <Image src={Map} alt="Map Icon" className="w-[48px] h-[48px]" />
            <h1 className="text-center w-full break-words px-1 leading-4 font-bold">
              {t("card1")}
            </h1>
            {status === "authenticated" && showMapNotification && (
              // <div className="w-[15px] h-[15px] rounded-full bg-red-600 absolute top-2 right-2  animate-pulse"></div>
              <Image
                src={Notification}
                alt="Notification"
                className="absolute top-0 right-0 animate-pulse w-[40px] h-[40px]"
              />
            )}
          </Card>
          <Card
            onClick={() => {
              router.push("/progres");
            }}
          >
            <Image
              src={Axe}
              alt="Know More Icon"
              className="w-[48px] h-[48px]"
            />
            <h1 className="text-center w-full break-words px-1 leading-4 font-bold">
              {t("card2")}
            </h1>
          </Card>
          <Card onClick={handleAmicsClick}>
            <Image
              src={Amics}
              alt="Friends Icon"
              className="w-[48px] h-[48px]"
            />
            <h1 className="text-center w-full break-words px-1 leading-4 font-bold">
              {t("card3")}
            </h1>
            {status === "authenticated" && showAmicsNotification && (
              // <div className="w-[15px] h-[15px] rounded-full bg-red-600 absolute top-2 right-2  animate-pulse"></div>
              <Image
                src={Notification}
                alt="Notification"
                className="absolute top-0 right-0 animate-pulse w-[40px] h-[40px]"
              />
            )}
          </Card>
        </div>
        <div className="flex justify-between mt-[25px] px-4 gap-4">
          <Card
            onClick={() => {
              setShowMorePopup(true);
            }}
          >
            <Image
              src={Profile}
              alt="Profile Icon"
              className="w-[48px] h-[48px]"
            />
            <h1 className="text-center w-full break-words px-1 leading-4 font-bold">
              {t("card4")}
            </h1>
          </Card>
          <Card
            onClick={() => {
              router.push("/faqs");
            }}
          >
            <Image
              src={Direction}
              alt="FAQs Icon"
              className="w-[48px] h-[48px]"
            />
            <h1 className="text-center w-full break-words px-1 leading-4 font-bold">
              {t("card5")}
            </h1>
          </Card>
          <Card
            onClick={() => {
              window.open("https://www.poblamafumet.cat", "_blank");
            }}
          >
            <Image
              src={Faq}
              alt="Recommendations Icon"
              className="w-[48px] h-[48px]"
            />
            <h1 className="text-center w-full break-words px-1 leading-4 font-bold">
              {t("card6")}
            </h1>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
