import axios from "axios";

const API = "http://localhost:3001/api";
// const API = 'https://suxnix-server.vercel.app/api';

const publicAPI = axios.create({
  baseURL: API,
});

export default publicAPI;
