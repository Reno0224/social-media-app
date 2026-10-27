// src/lib/api/client.ts
import type { ApiResponse } from "@/types/api";
import { authStorage } from "@/lib/auth-storage";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = authStorage.get();
  const isFormData = options.body instanceof FormData;

  const base = BASE_URL;

  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    console.error(
      "[api] request failed:",
      `${options.method ?? "GET"} ${path}`,
      error,
    );
    throw new ApiError(
      typeof navigator !== "undefined" && !navigator.onLine
        ? "You appear to be offline. Check your connection and try again."
        : "Could not reach the server. Please try again.",
      0,
    );
  }

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (!res.ok || json?.success === false) {
    throw new ApiError(json?.message ?? "Something went wrong", res.status);
  }

  return json!.data;
}
