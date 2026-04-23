import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Brain,
  BookOpen,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LearningCard from "../components/LearningCard";

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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            My Learning
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
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
            <LearningCard key={enrollment._id} enrollment={enrollment} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-border bg-muted/30">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <GraduationCap className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-base font-bold mb-2">
            No courses to learn yet
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Once your enrollment is approved, your courses will appear here.
          </p>
          <div className="flex gap-3 mt-6 flex-wrap justify-center">
            <Link to="/student/all-courses">
              <Button className="gap-2">
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
