import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../admin/components/AdminHeader";
import AdminSidebar from "../admin/components/AdminSidebar";
import { useDispatch } from "react-redux";
import { getAdminProfile } from "@/Store/features/admin/admin.auth.slice";
import socket from "@/socket/socket";
import { toast } from "sonner";
import {
  getAllEnrollments,
  getPendingRequests,
} from "@/Store/features/enrollment/enrollment.slice";

const AdminLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdminProfile());
    dispatch(getAllEnrollments());

    // Admin joins adminRoom to receive enrollment requests
    socket.emit("joinAdmin");

    // Listen for new enrollment requests from students
    socket.on("newEnrollmentRequest", (data) => {
      toast.info(data.message);
      dispatch(getPendingRequests()); // refresh pending list automatically
      dispatch(getAllEnrollments());
    });

    return () => {
      socket.off("newEnrollmentRequest");
    };
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
