"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import Loading from "./Loading";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  points: number;
}
const Classification = () => {
  const t = useTranslations("Classification");
  const [users, setUser] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { status } = useSession();


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user/ranking");
        setUser(res.data.user);
      } catch (err: any) {
        console.error("Failed to fetch users:", err.response?.data || err.message);
        setUser([]);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      setLoading(true);
      fetchUsers();
    }
  }, [status]);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (loading) return (<Loading />);
  return (
    <div className="min-h-[80vh] bg-white">
      <div className="gradient-bg border-b-2 border-t-2 border-[#550A02] w-full flex h-[100px] items-center justify-center">
        <h1 className="text-[26px] font-semibold text-lightskin text-center">
          {t("title")}
        </h1>
      </div>
      <div className="w-full">
        <div
          className="grid grid-cols-3 bg-[#F7F7F7] text-center border-b
         border-[#E7E7E7] text-lightblack font-bold pl-[13px] text-lg"
        >
          <div className="text-left border-r py-3 border-white">{t("tablehead1")}</div>
          <div className="border-r py-3 border-white">{t("tablehead2")}</div>
          <div className="text-right pr-[26px] py-3">{t("tablehead3")}</div>
        </div>
        {users?.map((user) => (
          <div
            key={user._id}
            className="grid grid-cols-3 border-b-1 border-lightborder pl-[16px] text-center text-lightblack text-lg py-[22px]"
          >
            <div className="text-left font-medium">{user.firstName}</div>
            <div className="truncate font-medium">{user.lastName|| "na"}</div>
            <div className="text-blue font-medium text-right pr-[26px]">
              {user.points}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classification;
