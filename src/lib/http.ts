import axios from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 5000,
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      error.message = error.response.data.detail ?? error.message;
    }
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/api/v1/auth/refresh")
    ) {
      try {
        await http.post("/api/v1/auth/refresh");
        return http(error.config);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
