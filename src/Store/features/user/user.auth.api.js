import privateAPI from "../../services/PrivateAPI";

export const registerUserAPI = async (data) => {
  const response = await privateAPI.post("/user/register", data);
  return response.data;
};

export const loginUserAPI = async (data) => {
  const response = await privateAPI.post("/user/login", data);
  return response.data;
};

export const getUserProfileAPI = async () => {
  const response = await privateAPI.get("/user/profile");
  return response.data;
};
