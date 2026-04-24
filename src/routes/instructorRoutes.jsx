import InstructorLogin from "../pages/instructor/Auth/InstructorLogin";
import InstructorRegister from "../pages/instructor/Auth/InstructorRegister";
import InstructorDashboard from "../pages/instructor/pages/InstructorDashboard";
import InstructorLayout from "../pages/layout/InstructorLayout";
import PrivateInstructor from "../private/PrivateInstructor";

const instructorRoutes = [
  { path: "/instructor/login", element: <InstructorLogin /> },
  { path: "/instructor/register", element: <InstructorRegister /> },
  {
    path: "/instructor",
    element: <PrivateInstructor />,
    children: [
      {
        element: <InstructorLayout />,
        children: [
          { index: true, element: <InstructorDashboard /> },
        ],
      },
    ],
  },
];

export default instructorRoutes;
