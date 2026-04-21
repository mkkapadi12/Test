import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "@/Store/features/user/user.auth.slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome back, {user?.name || "Student"}!
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Here is an overview of your learning journey and recent activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-bold text-gray-900">Enrolled Courses</CardTitle>
            <BookOpen className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900">0</div>
            <p className="text-sm text-gray-500 mt-1">Active learning paths</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-bold text-gray-900">Completed Courses</CardTitle>
            <Award className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900">0</div>
            <p className="text-sm text-gray-500 mt-1">Certificates earned</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Recent Activity</h2>
          <Link to="/student/all-courses">
            <Button variant="outline" className="text-sm font-medium">
              Browse Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Card className="border-gray-200 shadow-sm border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No active courses</h3>
            <p className="text-gray-500 max-w-sm mt-2 mb-6">
              You haven't enrolled in any courses yet. Start exploring our catalog to begin learning.
            </p>
            <Link to="/student/all-courses">
              <Button className="bg-gray-900 text-white hover:bg-gray-800 font-medium px-6">
                Explore Catalog
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
