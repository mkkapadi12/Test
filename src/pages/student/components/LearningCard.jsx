import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  PlayCircle,
  User,
  Clock,
} from "lucide-react";

const LearningCard = ({ enrollment }) => {
  const course = enrollment?.course;

  return (
    <Card className="group overflow-hidden border-border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col py-0">
      {/* Thumbnail */}
      <div className="aspect-video bg-muted relative overflow-hidden flex items-center justify-center">
        {course?.image?.url ? (
          <img
            src={course.image.url}
            alt={course.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-primary/80 to-primary/40 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-primary-foreground/40" />
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <PlayCircle className="h-7 w-7 text-foreground" />
          </div>
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-semibold line-clamp-2 leading-snug">
          {course?.title || "Untitled Course"}
        </CardTitle>
        {/* Meta info */}
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <Badge
            variant="outline"
            className="text-[10px] border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
          >
            Enrolled
          </Badge>
          {course?.instructor && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="truncate">{course.instructor}</span>
            </div>
          )}
          {course?.duration && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{course.duration}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 mt-auto">
        <Button className="w-full font-medium h-9 text-sm gap-2 transition-colors">
          <PlayCircle className="h-4 w-4" />
          Continue Learning
        </Button>
      </CardContent>
    </Card>
  );
};

export default LearningCard;
