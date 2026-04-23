import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { StatusBadge, StatusIcon } from "@/helper";
import { Link } from "react-router-dom";

const EnrollmentCard = ({ enrollment }) => {
  const statusAccentColor = {
    approved: "bg-emerald-500",
    rejected: "bg-red-500",
    pending: "bg-amber-500",
  };

  return (
    <Card className="flex flex-col overflow-hidden border-border shadow-sm hover:shadow-md transition-all duration-200 group py-0">
      {/* Status accent strip */}
      <div
        className={`h-1 w-full ${statusAccentColor[enrollment.status] || "bg-amber-500"}`}
      />

      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <CardTitle
              className="line-clamp-2 leading-snug text-sm font-semibold"
              title={enrollment.course?.title}
            >
              {enrollment.course?.title || "Unknown Course"}
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5 mt-1 text-xs">
              <Calendar className="w-3 h-3 shrink-0" />
              {new Date(enrollment.enrolledAt || enrollment.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-4 pb-3">
        {/* Course meta */}
        <div className="flex items-center gap-3 mb-3">
          {enrollment.course?.instructor && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="truncate">{enrollment.course.instructor}</span>
            </div>
          )}
          {enrollment.course?.duration && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{enrollment.course.duration}</span>
            </div>
          )}
        </div>

        {/* Status-specific content */}
        {enrollment.rejectionReason && enrollment.status === "rejected" && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg">
            <span className="font-semibold block mb-0.5">
              Rejection reason:
            </span>
            {enrollment.rejectionReason}
          </div>
        )}

        {enrollment.status === "pending" && (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            Awaiting admin approval
          </div>
        )}

        {enrollment.status === "approved" && (
          <div className="flex justify-center">
            <Link to="/student/learning">
              <Button className="text-xs font-semibold h-9 px-4 gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Start Learning
              </Button>
            </Link>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <StatusIcon status={enrollment.status} />
          <span className="text-xs font-medium capitalize text-muted-foreground">
            {enrollment.status}
          </span>
        </div>
        <StatusBadge status={enrollment.status} />
      </CardFooter>
    </Card>
  );
};

export default EnrollmentCard;
