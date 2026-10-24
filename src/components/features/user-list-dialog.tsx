"use client";

import type { UserListSource } from "@/hooks/use-users";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserList } from "./user-list";

interface UserListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  source: UserListSource;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function UserListDialog({
  open,
  onOpenChange,
  title,
  source,
  emptyTitle,
  emptyDescription,
}: UserListDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        style={{ width: "min(440px, calc(100vw - 2rem))", maxWidth: "none" }}
        className="max-h-[80dvh] gap-xl rounded-2xl border-neutral-800 bg-neutral-950 p-3xl text-neutral-50"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto">
          {open && (
            <UserList
              source={source}
              emptyTitle={emptyTitle}
              emptyDescription={emptyDescription}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
