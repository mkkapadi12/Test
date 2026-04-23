import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Search,
  X,
  Mail,
  GraduationCap,
  Clock,
  AlertCircle,
  Inbox,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  getPendingRequests,
  approveOrReject,
} from "@/Store/features/enrollment/enrollment.slice";

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const PendingRequests = () => {
  const dispatch = useDispatch();
  const { pendingRequests, loading } = useSelector(
    (state) => state.enrollment
  ) || { pendingRequests: [], loading: false };
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectDialog, setRejectDialog] = useState({
    open: false,
    enrollmentId: null,
  });
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    dispatch(getPendingRequests());
  }, [dispatch]);

  const handleApprove = async (enrollmentId) => {
    const toastId = toast.loading("Approving enrollment...");
    try {
      const resultAction = await dispatch(
        approveOrReject({ enrollmentId, status: "approved" })
      ).unwrap();

      toast.success(resultAction?.msg || "Enrollment approved!", {
        id: toastId,
      });
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Operation failed", {
        id: toastId,
      });
    }
  };

  const handleReject = async () => {
    if (!rejectDialog.enrollmentId) return;
    const toastId = toast.loading("Rejecting enrollment...");
    try {
      const resultAction = await dispatch(
        approveOrReject({
          enrollmentId: rejectDialog.enrollmentId,
          status: "rejected",
          rejectionReason: rejectionReason || "Requirements not met.",
        })
      ).unwrap();

      toast.success(resultAction?.msg || "Enrollment rejected.", {
        id: toastId,
      });
      setRejectDialog({ open: false, enrollmentId: null });
      setRejectionReason("");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Operation failed", {
        id: toastId,
      });
    }
  };

  const filteredRequests = pendingRequests?.filter(
    (e) =>
      e.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.student?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !pendingRequests?.length) {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950">
              <UserCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            {pendingRequests?.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {pendingRequests.length}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Enrollment Requests
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Review and manage pending student applications
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      {pendingRequests?.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
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
      )}

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
                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wider pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests?.length > 0 ? (
                filteredRequests.map((enrollment) => (
                  <TableRow
                    key={enrollment._id}
                    className="group transition-colors"
                  >
                    <TableCell className="pl-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 text-[10px] font-bold">
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
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-sm">
                          {enrollment.course?.title || "Unknown Course"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800 hover:bg-amber-100 gap-1">
                        <Clock className="h-3 w-3" />
                        {enrollment.status || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          className="h-8 px-3 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs"
                          onClick={() => handleApprove(enrollment._id)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive font-medium text-xs"
                          onClick={() =>
                            setRejectDialog({
                              open: true,
                              enrollmentId: enrollment._id,
                            })
                          }
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <Inbox className="h-6 w-6 opacity-40" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {searchQuery
                            ? "No matching requests"
                            : "All caught up!"}
                        </p>
                        <p className="text-xs mt-0.5">
                          {searchQuery
                            ? "Try a different search term"
                            : "No pending enrollment requests right now"}
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
        {filteredRequests?.length > 0 ? (
          filteredRequests.map((enrollment) => (
            <Card
              key={enrollment._id}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 text-xs font-bold">
                      {getInitials(enrollment.student?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {enrollment.student?.name || "Unknown Student"}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {enrollment.student?.email || "No email"}
                        </p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800 hover:bg-amber-100 shrink-0 text-[10px]">
                        Pending
                      </Badge>
                    </div>

                    <div className="mt-2.5 pt-2.5 border-t border-border">
                      <div className="flex items-center gap-2 text-xs mb-3">
                        <GraduationCap className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="font-medium truncate">
                          {enrollment.course?.title || "Unknown Course"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="flex-1 h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs"
                          onClick={() => handleApprove(enrollment._id)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 font-medium text-xs"
                          onClick={() =>
                            setRejectDialog({
                              open: true,
                              enrollmentId: enrollment._id,
                            })
                          }
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
              <Inbox className="h-8 w-8 opacity-30" />
              <div className="text-center">
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs mt-0.5">No pending requests</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Rejection Reason Dialog */}
      <Dialog
        open={rejectDialog.open}
        onOpenChange={(open) => {
          setRejectDialog({ ...rejectDialog, open });
          if (!open) setRejectionReason("");
        }}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Reject Enrollment
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this enrollment request.
              This will be visible to the student.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Rejection Reason
            </Label>
            <Input
              id="reason"
              placeholder="e.g., Prerequisites not completed"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialog({ open: false, enrollmentId: null });
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              className="gap-1.5"
            >
              <XCircle className="h-4 w-4" />
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingRequests;
