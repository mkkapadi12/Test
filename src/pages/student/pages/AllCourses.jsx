import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "@/Store/features/course/course.slice";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Loader2,
  BookOpen,
  Tag,
  DollarSign,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  enroll,
  getMyEnrollments,
} from "@/Store/features/enrollment/enrollment.slice";
import { toast } from "sonner";

const AllCourses = () => {
  const { courses, loading } = useSelector((state) => state.course);
  const { studentEnrollments } = useSelector((state) => state.enrollment);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollingId, setEnrollingId] = useState(null);

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  const filteredCourses = courses?.filter(
    (course) =>
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    const toastId = toast.loading("Sending enrollment request...");
    try {
      const result = await dispatch(enroll(courseId)).unwrap();
      toast.success(result?.msg || "Enrollment request sent successfully!", {
        id: toastId,
      });
      dispatch(getMyEnrollments());
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Operation failed",
        { id: toastId },
      );
    } finally {
      setEnrollingId(null);
    }
  };

  const getEnrollmentForCourse = (courseId) =>
    studentEnrollments?.find((e) => e?.course?._id === courseId);

  return (
    <div className="space-y-7 max-w-7xl">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            All Courses
          </h1>
          <p className="text-gray-400 mt-1.5 text-sm sm:text-base">
            Explore our comprehensive catalog and find your next learning
            journey.
          </p>
        </div>
        <div className="relative w-full sm:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
          <Input
            type="search"
            placeholder="Search courses..."
            className="pl-10 pr-9 h-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-gray-400">
          {filteredCourses?.length ?? 0} course
          {filteredCourses?.length !== 1 ? "s" : ""} found
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden border-gray-200 animate-pulse"
            >
              <div className="aspect-video bg-gray-100" />
              <CardHeader className="p-4">
                <div className="h-4 w-1/2 bg-gray-100 rounded mb-3" />
                <div className="h-5 w-3/4 bg-gray-100 rounded mb-2" />
                <div className="h-4 w-full bg-gray-100 rounded" />
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <div className="h-10 w-full bg-gray-100 rounded-lg" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredCourses?.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCourses.map((course) => {
            const enrollment = getEnrollmentForCourse(course._id);
            const isEnrolled = !!enrollment;
            const isRejected = enrollment?.status === "rejected";

            return (
              <Card
                key={course._id}
                className="flex flex-col overflow-hidden bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group py-0"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img
                    src={
                      course.image?.url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title || "course")}&background=111827&color=fff&size=200`
                    }
                    alt={course.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Price badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white text-gray-900 border border-gray-200 shadow-sm font-bold text-xs px-2 py-0.5 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {course.price > 0 ? course.price.toFixed(2) : "Free"}
                    </Badge>
                  </div>
                </div>

                {/* Card body */}
                <CardHeader className="p-4 flex-1">
                  {/* Category */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <Tag className="h-3 w-3 text-gray-400" />
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                      {course.category || "General"}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold line-clamp-2 text-gray-900 leading-snug mb-1.5">
                    {course.title || "Untitled Course"}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-gray-400 text-sm">
                    {course.description || "No description provided."}
                  </CardDescription>

                  {/* Rejection reason */}
                  {isRejected && (
                    <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-2.5">
                      <p className="text-xs font-semibold text-red-600 mb-0.5">
                        Rejected
                      </p>
                      <p className="text-xs text-red-500 line-clamp-2">
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
                      className="w-full font-medium h-10 border-gray-200 text-gray-500"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      {enrollment?.status === "pending"
                        ? "Pending Approval"
                        : enrollment?.status === "approved"
                          ? "Enrolled"
                          : "Rejected"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEnroll(course._id)}
                      disabled={enrollingId === course._id}
                      className="w-full bg-gray-900 text-white hover:bg-gray-700 font-medium h-10 transition-colors"
                    >
                      {enrollingId === course._id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Enroll Now
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center">
          <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-700 font-semibold">No courses found</p>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">
            Try adjusting your search or clear the filter to see all courses.
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AllCourses;
