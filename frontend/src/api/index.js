import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const productsAPI = {
  getAll: (params) => API.get("/products", { params }),
  create: (data) => API.post("/products", data),
  delete: (id) => API.delete(`/products/${id}`)
};

export const authAPI = {
  login: (data) => API.post("/auth/login", data),
  register: (data) => API.post("/auth/register", data)
};

export default API;