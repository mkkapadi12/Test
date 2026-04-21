import privateAPI from "@/Store/services/PrivateAPI";

export const enrollmentAPI = {
  enroll: async (courseId) => {
    const response = await privateAPI.post(`/enrollments/request/${courseId}`);
    return response.data;
  },
  getMyEnrollments: async () => {
    const response = await privateAPI.get(`/enrollments/`);
    return response.data;
  },

  getPendingRequests: async () => {
    const response = await privateAPI.get(`/enrollments/pending`);
    return response.data;
  },

  approveOrReject: async (enrollmentId, status, rejectionReason) => {
    const response = await privateAPI.put(
      `/enrollments/approve-reject/${enrollmentId}`,
      { status, rejectionReason },
    );
    return response.data;
  },
};
