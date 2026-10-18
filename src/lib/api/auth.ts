import { api } from "./client";
import type { AuthData } from "@/types/api";
import type { LoginInput, RegisterInput } from "../validations/auth";


export const authApi = {
  login: (body: LoginInput) =>
    api<AuthData>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  register: ({ confirmPassword, ...body }: RegisterInput) =>
    api<AuthData>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
