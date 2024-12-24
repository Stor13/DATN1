import React from "react";
// import UserTable from "./OrderTable";
// import { userRole } from "utils/constants";
import { useEffect } from "react";
import DashboardHeading from "../DashboardHeading";
import OrderTable from "./OrderTable";

const OrderManage = () => {
  useEffect(() => {
    document.title = "Users Manage";
  }, []);
  return (
    <div>
      <DashboardHeading
        title="Orders"
        desc="Manage order"
      ></DashboardHeading>
      <OrderTable></OrderTable>
    </div>
  );
};

export default OrderManage;
