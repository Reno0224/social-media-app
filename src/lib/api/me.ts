import { api } from "./client";

import type { MeData } from "@/types/api";
import type { UpdateProfileInput } from "../validations/profile";

const AVATAR_FIELD = "avatar";

export const meApi = {
  get: () => api<MeData>("/api/me"),
  update: (input: UpdateProfileInput, avatar?: File | null) => {
    if (avatar) {
      const body = new FormData();
      body.append("name", input.name);
      body.append("username", input.username);
      body.append("phone", input.phone);
      body.append("bio", input.bio);
      body.append(AVATAR_FIELD, avatar);
      return api<unknown>("/api/me", { method: "PATCH", body });
    }
    return api<unknown>("/api/me", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },
};
