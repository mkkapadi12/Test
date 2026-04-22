import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const StudentSidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      path: "/student",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: "All Courses",
      path: "/student/all-courses",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      title: "My Enrollments",
      path: "/student/my-enrollments",
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      title: "My Learning",
      path: "/student/learning",
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] hidden md:block sticky top-16">
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
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
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

export default StudentSidebar;
