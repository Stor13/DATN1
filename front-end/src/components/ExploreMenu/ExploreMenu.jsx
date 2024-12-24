// import React, { useEffect } from "react";
// import "./ExploreMenu.css";
// import { menu_list } from "../../assets/assets";
// import { getActiveCategories } from "../../service/blockchain";

// const ExploreMenu = ({ category, setCategory }) => {
//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         const categoryData = await getActiveCategories();
//         console.log("Category data:", categoryData[0][0]);
//       } catch (error) {
//         console.error("Error fetching category:", error);
//       }
//     };

//     fetchCategory();
//   }, []);

//   return (
//     <div className="explore-menu" id="explore-menu">
//       <h1>Explore Our Menu</h1>
//       <p className="explore-menu-text">
//         Choose from a diverse menu featuring a delectable array of dishes. Our
//         mission is to satisfy your cravings and elevate your dining experience,
//         one delicious meal at a time.
//       </p>
//       <div className="explore-menu-list">
//         {menu_list.map((item, index) => {
//           return (
//             <div
//               key={index}
//               className="explore-menu-list-item"
//               onClick={() =>
//                 setCategory((prev) =>
//                   prev === item.menu_name ? "All" : item.menu_name
//                 )
//               }
//             >
//               <img
//                 src={item.menu_image}
//                 className={category === item.menu_name ? "active" : ""}
//                 alt="menu_image"
//               />
//               <p>{item.menu_name}</p>
//             </div>
//           );
//         })}
//       </div>
//       <hr />
//     </div>
//   );
// };

// export default ExploreMenu;

import React, { useEffect, useState } from "react";
import "./ExploreMenu.css";
import { getActiveCategories } from "../../service/blockchain";

const ExploreMenu = ({ category, setCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const categoryData = await getActiveCategories();

        // Chuyển đổi dữ liệu để chỉ lấy name và imageUrl
        const formattedCategories = categoryData.map((category) => ({
          name: category[0], // Trường name ở vị trí 0
          imageUrl: category[2], // Trường imageUrl ở vị trí 2
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore Our Menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes. Our
        mission is to satisfy your cravings and elevate your dining experience,
        one delicious meal at a time.
      </p>
      <div className="explore-menu-list">
        {categories.map((item, index) => {
          return (
            <div
              key={index}
              className="explore-menu-list-item"
              onClick={() =>
                setCategory((prev) => (prev === item.name ? "All" : item.name))
              }
            >
              <img
                src={item.imageUrl}
                className={category === item.name ? "active" : ""}
                alt={item.name}
              />
              <p>{item.name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
