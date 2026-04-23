import privateAPI from "@/Store/services/PrivateAPI";
import publicAPI from "@/Store/services/PublicAPI";

export const INSTRUCTOR_AUTH_API = {
  registerInstructor: async ({ name, email, password }) => {
    const response = await publicAPI.post("/instructor/register", {
      name,
      email,
      password,
    });
    return response.data;
  },
  loginInstructor: async ({ email, password }) => {
    const response = await publicAPI.post("/instructor/login", {
      email,
      password,
    });
    return response.data;
  },
  getInstructorProfile: async () => {
    const response = await privateAPI.get("/instructor/profile");
    return response.data;
  },
};
