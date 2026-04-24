import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import InstructorHeader from "../instructor/components/InstructorHeader";
import InstructorSidebar from "../instructor/components/InstructorSidebar";
import socket from "@/socket/socket";

const InstructorLayout = () => {
  useEffect(() => {
    // Instructor joins instructorRoom to receive notifications
    socket.emit("joinInstructor");

    return () => {};
  }, []);

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
