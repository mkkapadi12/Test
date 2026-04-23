import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  Calendar,
  Search,
  X,
  FileText,
  GraduationCap,
  Mail,
  Filter,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { getAllEnrollments } from "@/Store/features/enrollment/enrollment.slice";

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800 hover:bg-emerald-100">
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800 hover:bg-red-100">
          Rejected
        </Badge>
      );
    case "pending":
    default:
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800 hover:bg-amber-100">
          Pending
        </Badge>
      );
  }
};

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const AdminEnrollments = () => {
  const dispatch = useDispatch();
  const { allEnrollments, loading } = useSelector(
    (state) => state.enrollment
  ) || { allEnrollments: [], loading: false };
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(getAllEnrollments());
  }, [dispatch]);

  const filteredEnrollments = allEnrollments?.filter((e) => {
    const matchesSearch =
      e.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.student?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      e.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: allEnrollments?.length || 0,
    approved:
      allEnrollments?.filter((e) => e.status?.toLowerCase() === "approved")
        ?.length || 0,
    pending:
      allEnrollments?.filter((e) => e.status?.toLowerCase() === "pending")
        ?.length || 0,
    rejected:
      allEnrollments?.filter((e) => e.status?.toLowerCase() === "rejected")
        ?.length || 0,
  };

  if (loading && !allEnrollments?.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950">
          <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            All Enrollments
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Complete history of student course enrollments
          </p>
        </div>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "all", label: "All" },
            { key: "approved", label: "Approved" },
            { key: "pending", label: "Pending" },
            { key: "rejected", label: "Rejected" },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={statusFilter === tab.key ? "default" : "ghost"}
              size="sm"
              className="h-8 px-3 text-xs font-medium shrink-0 gap-1.5"
              onClick={() => setStatusFilter(tab.key)}
            >
              {tab.label}
              <span
                className={`text-[10px] rounded-full px-1.5 py-0.5 min-w-5 text-center ${
                  statusFilter === tab.key
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {statusCounts[tab.key]}
              </span>
            </Button>
          ))}
        </div>

        <div className="relative max-w-sm w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search enrollments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-xs font-semibold uppercase tracking-wider pl-6">
                  Student
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">
                  Course
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">
                  Date
                </TableHead>
                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider pr-6">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnrollments?.length > 0 ? (
                filteredEnrollments.map((enrollment) => (
                  <TableRow
                    key={enrollment._id}
                    className="group transition-colors"
                  >
                    <TableCell className="pl-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback className="bg-muted text-[10px] font-bold">
                            {getInitials(enrollment.student?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">
                            {enrollment.student?.name || "Unknown Student"}
                          </span>
                          <span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {enrollment.student?.email || "No email"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {enrollment.course?.title || "Unknown Course"}
                        </span>
                        {enrollment.rejectionReason &&
                          enrollment.status === "rejected" && (
                            <span className="text-[10px] text-destructive mt-0.5 max-w-xs">
                              Reason: {enrollment.rejectionReason}
                            </span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(
                          enrollment.enrolledAt || enrollment.createdAt
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-center pr-6">
                      {getStatusBadge(enrollment.status)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <Users className="h-6 w-6 opacity-40" />
                      </div>
                      <div>
                        <p className="font-medium">No enrollments found</p>
                        <p className="text-xs mt-0.5">
                          {searchQuery || statusFilter !== "all"
                            ? "Try adjusting your filters"
                            : "No enrollment records yet"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredEnrollments?.length > 0 ? (
          filteredEnrollments.map((enrollment) => (
            <Card
              key={enrollment._id}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar size="sm">
                      <AvatarFallback className="bg-muted text-[10px] font-bold">
                        {getInitials(enrollment.student?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">
                        {enrollment.student?.name || "Unknown Student"}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {enrollment.student?.email || "No email"}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(enrollment.status)}
                </div>

                <div className="mt-3 pt-3 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <GraduationCap className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium truncate">
                      {enrollment.course?.title || "Unknown Course"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {new Date(
                        enrollment.enrolledAt || enrollment.createdAt
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {enrollment.rejectionReason &&
                    enrollment.status === "rejected" && (
                      <p className="text-[10px] text-destructive">
                        Reason: {enrollment.rejectionReason}
                      </p>
                    )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
              <Users className="h-8 w-8 opacity-30" />
              <p className="text-sm font-medium">No enrollments found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminEnrollments;
