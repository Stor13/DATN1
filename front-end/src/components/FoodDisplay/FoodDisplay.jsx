import React, { useContext, useEffect } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import { getActiveCategories } from "../../service/blockchain";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  // useEffect(() => {
  //   const fetchCategory = async () => {
  //     try {
  //       const categoryData = await getActiveCategories();
  //       console.log("Category data:", categoryData[0][0]);
  //     } catch (error) {
  //       console.error("Error fetching category:", error);
  //     }
  //   };

  //   fetchCategory();
  // }, []);
  return (
    <div className="food-display" id="food-display">
      <h2>Top Dishes Near You</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
