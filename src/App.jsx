import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

//admin routes
import AdminLogin from "./pages/admin/Auth/AdminLogin";
import AdminRegister from "./pages/admin/Auth/AdminRegister";
import AdminDashboard from "./pages/admin/pages/AdminDashboard";

//user routes
import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";

//student routes
import StudentDashboard from "./pages/student/pages/StudentDashboard";
import AllCourses from "./pages/student/pages/AllCourses";
import StudentLayout from "./pages/layout/StudentLayout";
import AdminCourses from "./pages/admin/pages/AdminCourses";
import AdminProducts from "./pages/admin/pages/AdminProducts";
import AdminLayout from "./pages/layout/AdminLayout";
import MyEnrollments from "./pages/student/pages/MyEnrollments";
import PendingRequests from "./pages/admin/pages/PendingRequests";
import AdminEnrollments from "./pages/admin/pages/AdminEnrollments";
import MyLearning from "./pages/student/pages/MyLearning";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* user auth routes */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/cart" element={<Cart />} />
        <Route path="/user/checkout" element={<Checkout />} />
        {/* admin auth routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        {/* admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="all-products" element={<AdminProducts />} />
          <Route path="all-courses" element={<AdminCourses />} />
          <Route path="pending-requests" element={<PendingRequests />} />
          <Route path="enrollments" element={<AdminEnrollments />} />
        </Route>
        {/* student routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="all-courses" element={<AllCourses />} />
          <Route path="my-enrollments" element={<MyEnrollments />} />
          <Route path="learning" element={<MyLearning />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
