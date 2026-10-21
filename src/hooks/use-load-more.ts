"use client";

import { useCallback, useRef } from "react";

export function useLoadMore(onLoadMore: () => void, enabled: boolean) {
  const observer = useRef<IntersectionObserver | null>(null);

  return useCallback(
    (node: HTMLElement | null) => {
      observer.current?.disconnect();
      if (!node || !enabled) return;

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) onLoadMore();
        },
        { rootMargin: "300px" },
      );
      observer.current.observe(node);
    },
    [onLoadMore, enabled],
  );
}
