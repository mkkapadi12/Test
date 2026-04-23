import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyEnrollments } from "@/Store/features/enrollment/enrollment.slice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, StatusIcon } from "@/helper";
import { Link } from "react-router-dom";

const MyEnrollments = () => {
  const dispatch = useDispatch();
  const { studentEnrollments, loading } = useSelector(
    (state) => state.enrollment,
  );

  useEffect(() => {
    dispatch(getMyEnrollments());
  }, [dispatch]);

  return (
    <div className="space-y-7 max-w-7xl">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gray-900 flex items-center justify-center shadow-sm">
              <GraduationCap className="h-4.5 w-4.5 text-white" />
            </div>
            My Enrollments
          </h1>
          <p className="text-gray-400 mt-1.5 text-sm">
            View and track the status of all your course enrollment requests.
          </p>
        </div>
        <Link to="/student/all-courses" className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-sm font-medium"
          >
            Browse More Courses
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Summary strip */}
      {!loading && studentEnrollments?.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {["approved", "pending", "rejected"].map((s) => {
            const count = studentEnrollments.filter(
              (e) => e.status === s,
            ).length;
            if (count === 0) return null;
            return (
              <div
                key={s}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm shadow-sm"
              >
                <StatusIcon status={s} />
                <span className="font-medium capitalize text-gray-700">
                  {s}
                </span>
                <Badge
                  variant="secondary"
                  className="h-5 min-w-5 text-xs px-1.5"
                >
                  {count}
                </Badge>
              </div>
            );
          })}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse border-gray-200">
              <CardHeader className="gap-2 pb-4">
                <div className="h-5 w-3/4 bg-gray-100 rounded" />
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
              </CardHeader>
              <CardContent className="pb-4">
                <div className="h-8 bg-gray-100 rounded w-full" />
              </CardContent>
              <CardFooter className="pt-4 border-t flex justify-between">
                <div className="h-4 w-20 bg-gray-100 rounded" />
                <div className="h-6 w-16 bg-gray-100 rounded-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : studentEnrollments?.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {studentEnrollments.map((enrollment) => (
            <Card
              key={enrollment._id}
              className="flex flex-col overflow-hidden bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              {/* Status accent strip */}
              <div
                className={`h-1 w-full ${
                  enrollment.status === "approved"
                    ? "bg-green-400"
                    : enrollment.status === "rejected"
                      ? "bg-red-400"
                      : "bg-amber-400"
                }`}
              />

              <CardHeader className="pb-3 px-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle
                      className="line-clamp-2 leading-snug text-sm font-semibold text-gray-900"
                      title={enrollment.course?.title}
                    >
                      {enrollment.course?.title || "Unknown Course"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 mt-1 text-xs">
                      <Calendar className="w-3 h-3 shrink-0" />
                      {new Date(enrollment.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 px-4 pb-3">
                {enrollment.rejectionReason &&
                  enrollment.status === "rejected" && (
                    <div className="bg-red-50 border border-red-100 text-red-700 text-xs p-3 rounded-lg">
                      <span className="font-semibold block mb-0.5">
                        Rejection reason:
                      </span>
                      {enrollment.rejectionReason}
                    </div>
                  )}

                {enrollment.status === "pending" && (
                  <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    Awaiting admin approval
                  </div>
                )}

                {enrollment.status === "approved" && (
                  <div className="flex justify-center">
                    <Link to="/student/learning">
                      <Button className="bg-gray-900 text-white hover:bg-gray-700 text-xs font-semibold h-9 px-4 gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        Start Learning
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>

              <CardFooter className="px-4 py-3 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <StatusIcon status={enrollment.status} />
                  <span className="text-xs font-medium capitalize text-gray-500">
                    {enrollment.status}
                  </span>
                </div>
                <StatusBadge status={enrollment.status} />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-gray-200 bg-gray-50/50">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-inner">
            <GraduationCap className="h-7 w-7 text-gray-400" />
          </div>
          <CardTitle className="mb-2 text-lg text-gray-800">
            No Enrollments Yet
          </CardTitle>
          <CardDescription className="max-w-sm text-sm text-gray-400">
            You haven&apos;t requested enrollment in any courses. Browse the
            catalog and enroll!
          </CardDescription>
          <Link to="/student/all-courses" className="mt-6">
            <Button className="bg-gray-900 text-white hover:bg-gray-700 gap-2">
              <BookOpen className="h-4 w-4" />
              Browse Courses
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default MyEnrollments;
