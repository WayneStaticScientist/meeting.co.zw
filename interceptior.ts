import { UserStore } from "@/stores/session-store";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${UserStore.accessToken()}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/users/tokens`,
          {},
          {
            headers: {
              Authorization: `Bearer ${UserStore.refreshToken()}`,
            },
          },
        );
        const { accessToken, refreshToken } = refreshResponse.data;
        UserStore.setTokens(accessToken, refreshToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          window.location.href = "/auth";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
export default api;
