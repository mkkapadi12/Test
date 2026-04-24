import adminRoutes from "./adminRoutes";
import studentRoutes from "./studentRoutes";
import instructorRoutes from "./instructorRoutes";
import userRoutes from "./userRoutes";

const appRoutes = [
  ...userRoutes,
  ...adminRoutes,
  ...studentRoutes,
  ...instructorRoutes,
];

export default appRoutes;
