import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "@/Store/features/user/user.auth.slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Award,
  ArrowRight,
  Clock,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getMyEnrollments } from "@/Store/features/enrollment/enrollment.slice";
import { Badge } from "@/components/ui/badge";

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const { studentEnrollments } = useSelector((state) => state.enrollment);
  const dispatch = useDispatch();

  const approvedEnrollments = studentEnrollments.filter(
    (enrollment) => enrollment.status === "approved",
  );

  const pendingEnrollments = studentEnrollments.filter(
    (enrollment) => enrollment.status === "pending",
  );

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getMyEnrollments());
  }, [dispatch]);

  return (
    <div className="space-y-8 w-full">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-gray-900 via-gray-800 to-gray-700 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">
              Welcome back
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {user?.name || "Student"}! 👋
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-md">
            Keep up the great work on your learning journey. Here&apos;s your
            overview.
          </p>
        </div>
        {/* Decorative blob */}
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute right-10 bottom-0 h-32 w-32 rounded-full bg-white/5 blur-xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Courses
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900">
              {approvedEnrollments.length}
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Enrolled &amp; approved
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              Completed Courses
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <Award className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900">0</div>
            <p className="text-xs text-gray-400 mt-1">Certificates earned</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending Requests
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900">
              {pendingEnrollments.length}
            </div>
            <p className="text-xs text-gray-400 mt-1">Awaiting admin review</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending enrollment alert */}
      {pendingEnrollments.length > 0 && (
        <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5">
          <div className="h-9 w-9 shrink-0 rounded-lg bg-amber-100 flex items-center justify-center">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-amber-900">
              Pending Approval
            </h3>
            <p className="text-sm text-amber-700 mt-1">
              You have{" "}
              <span className="font-bold">{pendingEnrollments.length}</span>{" "}
              enrollment request(s) awaiting administrator review.
            </p>
          </div>
          <Link to="/student/my-enrollments" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-medium border-amber-300 text-amber-800 hover:bg-amber-100"
            >
              View
              <ArrowRight className="ml-1.5 h-3 w-3" />
            </Button>
          </Link>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              Recent Activity
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Your latest learning progress
            </p>
          </div>
          <Link to="/student/all-courses">
            <Button
              variant="outline"
              size="sm"
              className="text-sm font-medium gap-1.5"
            >
              Browse Courses
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {approvedEnrollments.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {approvedEnrollments.slice(0, 3).map((enrollment) => (
              <Card
                key={enrollment._id}
                className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all group overflow-hidden"
              >
                <div className="h-1.5 bg-linear-to-r from-gray-700 to-gray-500" />
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug">
                        {enrollment.course?.title || "Course"}
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-2 text-xs border-green-200 text-green-700 bg-green-50"
                      >
                        Enrolled
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-gray-200 shadow-sm border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-14 text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                No active courses
              </h3>
              <p className="text-gray-400 max-w-sm mt-2 mb-6 text-sm">
                You haven&apos;t enrolled in any courses yet. Start exploring
                our catalog!
              </p>
              <Link to="/student/all-courses">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 font-medium px-6 gap-2">
                  <Sparkles className="h-4 w-4" />
                  Explore Catalog
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
