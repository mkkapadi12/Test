import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "@/Store/features/course/course.slice";
import {
  Card,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  enroll,
  getMyEnrollments,
} from "@/Store/features/enrollment/enrollment.slice";
import { toast } from "sonner";
import CourseCard from "../components/CourseCard";

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
    <div className="space-y-7 w-full">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            All Courses
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
            Explore our comprehensive catalog and find your next learning
            journey.
          </p>
        </div>
        <div className="relative w-full sm:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
        <p className="text-xs text-muted-foreground">
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
              className="overflow-hidden border-border animate-pulse"
            >
              <div className="aspect-video bg-muted" />
              <CardHeader className="p-4">
                <div className="h-4 w-1/2 bg-muted rounded mb-3" />
                <div className="h-5 w-3/4 bg-muted rounded mb-2" />
                <div className="h-4 w-full bg-muted rounded" />
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <div className="h-10 w-full bg-muted rounded-lg" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredCourses?.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              enrollment={getEnrollmentForCourse(course._id)}
              isEnrolling={enrollingId === course._id}
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-muted/50 border border-dashed border-border rounded-xl text-center">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-semibold">No courses found</p>
          <p className="text-muted-foreground text-sm mt-1 max-w-xs">
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
