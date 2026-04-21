import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "../student/components/StudentSidebar";
import StudentHeader from "../student/components/StudentHeader";
import { useDispatch } from "react-redux";
import { getUserProfile } from "@/Store/features/user/user.auth.slice";
import { getAllCourses } from "@/Store/features/course/course.slice";

const StudentLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getAllCourses());
  }, []);
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
