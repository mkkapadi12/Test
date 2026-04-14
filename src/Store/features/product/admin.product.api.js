import publicAPI from "@/Store/services/PublicAPI";
import privateAPI from "../../services/PrivateAPI";

export const createProductAPI = async (data) => {
  const response = await privateAPI.post("/product/admin/create", data);
  return response.data;
};

export const getAllproductsAPI = async () => {
  const response = await publicAPI.get("/product/all");
  return response.data;
};

export const deleteProductAPI = async (id) => {
  const response = await privateAPI.delete(`/product/admin/delete/${id}`);
  return response.data;
};
