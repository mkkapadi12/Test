import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2, BookOpen, Upload, Eye, EyeOff } from "lucide-react";

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

import {
  createCourse,
  deleteCourse,
  getAdminAllCourses,
  getAllCourses,
  updateCourseStatus,
} from "@/Store/features/course/course.slice";
import { Switch } from "@/components/ui/switch";

const AdminCourses = () => {
  const { admincourses, loading } = useSelector((state) => state.course) || {
    admincourses: [],
    loading: false,
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [image, setImage] = useState(null);

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
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Operation failed",
        { id: toastId },
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
        { id: toastId },
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
        { id: toastId },
      );
    }
  };

  useEffect(() => {
    dispatch(getAdminAllCourses());
  }, [dispatch]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading courses...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-gray-900" />
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Courses Management
              </h2>
              <p className="text-gray-500 text-sm">
                Review and update your educational catalog.
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-900 text-white hover:bg-gray-800 font-semibold h-10 px-6">
                <Plus className="w-4 h-4 mr-2" />
                Add New Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white border-gray-200">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Add New Course
                </DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new course to your
                  platform.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-2"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label
                      htmlFor="title"
                      className="text-gray-700 font-medium text-sm"
                    >
                      Course Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g. Master React in 30 Days"
                      {...form.register("title", {
                        required: "Title is required",
                      })}
                      className="border-gray-300 focus-visible:ring-gray-900"
                    />
                    {form.formState.errors.title && (
                      <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider">
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-gray-700 font-medium text-sm"
                    >
                      Description
                    </Label>
                    <Input
                      id="description"
                      placeholder="Brief overview..."
                      {...form.register("description", {
                        required: "Description is required",
                      })}
                      className="border-gray-300 focus-visible:ring-gray-900"
                    />
                    {form.formState.errors.description && (
                      <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="instructor"
                      className="text-gray-700 font-medium text-sm"
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
                      className="border-gray-300 focus-visible:ring-gray-900"
                    />
                    {form.formState.errors.instructor && (
                      <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider">
                        {form.formState.errors.instructor.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="duration"
                      className="text-gray-700 font-medium text-sm"
                    >
                      Duration
                    </Label>
                    <Input
                      id="duration"
                      placeholder="30 days"
                      {...form.register("duration", {
                        required: "Duration is required",
                      })}
                      className="border-gray-300 focus-visible:ring-gray-900"
                    />
                    {form.formState.errors.duration && (
                      <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider">
                        {form.formState.errors.duration.message}
                      </p>
                    )}
                  </div>

                  <div
                    className={`col-span-2 border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                      dragActive
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <div
                      className="cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-900 font-medium">
                        {image ? image.name : "Click or drag thumbnail here"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload course cover image (JPEG, PNG)
                      </p>
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-4 border-t border-gray-100">
                  <Button
                    type="submit"
                    className="w-full bg-gray-900 text-white hover:bg-gray-800 font-bold h-11"
                  >
                    Save Course
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-b border-gray-200">
                <TableHead className="w-[80px] text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4 pl-6 text-center">
                  Cover
                </TableHead>
                <TableHead className="text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4">
                  Course Info
                </TableHead>
                <TableHead className="text-right text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4">
                  Category
                </TableHead>
                <TableHead className="text-right text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4">
                  Price
                </TableHead>
                <TableHead className="text-center text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4">
                  Status
                </TableHead>
                <TableHead className="text-center text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admincourses?.length > 0 ? (
                admincourses.map((course) => (
                  <TableRow
                    key={course._id}
                    className="group hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <TableCell className="pl-6 py-4 flex justify-center">
                      <div className="w-16 h-12 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={
                            course.image?.url ||
                            `https://ui-avatars.com/api/?name=${course.title}&background=random`
                          }
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">
                          {course.title || "Untitled Course"}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-[300px]">
                          {course.description || "No description"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        {course.category || "General"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-gray-900">
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
                        size="icon-sm"
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-lg"
                        onClick={() => handleDelete(course._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-48 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="w-8 h-8 opacity-20" />
                      <p>No courses found in the catalog.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default AdminCourses;
