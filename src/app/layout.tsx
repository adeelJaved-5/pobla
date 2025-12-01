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
  description: "Canyelles i la història del meteorit és un joc amb realitat augmentada que segueix un itinerari geolocalitzat per Canyelles amb un total de 6 parades conduïdes per un avatar, en Roc, un fragment del meteorit que va caure a Canyelles fa gairebé dos-cents anys. En Roc serà qui us acompanyi en tot el recorregut, explicant històries i anècdotes de Canyelles i la seva gent. A cada parada, hi ha una petita audiodescripció d'en Roc, un repte interactiu amb AR i un qüestionari. L’objectiu és completar l'itinerari i aconseguir les pedres precioses de Canyelles.",
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
