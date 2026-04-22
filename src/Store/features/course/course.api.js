import privateAPI from "@/Store/services/PrivateAPI";

export const courseAPI = {
  createCourse: async (course) => {
    console.log("api:", course);
    const response = await privateAPI.post("/courses/create", course);
    return response.data;
  },
  //get all course for student
  getAllCourses: async () => {
    const response = await privateAPI.get("/courses");
    return response.data;
  },

  //get all course for admin
  getAdminAllCourses: async () => {
    const response = await privateAPI.get("/courses/admin");
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await privateAPI.get(`/courses/${id}`);
    return response.data;
  },

  updateCourse: async (id, course) => {
    const response = await privateAPI.put(`/courses/${id}`, course);
    return response.data;
  },

  updateCourseStatus: async (id, isActive) => {
    console.log("isActive in api", isActive);
    const response = await privateAPI.patch(`/courses/status/${id}`, {
      isActive,
    });
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await privateAPI.delete(`/courses/${id}`);
    return response.data;
  },
};
