import { useMutation } from "@tanstack/react-query";
import { AxiosInstance } from "../utils/AxiosInstance";
import type { LoginData, RegisterData } from "../types";

const registerUser = async (formData: RegisterData) => {
  const res = await AxiosInstance.post("/api/user/register", formData);
  return res.data;
};
const loginUser = async (formData: LoginData) => {
  const res = await AxiosInstance.post("/api/user/login", formData);
  return res.data;
};

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};
export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

