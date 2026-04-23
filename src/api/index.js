import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const productsAPI = {
  getAll: () => API.get("/products")
};

// 👇 ДОБАВЬ ЭТО
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data)
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});