import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import DashboardLayout from "./Module/DashboardLayout";
import DashboardPage from "./pages/DashBoardPage";
import CategoryManage from "./Module/Category/CategoryManage";
import CategoryAddNew from "./Module/Category/CategoryAddNew";
import FoodAddNew from "./Module/Category/FoodAddNew";
import OrderManage from "./Module/Order/OrderManage";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route element={<DashboardLayout></DashboardLayout>}>
            <Route
              path="/admin"
              element={<DashboardPage></DashboardPage>}
            ></Route>
             <Route
              path="/manage/category"
              element={<CategoryManage></CategoryManage>}
            ></Route>
            <Route
              path="/manage/add-category"
              element={<CategoryAddNew></CategoryAddNew>}
            ></Route>
            <Route
              path="/manage/add-food"
              element={<FoodAddNew></FoodAddNew>}
            ></Route>
            <Route
              path="/manage/order"
              element={<OrderManage></OrderManage>}
            ></Route>
          </Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
