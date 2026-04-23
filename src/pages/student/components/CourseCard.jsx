import React from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Loader2,
  User,
  Clock,
} from "lucide-react";

const CourseCard = ({
  course,
  enrollment,
  isEnrolling,
  onEnroll,
}) => {
  const isEnrolled = !!enrollment;
  const isRejected = enrollment?.status === "rejected";

  const getEnrollButtonLabel = () => {
    if (!enrollment) return "Enroll Now";
    switch (enrollment.status) {
      case "pending":
        return "Pending Approval";
      case "approved":
        return "Enrolled";
      case "rejected":
        return "Rejected";
      default:
        return "Enroll Now";
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden border-border shadow-sm hover:shadow-lg transition-all duration-300 group py-0">
      {/* Thumbnail */}
      <div className="aspect-video bg-muted relative overflow-hidden">
        <img
          src={
            course.image?.url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title || "course")}&background=111827&color=fff&size=200`
          }
          alt={course.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Card body */}
      <CardHeader className="p-4 flex-1">
        {/* Instructor + Duration */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="truncate">{course.instructor || "Instructor"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{course.duration || "—"}</span>
          </div>
        </div>

        <CardTitle className="text-base font-bold line-clamp-2 leading-snug mb-1.5">
          {course.title || "Untitled Course"}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {course.description || "No description provided."}
        </CardDescription>

        {/* Rejection reason */}
        {isRejected && (
          <div className="mt-3 bg-destructive/10 border border-destructive/20 rounded-lg p-2.5">
            <p className="text-xs font-semibold text-destructive mb-0.5">
              Rejected
            </p>
            <p className="text-xs text-destructive/80 line-clamp-2">
              {enrollment?.rejectionReason || "No reason provided"}
            </p>
          </div>
        )}
      </CardHeader>

      {/* CTA */}
      <CardFooter className="p-4 pt-0 mt-auto">
        {isEnrolled ? (
          <Button
            disabled
            variant="outline"
            className="w-full font-medium h-10"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {getEnrollButtonLabel()}
          </Button>
        ) : (
          <Button
            onClick={() => onEnroll?.(course._id)}
            disabled={isEnrolling}
            className="w-full font-semibold h-10 transition-colors"
          >
            {isEnrolling && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Enroll Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
