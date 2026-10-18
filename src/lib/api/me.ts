import { api } from "./client";

import type { MeData } from "@/types/api";
import type { UpdateProfileInput } from "../validations/profile";

export const meApi = {
  get: () => api<MeData>("/api/me"),
  update: (body: UpdateProfileInput) =>
    api<unknown>("/api/me", { method: "PATCH", body: JSON.stringify(body) }),
};
