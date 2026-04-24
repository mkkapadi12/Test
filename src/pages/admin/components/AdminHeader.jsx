import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { logout } from "@/Store/features/admin/admin.auth.slice";
import { SidebarNav } from "./AdminSidebar";
import { ADMIN_ICONS } from "@/lib/icons/admin.icons";

const AdminHeader = () => {
  const { admin } = useSelector((state) => state.admin) || { admin: null };
  const { pendingRequests } = useSelector((state) => state.enrollment) || {
    pendingRequests: [],
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const adminLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/admin/login");
  };

  const getInitials = (name) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const pendingCount = pendingRequests?.length || 0;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          {/* Left: Logo + Mobile Menu */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <ADMIN_ICONS.MENU className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <ADMIN_ICONS.SHIELD className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold leading-none tracking-tight">
                  AdminPortal
                </h1>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Management Console
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <ADMIN_ICONS.BELL className="h-4 w-4" />
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
                </span>
              )}
            </Button>

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            {/* User Profile */}
            <div className="hidden sm:flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-accent transition-colors cursor-default">
              <Avatar size="sm">
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                  {getInitials(admin?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-xs font-semibold leading-none">
                  {admin?.name || "Admin"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Administrator
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              onClick={adminLogout}
              title="Logout"
            >
              <ADMIN_ICONS.LOGOUT className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-border px-4 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <ADMIN_ICONS.SHIELD className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <SheetTitle className="text-sm font-bold">
                  AdminPortal
                </SheetTitle>
                <SheetDescription className="text-[10px]">
                  Management Console
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-2">
            <SidebarNav onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>

          {/* Mobile: User Info + Logout */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  {getInitials(admin?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {admin?.name || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                setIsMobileMenuOpen(false);
                adminLogout();
              }}
            >
              <ADMIN_ICONS.LOGOUT className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminHeader;
