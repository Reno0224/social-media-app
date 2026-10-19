"use client";

import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabItem {
  key: string;
  label: string;
  icon: LucideIcon;
  content: React.ReactNode;
}

export function ProfileTabs({ tabs }: { tabs: TabItem[] }) {
  const [active, setActive] = useState(tabs[0].key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div>
      <div role="tablist" className="flex border-b border-neutral-900">
        {tabs.map(({ key, label, icon: Icon }) => {
          const selected = key === current.key;

          return (
            <button
              key={key}
              type="button"
              role="tab"
              id={`tab-${key}`}
              aria-selected={selected}
              aria-controls={`panel-${key}`}
              onClick={() => setActive(key)}
              className={cn(
                "-mb-px flex flex-1 cursor-pointer items-center justify-center gap-md border-b-2 py-lg text-md font-semibold transition-colors",
                selected
                  ? "border-white text-white"
                  : "border-transparent text-neutral-500 hover:text-neutral-300",
              )}
            >
              <Icon className={cn("size-5", selected && "fill-current")} />
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`panel-${current.key}`}
        aria-labelledby={`tab-${current.key}`}
        className="pt-xl text-white"
      >
        {current.content}
      </div>
    </div>
  );
}
