import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

interface UseAvatarProps {
  name: string;
  avatarUrl: string | null;
  className?: string;
}

export function UserAvatar({ name, avatarUrl, className }: UseAvatarProps) {
  return (
    <Avatar className={cn("size-6xl", className)}>
      <AvatarImage src={avatarUrl ?? undefined} alt={name} />
      <AvatarFallback className="bg-neutral-800 text-sm font-semibold text-neutral-50">
        {name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
