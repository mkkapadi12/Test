import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GraduationCap, LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { logout } from "@/Store/features/user/user.auth.slice";

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
    <header className="h-16 border-b border-gray-200 bg-white sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/student" className="flex items-center gap-2">
          <div className="bg-gray-900 p-1.5 rounded-lg">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">
            StudentPortal
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-bold text-gray-900 leading-none">
            {user?.name || "Student"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Learner</p>
        </div>
        <div className="h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
          <User className="h-4 w-4 text-gray-600" />
        </div>
        <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default StudentHeader;
