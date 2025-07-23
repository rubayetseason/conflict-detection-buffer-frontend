import { JWT_TOKEN_PASS } from "@/constants";
import { LoginPayload, LoginResponse } from "@/types";
import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";

const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const res = await axiosInstance.post("/auth/login", payload);
    if (res?.data?.success && res?.data?.data?.accessToken) {
      const { accessToken } = res.data.data;
      localStorage.setItem(JWT_TOKEN_PASS, accessToken);
      return { success: true };
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An error occurred during login");
  }
};

const authService = {
  login,
};

export default authService;
