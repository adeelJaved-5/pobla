import Dashboard from "@/components/layout/Dashboard";
import VerifyEmail from "@/components/layout/VerifyEmail";
import DashboardWrapper from "@/layouts/DashboardWrapper";
import React from "react";

const page = () => {
  return (
    <>
      <DashboardWrapper>
        <VerifyEmail />
      </DashboardWrapper>
    </>
  );
};

export default page;
