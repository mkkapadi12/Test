import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GraduationCap, LogOut, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { logout } from "@/Store/features/user/user.auth.slice";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const StudentHeader = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/user/login");
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white sticky top-0 z-50 flex items-center px-4 sm:px-6 gap-3">
      {/* Sidebar trigger */}
      <SidebarTrigger className="shrink-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-2" />

      <Separator orientation="vertical" className="h-6" />

      {/* Logo / Brand - visible on mobile since sidebar is collapsed */}
      <Link to="/student" className="flex items-center gap-2 flex-1">
        <div className="bg-gray-900 p-1.5 rounded-lg hidden sm:flex">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-gray-900 hidden sm:block">
          StudentPortal
        </span>
      </Link>

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Bell icon placeholder */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <Separator orientation="vertical" className="h-6 hidden sm:block" />

        {/* User info */}
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-gray-900 leading-none">
            {user?.name || "Student"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Learner</p>
        </div>

        {/* Avatar */}
        <div className="h-9 w-9 bg-linear-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-sm shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default StudentHeader;
