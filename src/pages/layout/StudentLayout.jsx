import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "../student/components/StudentSidebar";
import StudentHeader from "../student/components/StudentHeader";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "@/Store/features/user/user.auth.slice";
import { getAllCourses } from "@/Store/features/course/course.slice";
import socket from "@/socket/socket";
import { toast } from "sonner";
import { getMyEnrollments } from "@/Store/features/enrollment/enrollment.slice";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const StudentLayout = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getAllCourses());
    dispatch(getMyEnrollments());
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    // Join personal room for enrollment status updates
    socket.emit("join", user._id);

    // Join shared student room for new course notifications
    socket.emit("joinStudent");

    // Listen: new course created by admin
    socket.on("newCourseAvailable", (data) => {
      toast.success(data.message || "A new course is available!");
      dispatch(getAllCourses()); // refresh course list automatically
    });

    //Listen: course status updated
    socket.on("courseUpdate", (data) => {
      toast.success(data.message || "A course status has been updated!");
      dispatch(getAllCourses()); // refresh course list automatically
      dispatch(getMyEnrollments()); //refresh enrollment list automatically
    });

    // Listen: admin approved or rejected enrollment
    socket.on("enrollmentUpdated", (data) => {
      if (data.status === "approved") {
        toast.success(`Your enrollment was approved!`);
        dispatch(getMyEnrollments());
      } else {
        toast.error(
          `Enrollment rejected: ${data.rejectionReason || "Requirements not met"}`,
        );
        dispatch(getMyEnrollments());
      }
    });

    return () => {
      socket.off("newCourseAvailable");
      socket.off("enrollmentUpdated");
    };
  }, [user?._id, dispatch]);

  return (
    <SidebarProvider defaultOpen={true}>
      <StudentSidebar />
      <SidebarInset>
        <StudentHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default StudentLayout;
