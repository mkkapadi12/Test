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
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusIcon } from "@/helper";
import { Link } from "react-router-dom";
import EnrollmentCard from "../components/EnrollmentCard";

const MyEnrollments = () => {
  const dispatch = useDispatch();
  const { studentEnrollments, loading } = useSelector(
    (state) => state.enrollment,
  );

  useEffect(() => {
    dispatch(getMyEnrollments());
  }, [dispatch]);

  return (
    <div className="space-y-7 w-full">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <GraduationCap className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            My Enrollments
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
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
                className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5 text-sm shadow-sm"
              >
                <StatusIcon status={s} />
                <span className="font-medium capitalize">{s}</span>
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
            <Card key={i} className="animate-pulse border-border">
              <CardHeader className="gap-2 pb-4">
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </CardHeader>
              <CardContent className="pb-4">
                <div className="h-8 bg-muted rounded w-full" />
              </CardContent>
              <CardFooter className="pt-4 border-t flex justify-between">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-6 w-16 bg-muted rounded-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : studentEnrollments?.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {studentEnrollments.map((enrollment) => (
            <EnrollmentCard key={enrollment._id} enrollment={enrollment} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-border bg-muted/30">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 shadow-inner">
            <GraduationCap className="h-7 w-7 text-muted-foreground" />
          </div>
          <CardTitle className="mb-2 text-lg">No Enrollments Yet</CardTitle>
          <CardDescription className="max-w-sm text-sm">
            You haven&apos;t requested enrollment in any courses. Browse the
            catalog and enroll!
          </CardDescription>
          <Link to="/student/all-courses" className="mt-6">
            <Button className="gap-2">
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
