import privateAPI from "@/Store/services/PrivateAPI";

export const courseAPI = {
  createCourse: async (course) => {
    const response = await privateAPI.post("/courses/create", course);
    return response.data;
  },
  getAllCourses: async () => {
    const response = await privateAPI.get("/courses");
    return response.data;
  },
  getCourseById: async (id) => {
    const response = await privateAPI.get(`/courses/${id}`);
    return response.data;
  },
  updateCourse: async (id, course) => {
    const response = await privateAPI.put(`/course/${id}`, course);
    return response.data;
  },
  deleteCourse: async (id) => {
    const response = await privateAPI.delete(`/course/${id}`);
    return response.data;
  },
};
