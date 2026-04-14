import privateAPI from "../../services/PrivateAPI";

export const registerAdminAPI = async (data) => {
  const response = await privateAPI.post("/admin/register", data);
  return response.data;
};

export const loginAdminAPI = async (data) => {
  const response = await privateAPI.post("/admin/login", data);
  return response.data;
};

export const getAdminProfileAPI = async () => {
  const response = await privateAPI.get("/admin/profile");
  return response.data;
};
