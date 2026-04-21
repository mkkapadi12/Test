import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Users, CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getPendingRequests,
  approveOrReject,
} from "@/Store/features/enrollment/enrollment.slice";

const StudentEnrollments = () => {
  const dispatch = useDispatch();
  const { adminEnrollments, loading } = useSelector((state) => state.enrollment) || { adminEnrollments: [], loading: false };

  useEffect(() => {
    dispatch(getPendingRequests());
  }, [dispatch]);

  const handleAction = async (enrollmentId, status) => {
    const toastId = toast.loading(`${status === 'approved' ? 'Approving' : 'Rejecting'} enrollment...`);
    try {
      const resultAction = await dispatch(
        approveOrReject({
          enrollmentId,
          status,
          rejectionReason: status === "rejected" ? "Requirements not met." : undefined,
        })
      ).unwrap();
      
      toast.success(resultAction?.msg || `Enrollment request ${status}.`, { id: toastId });
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Operation failed", { id: toastId });
    }
  };

  if (loading && !adminEnrollments?.length) {
    return <div className="p-8 text-gray-500">Loading enrollment requests...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-gray-900" />
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Student Enrollments
              </h2>
              <p className="text-gray-500 text-sm">
                Manage and review incoming course enrollment requests.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4 pl-6">
                  Student Name
                </TableHead>
                <TableHead className="text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4">
                  Course Request
                </TableHead>
                <TableHead className="text-center text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4">
                  Status
                </TableHead>
                <TableHead className="text-right text-gray-600 font-bold uppercase text-[10px] tracking-wider py-4 pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminEnrollments?.length > 0 ? (
                adminEnrollments.map((enrollment) => (
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
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold leading-none bg-yellow-50 text-yellow-700 border border-yellow-200">
                        {enrollment.status || "Pending"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 transition-colors h-8"
                        onClick={() => handleAction(enrollment._id, "approved")}
                      >
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors h-8"
                        onClick={() => handleAction(enrollment._id, "rejected")}
                      >
                        <XCircle className="w-4 h-4 mr-1.5" />
                        Reject
                      </Button>
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
                      <p>No pending enrollment requests.</p>
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

export default StudentEnrollments;
