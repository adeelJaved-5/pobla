"use client";

import React, { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Loading from "@/components/layout/Loading";
import { useLocale } from "next-intl";
import ARView from "@/components/layout/ARView";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!user && !locale) return <Loading />;

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <ARView setShowARView={() => { console.log("enter"); }} handleClose={() => { router.push(`/ar?lat=${lat}&lng=${lng}`); }} audioUrl={`/audios/${["en", "fr", "es", "ca"].includes(locale) ? locale : "en"}/${user?.POIsCompleted + 1}.mp3`} linkLoad={true} from="POI" />
    </div>
  );
};

export default Page;