import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Brain,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Dashboard",
    path: "/student",
    icon: LayoutDashboard,
  },
  {
    title: "All Courses",
    path: "/student/all-courses",
    icon: BookOpen,
  },
  {
    title: "My Enrollments",
    path: "/student/my-enrollments",
    icon: GraduationCap,
  },
  {
    title: "My Learning",
    path: "/student/learning",
    icon: Brain,
  },
];

const StudentSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      {/* Brand header visible inside sidebar */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-gray-900 group-data-[collapsible=icon]:hidden">
            StudentPortal
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      size="lg"
                    >
                      <Link to={item.path}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 py-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          © {new Date().getFullYear()} StudentPortal
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default StudentSidebar;
