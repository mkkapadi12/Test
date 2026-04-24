import AdminLogin from "../pages/admin/Auth/AdminLogin";
import AdminRegister from "../pages/admin/Auth/AdminRegister";
import AdminDashboard from "../pages/admin/pages/AdminDashboard";
import AdminCourses from "../pages/admin/pages/AdminCourses";
import AdminLayout from "../pages/layout/AdminLayout";
import PendingRequests from "../pages/admin/pages/PendingRequests";
import AdminEnrollments from "../pages/admin/pages/AdminEnrollments";
import PrivateAdmin from "../private/PrivateAdmin";

const adminRoutes = [
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/register", element: <AdminRegister /> },
  {
    path: "/admin",
    element: <PrivateAdmin />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "all-courses", element: <AdminCourses /> },
          { path: "pending-requests", element: <PendingRequests /> },
          { path: "enrollments", element: <AdminEnrollments /> },
        ],
      },
    ],
  },
];

export default adminRoutes;
