import ResetPassword from "@/components/layout/ResetPassword";
import DashboardWrapper from "@/layouts/DashboardWrapper";
import React from "react";

const page = () => {
  return (
    <div>
      <DashboardWrapper>
        <ResetPassword />
      </DashboardWrapper>
    </div>
  );
};

export default page;
