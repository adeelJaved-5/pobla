import React, { useEffect, useState, useTransition } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  Link,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { locales } from "@/i18n/config";
import SplashPopUp from "../layout/Popup";
import { useSession } from "next-auth/react";

const FlagIcons: any = {
  ca: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="15"
      id="flag-icons-es-ct"
      viewBox="0 0 640 480"
    >
      <path fill="#fcdd09" d="M0 0h640v480H0z" />
      <path
        stroke="#da121a"
        stroke-width="60"
        d="M0 90h810m0 120H0m0 120h810m0 120H0"
        transform="scale(.79012 .88889)"
      />
    </svg>
  ),
  en: () => (
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
      <rect width="20" height="15" fill="#012169" />
      <path d="M0 0L20 15M20 0L0 15" stroke="white" strokeWidth="3" />
      <path d="M0 0L20 15M20 0L0 15" stroke="#C8102E" strokeWidth="2" />
      <path d="M8 0H12V6H20V9H12V15H8V9H0V6H8V0Z" fill="#C8102E" />
    </svg>
  ),
  es: () => (
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
      <rect width="20" height="5" fill="#AA151B" />
      <rect y="5" width="20" height="5" fill="#F1BF00" />
      <rect y="10" width="20" height="5" fill="#AA151B" />
    </svg>
  ),
  fr: () => (
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
      <rect width="6.66667" height="15" fill="#0055A4" />
      <rect x="6.66667" width="6.66667" height="15" fill="#FFFFFF" />
      <rect x="13.3333" width="6.66667" height="15" fill="#EF4135" />
    </svg>
  ),
};

export default function Menu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [selectedLocale, setSelectedLocale] = useState("ca");
  const [ShowMorePopup, setShowMorePopup] = useState(false);
  const [_, startTransition] = useTransition();
  const { status } = useSession();

  const currentLocale = useLocale();
  const t = useTranslations("Links");
  const t2 = useTranslations("Dashboard");

  const languageNames: Record<string, string> = {
    ca: t2("lang1"),
    es: t2("lang2"),
    en: t2("lang3"),
    fr: t2("lang4"),
  };

  // useEffect(() => {
  //   try {
  //     // Check cookie first
  //     const cookieMatch: any = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/);
  //     const cookieLang: any = cookieMatch ? cookieMatch[1] : null;

  //     if (cookieLang && locales.includes(cookieLang)) {
  //       setSelectedLocale(cookieLang);
  //       return;
  //     }

  //     // Otherwise detect system language
  //     const rawLang: any = navigator?.language || "ca";
  //     const systemLang: any = rawLang.split("-")[0];

  //     const matchedLocale = locales.includes(systemLang) ? systemLang : "ca";
  //     setSelectedLocale(matchedLocale);
  //     document.cookie = `NEXT_LOCALE=${matchedLocale}; path=/`;
  //   } catch (err) {
  //     console.error("Failed to detect system language:", err);
  //     setSelectedLocale("ca");
  //     document.cookie = `NEXT_LOCALE=en; path=/`;
  //   }
  // }, []);

  useEffect(() => {
    setSelectedLocale(currentLocale);
  }, [currentLocale]);

  const handleLanguageChange = (locale: string) => {
    // if (locale === selectedLocale) return;

    setSelectedLocale(locale);
    document.cookie = `NEXT_LOCALE=${locale}; path=/`;

    startTransition(() => {
      window.location.reload();
    });
  };

  return (
    <>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className={`relative w-5 h-0 `}
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            icon={
              isMenuOpen ? (
                <img
                  src="/icons/dropclose.png"
                  alt="Close menu"
                  className="w-12 h-6 ml-4"
                />
              ) : (
                <img src="/icons/menu.svg" alt="Open menu" />
              )
            }
          />
        </NavbarContent>
        <NavbarMenu
          className={`absolute top-0 desktop:w-[400px] max-h-[600px] tablet:w-[400px] bg-blue desktop:mx-auto mobile:w-full flex flex-col`}
        >
          <div className="flex gap-5 justify-between my-auto !mt-3 px-2 pb-5">
            <div className="flex flex-col my-auto !mt-24 gap-2">
              <Link
                href="/mapa"
                className="text-lightskin text-[20px] p-2 font-bold hover:bg-gradient-to-b from-[#F2B427] to-[#D67D05]  block"
              >
                {t2("card1")}
              </Link>
              <Link
                href="/progres"
                className="text-lightskin text-[20px] p-2 font-bold hover:bg-gradient-to-b from-[#F2B427] to-[#D67D05] block whitespace-nowrap"
              >
                {t2("card2")}
              </Link>
              <Link
                href="/amics"
                className="text-lightskin text-[20px] p-2 font-bold hover:bg-gradient-to-b from-[#F2B427] to-[#D67D05] block"
              >
                {t2("card3")}
              </Link>
              <Link
                onClick={() => {
                  setShowMorePopup(true);
                }}
                className="text-lightskin text-[20px] p-2 font-bold hover:bg-gradient-to-b from-[#F2B427] to-[#D67D05] block"
              >
                {t2("card4")}
              </Link>
              <Link
                href="/faqs"
                className="text-lightskin text-[20px] p-2 font-bold hover:bg-gradient-to-b from-[#F2B427] to-[#D67D05] block"
              >
                {t2("card5")}
              </Link>
              <Link
                onClick={() => {
                  window.open("https://www.canyelles.cat", "_blank");
                }}
                className="text-lightskin text-[20px] p-2 font-bold hover:bg-gradient-to-b from-[#F2B427] to-[#D67D05] block"
              >
                {t2("card6")}
              </Link>
              <Link
                href="/"
                className="text-lightskin text-[20px] p-2 font-bold hover:bg-gradient-to-b from-[#F2B427] to-[#D67D05] whitespace-nowrap"
              >
                {t("LOGOUT_link")}
              </Link>
            </div>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  className="w-[200px] !mt-10 justify-between bg-skin border border-skin"
                >
                  <div className="flex items-center gap-2">
                    {FlagIcons[selectedLocale]()}
                    <span>{languageNames[selectedLocale]}</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Language selection"
                className="bg-white border border-skin rounded-md shadow-md p-2 w-full"
              >
                {Object.entries(languageNames).map(([locale, name]) => (
                  <DropdownItem
                    key={locale}
                    onClick={() => handleLanguageChange(locale)}
                    className={`px-3 py-2 rounded-md hover:bg-primary hover:text-white cursor-pointer flex items-center gap-2 ${
                      selectedLocale === locale
                        ? "bg-primary  font-medium text-white"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {FlagIcons[locale]()}
                      <span>{name}</span>
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </NavbarMenu>
      </Navbar>
      {ShowMorePopup && (
        <SplashPopUp
          handleClose={() => {
            setShowMorePopup(false);
          }}
        />
      )}
    </>
  );
}
