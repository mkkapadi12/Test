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
      dispatch(getMyEnrollments());//refresh enrollment list automatically
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
      // Optionally refresh enrollments
    });

    return () => {
      socket.off("newCourseAvailable");
      socket.off("enrollmentUpdated");
    };
  }, [user?._id, dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <StudentHeader />
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto">
        <StudentSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
