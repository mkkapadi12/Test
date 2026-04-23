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
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
