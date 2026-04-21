import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Calendar } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getAllEnrollments } from "@/Store/features/enrollment/enrollment.slice";

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold leading-none bg-green-50 text-green-700 border border-green-200">
          Approved
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold leading-none bg-red-50 text-red-700 border border-red-200">
          Rejected
        </span>
      );
    case "pending":
    default:
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold leading-none bg-yellow-50 text-yellow-700 border border-yellow-200">
          Pending
        </span>
      );
  }
};

const AdminEnrollments = () => {
  const dispatch = useDispatch();
  const { allEnrollments, loading } = useSelector(
    (state) => state.enrollment,
  ) || { allEnrollments: [], loading: false };

  useEffect(() => {
    dispatch(getAllEnrollments());
  }, [dispatch]);

  if (loading && !allEnrollments?.length) {
    return (
      <div className="p-8 text-gray-500">Loading enrollments...</div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-gray-900" />
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                All Enrollments
              </h2>
              <p className="text-gray-500 text-sm">
                View the complete history of student course enrollments.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4 pl-6">
                  Student
                </TableHead>
                <TableHead className="text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4">
                  Course
                </TableHead>
                <TableHead className="text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4">
                  Date
                </TableHead>
                <TableHead className="text-center text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allEnrollments?.length > 0 ? (
                allEnrollments.map((enrollment) => (
                  <TableRow
                    key={enrollment._id}
                    className="group hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">
                          {enrollment.student?.name || "Unknown Student"}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          {enrollment.student?.email || "No email"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {enrollment.course?.title || "Unknown Course"}
                        </span>
                        {enrollment.rejectionReason && enrollment.status === "rejected" && (
                          <span className="text-[10px] text-red-500 mt-0.5 flex flex-wrap max-w-xs">
                            Reason: {enrollment.rejectionReason}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 opacity-50" />
                        {new Date(enrollment.enrolledAt || enrollment.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(enrollment.status)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-48 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 opacity-20" />
                      <p>No enrollments found.</p>
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

export default AdminEnrollments;
