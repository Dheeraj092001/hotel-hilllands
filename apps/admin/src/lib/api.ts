import axios, { AxiosError, AxiosInstance } from "axios";
import { auth } from "./firebase";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to get Admin Firebase token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ success: boolean; message: string; code: string }>) => {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    const code = error.response?.data?.code;
    const status = error.response?.status;

    if (status === 401) {
      auth.signOut().catch(console.error);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject({ message, code, status });
  }
);

export { api };
export default api;
