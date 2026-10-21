import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { authStorage } from "@/lib/auth-storage";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { clearToken, setToken } from "@/store/slices/auth-slice";
import type { AuthData } from "@/types/api";


function useAfterAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();

  return (data: AuthData) => {
    if (!data?.token) {
      toast.error("Login response does not contain a token");
      return;
    }
    authStorage.set(data.token);
    dispatch(setToken(data.token));
    const returnTo = params.get("returnTo");
    router.replace(returnTo?.startsWith("/") ? returnTo : "/feed");
  };
}

export function useLogin() {
  const afterAuth = useAfterAuth();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      toast.success("Berhasil masuk");
      afterAuth(data);
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useRegister() {
  const afterAuth = useAfterAuth();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      toast.success("Akun berhasil di buat");
      afterAuth(data);
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    authStorage.clear();
    dispatch(clearToken());
    queryClient.clear();
    router.replace("/login");
  };
}

export function useIsAuthenticated() {
  const { token, isHydrated } = useAppSelector((s) => s.auth);
  return { isAuthenticated: !!token, isHydrated };
}
