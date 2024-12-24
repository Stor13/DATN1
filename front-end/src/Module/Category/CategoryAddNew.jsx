import React from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/Button/Button";
import Input from "../../components/input/input";
import { Label } from "../../components/label";
import DashboardHeading from "../DashboardHeading";
import { Field } from "../../components/Field";
import { toast } from "react-toastify"; // Thêm toast để hiển thị thông báo
import { addCategory } from "../../service/blockchain"; // Import hàm addCategory
import ImageUpload from "../../components/Image/ImageUpload";
import { useState , useEffect } from "react";
import axios from "axios";


const CategoryAddNew = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [progress, setProcess] = useState(0);
  useEffect(() => {
    const uploadToImgbb = async () => {
      if (!file) return null;
      setProcess(1);
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios({
        method: "post",
        url: "https://api.imgbb.com/1/upload?key=a1ad1ec2f3609f79f5c2c4f6ed0b6602",
        data: formData,
        headers: {
          "content-Type": "multipart/form-data",
        },
      });
      console.log(response.data.data.url);
      if (response.data.data.url) setProcess(0);
      setImage(response.data.data.url);
    };
    uploadToImgbb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);
  const handleSelectImage = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleDeleteImage = () => {
    setImage(null);
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "", // Đổi từ slug thành description
    },
  });

  const handleAddNewCategory = async (values) => {
    if (!values.name || !values.description) {
      toast.error("Please fill all fields");
      return;
    }

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      const tx = await addCategory(values.name, values.description,image);
      toast.success("Category added successfully!");
      console.log("Transaction:", tx);
      reset({
        name: "",
        description: "",
      });
      setImage(null);
      setFile(null);
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error?.message || "Something went wrong!");
    }
  };

  return (
    <div>
      <DashboardHeading title="New category" desc="Add new category" />
      <form onSubmit={handleSubmit(handleAddNewCategory)} autoComplete="off">
        <div className="form-layout">
          <Field>
            <Label>Name</Label>
            <Input
              control={control}
              name="name"
              placeholder="Enter category name"
              required
            />
          </Field>
          <Field>
            <Label>Description</Label>
            <Input
              control={control}
              name="description" // Đổi từ slug thành description
              placeholder="Enter description"
              required
            />
          </Field>
        </div>
        <Field>
          <Label>Image</Label>
          <ImageUpload
            onChange={handleSelectImage}
            handleDeleteImage={handleDeleteImage}
            className="h-[250px]"
            progress={progress}
            image={image}
          ></ImageUpload>
        </Field>
        <Button
          kind="primary"
          className="mx-auto w-[200px] mt-10"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Add new category
        </Button>
      </form>
    </div>
  );
};

export default CategoryAddNew;
