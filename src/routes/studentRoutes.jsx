import StudentDashboard from "../pages/student/pages/StudentDashboard";
import AllCourses from "../pages/student/pages/AllCourses";
import StudentLayout from "../pages/layout/StudentLayout";
import MyEnrollments from "../pages/student/pages/MyEnrollments";
import MyLearning from "../pages/student/pages/MyLearning";
import PrivateStudent from "../private/PrivateStudent";

const studentRoutes = [
  {
    path: "/student",
    element: <PrivateStudent />,
    children: [
      {
        element: <StudentLayout />,
        children: [
          { index: true, element: <StudentDashboard /> },
          { path: "all-courses", element: <AllCourses /> },
          { path: "my-enrollments", element: <MyEnrollments /> },
          { path: "learning", element: <MyLearning /> },
        ],
      },
    ],
  },
];

export default studentRoutes;
