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
import { BookOpen, Calendar, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, StatusIcon } from "@/helper";

const MyEnrollments = () => {
  const dispatch = useDispatch();
  const { studentEnrollments, loading } = useSelector(
    (state) => state.enrollment,
  );

  useEffect(() => {
    dispatch(getMyEnrollments());
  }, [dispatch]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          My Enrollments
        </h1>
        <p className="text-muted-foreground">
          View and track the status of your course enrollments.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="gap-2 pb-4">
                <div className="h-5 w-3/4 bg-muted rounded"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="h-8 bg-muted rounded w-full"></div>
              </CardContent>
              <CardFooter className="pt-4 border-t flex justify-between">
                <div className="h-4 w-20 bg-muted rounded"></div>
                <div className="h-6 w-16 bg-muted rounded-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : studentEnrollments?.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {studentEnrollments.map((enrollment) => (
            <Card
              key={enrollment._id}
              className="flex flex-col overflow-hidden transition-all hover:shadow-md border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 w-full">
                    <CardTitle
                      className="line-clamp-2 leading-tight text-lg"
                      title={enrollment.course?.title}
                    >
                      {enrollment.course?.title || "Unknown Course"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 mt-2">
                      <Calendar className="w-3.5 h-3.5" />
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
              <CardContent className="flex-1 pb-4 flex items-center justify-center">
                {enrollment.rejectionReason &&
                  enrollment.status === "rejected" && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
                      <span className="font-semibold block mb-1">
                        Reason for rejection:
                      </span>
                      {enrollment.rejectionReason}
                    </div>
                  )}
                {enrollment.status === "pending" && (
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 opacity-50" />
                    Course enrollment request
                  </div>
                )}
                {enrollment.status === "approved" && (
                  <div className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
                    <Button className="bg-gray-900 text-white hover:bg-gray-800 font-semibold h-10 px-6">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Start Learning
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-4 border-t border-border/50 bg-muted/20">
                <div className="flex items-center gap-2">
                  <StatusIcon status={enrollment.status} />
                  <span className="text-sm font-medium capitalize text-muted-foreground">
                    {enrollment.status}
                  </span>
                </div>
                <StatusBadge status={enrollment.status} />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed bg-card/30">
          <div className="rounded-full bg-muted/50 p-4 mb-4 ring-1 ring-border/50">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="mb-2 text-xl">No Enrollments Yet</CardTitle>
          <CardDescription className="max-w-sm text-base">
            You haven't requested enrollment in any courses yet. Browse
            available courses to start learning!
          </CardDescription>
        </Card>
      )}
    </div>
  );
};

export default MyEnrollments;
