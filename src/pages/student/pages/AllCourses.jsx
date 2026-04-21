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
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { enroll } from "@/Store/features/enrollment/enrollment.slice";

const AllCourses = () => {
  const { courses, loading } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  const filteredCourses = courses?.filter(
    (course) =>
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            All Courses
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Explore our comprehensive catalog and find your next learning
            journey.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="pl-10 h-10 w-full border-gray-300 focus-visible:ring-gray-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredCourses?.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCourses.map((course) => (
            <Card
              key={course._id}
              className="flex flex-col overflow-hidden bg-white border-gray-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                <img
                  src={
                    course.image?.url ||
                    `https://ui-avatars.com/api/?name=${course.title || "course"}&background=random`
                  }
                  alt={course.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="p-5 flex-1">
                <div className="flex items-center justify-between mb-3 text-sm">
                  <span className="font-semibold text-gray-900 px-2.5 py-0.5 bg-gray-100 rounded-full">
                    {course.category || "General"}
                  </span>
                  <span className="font-bold text-gray-900">
                    {course.price > 0 ? `$${course.price.toFixed(2)}` : "Free"}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold line-clamp-2 text-gray-900 mb-2">
                  {course.title || "Untitled Course"}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-gray-500">
                  {course.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-5 pt-0 mt-auto">
                <Button
                  onClick={() => dispatch(enroll(course._id))}
                  className="w-full bg-gray-900 text-white hover:bg-gray-800 font-medium h-10"
                >
                  Enroll Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500">
            No courses found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default AllCourses;
