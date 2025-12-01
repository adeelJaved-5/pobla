import ForgotPassword from "@/components/layout/ForgotPassword";
import DashboardWrapper from "@/layouts/DashboardWrapper";
import React from "react";

const page = () => {
  return (
    <div>
      <DashboardWrapper>
        <ForgotPassword />
      </DashboardWrapper>
    </div>
  );
};

export default page;
