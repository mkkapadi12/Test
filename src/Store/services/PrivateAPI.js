import axios from "axios";

const API = "http://localhost:3001/api";
// const API = 'https://suxnix-server.vercel.app/api';

const privateAPI = axios.create({
  baseURL: API,
});

privateAPI.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("admintestToken");
  const instructorToken = localStorage.getItem("instructortestToken");
  const userToken = localStorage.getItem("usertestToken");
  const token = adminToken || instructorToken || userToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default privateAPI;
