import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import InstructorHeader from "../instructor/components/InstructorHeader";
import InstructorSidebar from "../instructor/components/InstructorSidebar";
import { useDispatch } from "react-redux";
import socket from "@/socket/socket";
import { getInstructorProfile } from "@/Store/features/instructor/instructor.auth.slice";

const InstructorLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInstructorProfile());

    // Instructor joins instructorRoom to receive notifications
    socket.emit("joinInstructor");

    return () => {};
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      <InstructorHeader />
      <div className="flex flex-1">
        <InstructorSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;
