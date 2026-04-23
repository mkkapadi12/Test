import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  BookOpen,
  Upload,
  Search,
  X,
  ImageIcon,
  Clock,
  User,
  GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  createCourse,
  deleteCourse,
  getAdminAllCourses,
  updateCourseStatus,
} from "@/Store/features/course/course.slice";

const AdminCourses = () => {
  const { admincourses, loading } = useSelector((state) => state.course) || {
    admincourses: [],
    loading: false,
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [image, setImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fileInputRef = useRef(null);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      instructor: "",
      duration: "",
    },
  });

  const dispatch = useDispatch();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    const toastId = toast.loading("Adding course...");
    try {
      const result = await dispatch(createCourse(data)).unwrap();
      toast.success(result?.msg || "Course added successfully!", {
        id: toastId,
      });
      form.reset();
      setImage(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Operation failed",
        { id: toastId }
      );
    }
  };

  const handleUpdateStatus = async (id, isActive) => {
    const toastId = toast.loading("Updating course status...");
    try {
      await dispatch(updateCourseStatus({ id, isActive })).unwrap();
      toast.success("Course status updated successfully!", { id: toastId });
      dispatch(getAdminAllCourses());
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : error?.message || "Update failed",
        { id: toastId }
      );
    }
  };

  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting course...");
    try {
      const result = await dispatch(deleteCourse(id)).unwrap();
      toast.success(result?.message || "Course deleted!", { id: toastId });
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : error?.message || "Delete failed",
        { id: toastId }
      );
    }
  };

  useEffect(() => {
    dispatch(getAdminAllCourses());
  }, [dispatch]);

  const filteredCourses = admincourses?.filter(
    (c) =>
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950">
            <GraduationCap className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Courses
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage your educational catalog
            </p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 px-5 font-semibold gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Course</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-bold">
                Add New Course
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new course to your platform.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-2"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Course Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Master React in 30 Days"
                    {...form.register("title", {
                      required: "Title is required",
                    })}
                  />
                  {form.formState.errors.title && (
                    <p className="text-destructive text-xs font-medium">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2 space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium"
                  >
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Brief overview..."
                    {...form.register("description", {
                      required: "Description is required",
                    })}
                  />
                  {form.formState.errors.description && (
                    <p className="text-destructive text-xs font-medium">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="instructor"
                    className="text-sm font-medium"
                  >
                    Instructor
                  </Label>
                  <Input
                    id="instructor"
                    type="text"
                    placeholder="Rahul Kumar"
                    {...form.register("instructor", {
                      required: "Instructor is required",
                    })}
                  />
                  {form.formState.errors.instructor && (
                    <p className="text-destructive text-xs font-medium">
                      {form.formState.errors.instructor.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium">
                    Duration
                  </Label>
                  <Input
                    id="duration"
                    placeholder="30 days"
                    {...form.register("duration", {
                      required: "Duration is required",
                    })}
                  />
                  {form.formState.errors.duration && (
                    <p className="text-destructive text-xs font-medium">
                      {form.formState.errors.duration.message}
                    </p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="col-span-2 space-y-3">
                  <Label className="text-sm font-medium">
                    Cover Image
                  </Label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40 hover:bg-muted/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">
                        {image ? image.name : "Drop image or click to browse"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPEG, PNG cover image
                      </p>
                    </div>
                  </div>
                  {image && (
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs">
                      <ImageIcon className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate flex-1">{image.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImage(null);
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="pt-4 border-t">
                <Button type="submit" className="w-full font-bold h-11">
                  Save Course
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[70px] text-xs font-semibold uppercase tracking-wider pl-6">
                  Cover
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">
                  Course Info
                </TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wider">
                  Category
                </TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wider">
                  Price
                </TableHead>
                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses?.length > 0 ? (
                filteredCourses.map((course) => (
                  <TableRow
                    key={course._id}
                    className="group transition-colors"
                  >
                    <TableCell className="pl-6 py-3">
                      <div className="h-10 w-14 rounded-lg bg-muted overflow-hidden border border-border">
                        <img
                          src={
                            course.image?.url ||
                            `https://ui-avatars.com/api/?name=${course.title}&background=random`
                          }
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          {course.title || "Untitled Course"}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[300px]">
                          {course.description || "No description"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="font-medium">
                        {course.category || "General"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {course.price > 0
                        ? `$${course.price.toFixed(2)}`
                        : "Free"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={course.isActive}
                        onCheckedChange={(newValue) =>
                          handleUpdateStatus(course._id, newValue)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        onClick={() => handleDelete(course._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <BookOpen className="h-6 w-6 opacity-40" />
                      </div>
                      <div>
                        <p className="font-medium">No courses found</p>
                        <p className="text-xs mt-0.5">
                          {searchQuery
                            ? "Try a different search term"
                            : "Start by adding your first course"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredCourses?.length > 0 ? (
          filteredCourses.map((course) => (
            <Card
              key={course._id}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-14 w-18 rounded-lg bg-muted overflow-hidden border border-border shrink-0">
                    <img
                      src={
                        course.image?.url ||
                        `https://ui-avatars.com/api/?name=${course.title}&background=random`
                      }
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm truncate">
                        {course.title || "Untitled Course"}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(course._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {course.description || "No description"}
                    </p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <Badge variant="secondary" className="h-5 text-[10px]">
                        {course.category || "General"}
                      </Badge>
                      <span className="text-xs font-semibold tabular-nums">
                        {course.price > 0
                          ? `$${course.price.toFixed(2)}`
                          : "Free"}
                      </span>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <span className="text-[10px] text-muted-foreground">
                          {course.isActive ? "Active" : "Inactive"}
                        </span>
                        <Switch
                          checked={course.isActive}
                          onCheckedChange={(newValue) =>
                            handleUpdateStatus(course._id, newValue)
                          }
                          className="scale-75"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
              <BookOpen className="h-8 w-8 opacity-30" />
              <p className="text-sm font-medium">No courses found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;
