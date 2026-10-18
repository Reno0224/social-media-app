"use client";

import { useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { makeStore } from "@/store";
import { hydrate } from "@/store/slices/auth-slice";
import { authStorage } from "@/lib/auth-storage";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => makeStore());

  useEffect(() => {
    store.dispatch(hydrate(authStorage.get()));
  }, [store]);

  return (
    <ReduxProvider store={store}>
      <QueryProvider>{children}</QueryProvider>
    </ReduxProvider>
  );
}
