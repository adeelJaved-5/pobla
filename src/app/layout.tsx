import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Gluten , Roboto_Slab} from "next/font/google";
import "./globals.css";
import * as React from "react";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import ClientProvider from "./ClientProvider";
import Providers from "./providers";
import { UserProvider } from "@/context/UserContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const gluten = Gluten({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  // title: "Canyelles i la història del meteorit",
  title: "LA POBLA DE MAFUMET",
  description: "Els camins secrets de la Pobla de Mafumet és un joc que té com a objectiu acompanyar la Mafu al llarg de dotze punts geolocalitzats, on explicarà històries relacionades amb els diferents llocs. Cal recollir monedes romanes i aconseguir troballes per avançar.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
  },
};

// Layout
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${gluten.variable} ${robotoSlab.variable} antialiased`}
      >
        <Providers>
          <UserProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <ClientProvider>{children}</ClientProvider>
            </NextIntlClientProvider>
          </UserProvider>
        </Providers>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
