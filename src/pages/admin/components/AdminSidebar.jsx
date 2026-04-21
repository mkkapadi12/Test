import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, BookOpen, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: "Products",
      path: "/admin/all-products",
      icon: <Package className="w-5 h-5" />,
    },
    {
      title: "Courses",
      path: "/admin/all-courses",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      title: "Student Enrollments",
      path: "/admin/student-enrollments",
      icon: <Users className="w-5 h-5" />,
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] hidden md:block sticky top-16 shrink-0">
      <div className="p-4 space-y-2 py-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default AdminSidebar;