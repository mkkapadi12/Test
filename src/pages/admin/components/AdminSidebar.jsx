import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  BookOpen,
  Users,
  UserCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";

const navItems = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    description: "Overview & metrics",
  },
  {
    title: "Courses",
    path: "/admin/all-courses",
    icon: BookOpen,
    description: "Course management",
  },
  {
    title: "Requests",
    path: "/admin/pending-requests",
    icon: UserCheck,
    description: "Pending approvals",
    showBadge: true,
  },
  {
    title: "Enrollments",
    path: "/admin/enrollments",
    icon: Users,
    description: "All enrollments",
  },
];

const SidebarNav = ({ onNavigate }) => {
  const location = useLocation();
  const { pendingRequests } = useSelector((state) => state.enrollment) || {
    pendingRequests: [],
  };

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex flex-col gap-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/admin" && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          const badgeCount =
            item.showBadge && pendingRequests?.length > 0
              ? pendingRequests.length
              : 0;

          return (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      !isActive && "group-hover:scale-110",
                    )}
                  />
                  <span className="flex-1 truncate">{item.title}</span>
                  {badgeCount > 0 && (
                    <Badge
                      variant={isActive ? "secondary" : "destructive"}
                      className="ml-auto h-5 min-w-5 px-1.5 text-[10px] font-bold"
                    >
                      {badgeCount}
                    </Badge>
                  )}
                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="md:hidden lg:block">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
};

const AdminSidebar = () => {
  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-border bg-card h-[calc(100vh-3.5rem)] sticky top-14 shrink-0 overflow-hidden">
      {/* Section Label */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Navigation
        </p>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto">
        <SidebarNav />
      </div>

      <Separator />

      {/* Footer */}
      <div className="p-4">
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">Admin Portal</p>
            <p className="text-[10px] text-muted-foreground">v2.0 • Pro</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export { SidebarNav };
export default AdminSidebar;
