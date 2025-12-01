import ManualLogin from "@/components/layout/ManualLogin";
import DashboardWrapper from "@/layouts/DashboardWrapper";
import React from "react";

const page = () => {
  return (
    <div>
      <DashboardWrapper>
        <ManualLogin />
      </DashboardWrapper>
    </div>
  );
};

export default page;
