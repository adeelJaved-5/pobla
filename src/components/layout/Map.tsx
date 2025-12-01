"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { POIs } from "@/utils/location";
import CoinMap from "./CoinMap";
import Loading from "./Loading";

const Map = () => {
  const { user, refreshUser } = useUser();

  useEffect(() => {
    refreshUser();
  }, []);

  if (!user) return <Loading />;

  const destination = POIs[user?.POIsCompleted];

  return (
    <div>
      <CoinMap destination={destination} />
    </div>
  );
};

export default Map;