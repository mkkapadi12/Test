import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Brain,
  BookOpen,
  ArrowRight,
  PlayCircle,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MyLearning = () => {
  const { studentEnrollments } = useSelector((state) => state.enrollment);

  const approvedCourses = studentEnrollments?.filter(
    (e) => e.status === "approved",
  );

  return (
    <div className="space-y-7 w-full">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gray-900 flex items-center justify-center shadow-sm">
              <Brain className="h-4 w-4 text-white" />
            </div>
            My Learning
          </h1>
          <p className="text-gray-400 mt-1.5 text-sm">
            Continue where you left off and track your progress.
          </p>
        </div>
        <Link to="/student/all-courses" className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-sm font-medium"
          >
            Find More Courses
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Content */}
      {approvedCourses?.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {approvedCourses.map((enrollment) => (
            <Card
              key={enrollment._id}
              className="group bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Thumbnail placeholder */}
              <div className="aspect-video bg-linear-to-br from-gray-800 to-gray-600 relative overflow-hidden flex items-center justify-center">
                {enrollment.course?.image?.url ? (
                  <img
                    src={enrollment.course.image.url}
                    alt={enrollment.course.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <BookOpen className="h-10 w-10 text-white/40" />
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <PlayCircle className="h-7 w-7 text-gray-900" />
                  </div>
                </div>
              </div>

              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                  {enrollment.course?.title || "Untitled Course"}
                </CardTitle>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Badge
                    variant="outline"
                    className="text-xs border-green-200 text-green-700 bg-green-50"
                  >
                    Enrolled
                  </Badge>
                  {enrollment.course?.category && (
                    <Badge
                      variant="secondary"
                      className="text-xs text-gray-500"
                    >
                      {enrollment.course.category}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="px-4 pb-4 mt-auto">
                <Button className="w-full bg-gray-900 text-white hover:bg-gray-700 font-medium h-9 text-sm gap-2 transition-colors">
                  <PlayCircle className="h-4 w-4" />
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-gray-200 bg-gray-50/50">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <GraduationCap className="h-7 w-7 text-gray-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2">
            No courses to learn yet
          </h3>
          <p className="text-gray-400 text-sm max-w-xs">
            Once your enrollment is approved, your courses will appear here.
          </p>
          <div className="flex gap-3 mt-6 flex-wrap justify-center">
            <Link to="/student/all-courses">
              <Button className="bg-gray-900 text-white hover:bg-gray-700 gap-2">
                <BookOpen className="h-4 w-4" />
                Browse Courses
              </Button>
            </Link>
            <Link to="/student/my-enrollments">
              <Button variant="outline" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                View Enrollments
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyLearning;
