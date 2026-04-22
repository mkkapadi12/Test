import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export const StatusIcon = ({ status }) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "rejected":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "pending":
    default:
      return <Clock className="w-4 h-4 text-yellow-500" />;
  }
};

export const StatusBadge = ({ status }) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return (
        <Badge
          variant="outline"
          className="border-green-200 text-green-700 bg-green-50 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400"
        >
          Approved
        </Badge>
      );
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    case "pending":
    default:
      return (
        <Badge
          variant="outline"
          className="border-yellow-200 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400"
        >
          Pending
        </Badge>
      );
  }
};
