import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/admin/Auth/AdminLogin";
import AdminRegister from "./pages/admin/Auth/AdminRegister";

import Dashboard from "./pages/admin/Dashboard";
import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import UserDashboard from "./pages/user/UserDashboard";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        //User auth routes
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/cart" element={<Cart />} />
        <Route path="/user/checkout" element={<Checkout />} />
        //admin auth routes
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
