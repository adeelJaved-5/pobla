"use client";
import { HeroUIProvider } from "@heroui/react";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}