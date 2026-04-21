import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../admin/components/AdminHeader";
import AdminSidebar from "../admin/components/AdminSidebar";
import { useDispatch } from "react-redux";
import { getAdminProfile } from "@/Store/features/admin/admin.auth.slice";

const AdminLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdminProfile());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <AdminHeader />
      <div className="flex flex-1 w-full mx-auto">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
