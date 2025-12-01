import Register from "@/components/layout/Register";
import DashboardWrapper from "@/layouts/DashboardWrapper";
import React from "react";

const page = () => {
  return (
    <>
      <DashboardWrapper>
        <Register />
      </DashboardWrapper>
    </>
  );
};

export default page;
