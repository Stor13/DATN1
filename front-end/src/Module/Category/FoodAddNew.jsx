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
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Dropdown } from "../../components/Dropdown";
import { getActiveCategories } from "../../service/blockchain";
import { addFood } from "../../service/blockchain";

const FoodAddNew = () => {
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState(null);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [progress, setProcess] = useState(0);
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      price: "",
      description: "",
    },
  });
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getActiveCategories();
        // Format lại data từ smart contract
        const formattedCategories = categoryData.map((category, index) => ({
          id: index + 1,
          name: category[0], // name ở vị trí 0
          imageUrl: category[2], // imageUrl ở vị trí 2
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
      ImageUploader: {
        upload: async (file) => {
          const bodyFormData = new FormData();
          bodyFormData.append("image", file);
          const response = await axios({
            method: "post",
            url: "https://api.imgbb.com/1/upload?key=1354c230dd40a7043dbe4307c3df1bc3",
            data: bodyFormData,
            headers: {
              "content-Type": "multipart/form-data",
            },
          });
          return response.data.data.url;
        },
      },
    }),
    []
  );

  const handleSelectImage = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleDeleteImage = () => {
    setImage(null);
  };

  const handleClickOption = (item) => {
    setSelectCategory(item);
    setValue("category", item.id); // Lưu category ID vào form
  };

  const handleAddNewFood = async (values) => {
    if (
      !values.name ||
      !values.description ||
      !values.price ||
      !selectCategory
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      // Find category index from name
      const categoryIndex = categories.findIndex(
        (cat) => cat.name === selectCategory.name
      );
      if (categoryIndex === -1) {
        toast.error("Invalid category selected");
        return;
      }

      const tx = await addFood(
        values.name,
        values.description,
        values.price,
        image,
        categoryIndex
      );

      toast.success("Food added successfully!");
      console.log("Transaction:", tx);
      reset({
        name: "",
        description: "",
        price: "",
      });
      setImage(null);
      setSelectCategory(null);
    } catch (error) {
      console.error("Error adding food:", error);
      toast.error(error?.message || "Something went wrong!");
    }
  };

  return (
    <div>
      <DashboardHeading title="New food" desc="Add new food" />
      <form onSubmit={handleSubmit(handleAddNewFood)} autoComplete="off">
        <div className="form-layout">
          <Field>
            <Label>Name</Label>
            <Input
              control={control}
              name="name"
              placeholder="Enter food name"
              required
            />
          </Field>
          <Field>
            <Label>Price</Label>
            <Input
              control={control}
              // type="number"
              name="price"
              placeholder="Enter price ( $ )"
              required
            />
          </Field>
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
          <Field>
            <Label>Category</Label>
            <Dropdown>
              <Dropdown.Select
                placeholder={selectCategory?.name || "Select the category"}
              />
              <Dropdown.List>
                {categories.length > 0 &&
                  categories.map((item) => (
                    <Dropdown.Option
                      key={item.id}
                      onClick={() => handleClickOption(item)}
                    >
                      {item.name}
                    </Dropdown.Option>
                  ))}
              </Dropdown.List>
            </Dropdown>
            {selectCategory?.name && (
              <span className="inline-block p-3 rounded-lg bg-green-50 text-sm text-green-600 font-medium">
                {selectCategory.name}
              </span>
            )}
          </Field>
        </div>
        <div className="mb-10">
          <Field>
            <Label>Description</Label>
            <Input
              control={control}
              // type="number"
              name="description"
              placeholder="Enter description"
              required
            />
          </Field>
        </div>
        <Button
          kind="primary"
          className="mx-auto w-[200px] mt-10"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Add new food
        </Button>
      </form>
    </div>
  );
};

export default FoodAddNew;
