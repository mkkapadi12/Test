import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { logout } from "@/Store/features/admin/admin.auth.slice";

const AdminHeader = () => {
  const { admin } = useSelector((state) => state.admin) || { admin: null };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/admin/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm flex-none">
      <div className="px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
          <Button variant="ghost" size="icon" className="md:hidden mr-1">
            <Menu className="w-5 h-5 text-gray-900" />
          </Button>
          <ShieldCheck className="w-6 h-6 text-gray-900" />
          <span className="hidden sm:inline-block">AdminPortal</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold leading-none text-gray-900">
              {admin?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Administrator</p>
          </div>
          <Separator orientation="vertical" className="h-8 hidden md:block border-gray-200" />
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg"
            onClick={adminLogout}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;