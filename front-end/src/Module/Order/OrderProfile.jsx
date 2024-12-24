import { Button } from "Components/Button";
import { Field } from "Components/Field";
import ImageUpload from "Components/Image/ImageUpload";
import Input from "Components/input/input";
import { Label } from "Components/label";
import { useAuth } from "Contexts/Auth-context";
import DashboardHeading from "Module/Dashboard/DashboardHeading";
import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { userRole } from "utils/constants";
import ReactModal from "react-modal";

const OrderProfile = () => {
  const { control } = useForm({
    mode: "onChange",
  });
  const [openModal, setOpenModal] = useState(false);
  const renderRole = (role) => {
    switch (role) {
      case userRole.ADMIN:
        return "Admin";
      case userRole.MOD:
        return "Mod";
      case userRole.USER:
        return "User";
      default:
        break;
    }
  }
  const { userInfo } = useAuth();
  return (
    <>
      <ReactModal
        isOpen={openModal}
        className="w-full max-w-[521px] bg-white rounded-3xl outline-none relative max-h-[90vh] overflow-hidden select-none transition-all duration-300"
        overlayClassName=" fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
        onRequestClose={() => setOpenModal(false)}
      >
        <img src={userInfo?.avatar} alt="" />
      </ReactModal>
      <div>
        <DashboardHeading
          title="Account information"
          desc="Update your account information"
        ></DashboardHeading>
        <form>
          <div className="text-center mb-10">
            <ImageUpload
              className="!w-[300px] h-[300px] !rounded-full min-h-0 mx-auto"
              image={userInfo?.avatar}
              del={null}
              onClick={() => setOpenModal(true)}
            ></ImageUpload>
          </div>
          <div className="form-layout">
            <Field>
              <Label>Fullname</Label>
              <Input
                control={control}
                name="fullname"
                placeholder="Enter your fullname"
                value={userInfo?.fullname}
              ></Input>
            </Field>
            <Field>
              <Label>User Name</Label>
              <Input
                control={control}
                name="username"
                placeholder="Enter your username"
                value={userInfo?.username}
              ></Input>
            </Field>
          </div>
          <div className="form-layout">
            <Field>
              <Label>Role</Label>
              <Input
                control={control}
                name="birthday"
                placeholder="dd/mm/yyyy"
                value={renderRole(+userInfo?.role)}
              ></Input>
            </Field>
            <Field>
              <Label>Email</Label>
              <Input
                control={control}
                name="email"
                placeholder="Enter your email"
                value={userInfo?.email}
              ></Input>
            </Field>
          </div>
        </form>
      </div>
    </>
  );
};

export default OrderProfile;
