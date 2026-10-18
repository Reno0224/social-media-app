"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { meApi } from "@/lib/api/me";
import { queryKeys } from "@/lib/query-key";
import { useIsAuthenticated } from "./use-auth";
import { MeData } from "@/types/api";
import { profile } from "console";

export function useMe() {
  const { isAuthenticated, isHydrated } = useIsAuthenticated();
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: meApi.get,
    enabled: isHydrated && isAuthenticated,
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: meApi.update,
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: queryKeys.me });
      const previous = qc.getQueryData<MeData>(queryKeys.me);
      if (previous) {
        qc.setQueryData<MeData>(queryKeys.me, {
          ...previous,
          profile: { ...previous.profile, ...input },
        });
      }
      return { previous };
    },
    onError: (e, _input, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKeys.me, ctx.previous);
      toast.error(e.message);
    },
    onSuccess: () => toast.success("Profile Update"),
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.me }),
  });
}
