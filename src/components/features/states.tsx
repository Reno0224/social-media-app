import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col items-center gap-md text-center", className)}
    >
      <p className="text-lg font-semibold">{title}</p>
      {description && (
        <p className="w-[430px] text-md text-neutral-400 font-normal">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-lg py-5xl text-center"
    >
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" className="rounded-full" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="space-y-lg rounded-2xl border border-neutral-800 p-xl">
      <div className="flex items-center gap-lg">
        <div className="size-10 animate-pulse rounded-full bg-neutral-800" />
        <div className="space-y-xs">
          <div className="h-4 w-28 animate-pulse rounded-md bg-neutral-800" />
          <div className="h-3 w-16 animate-pulse rounded-md bg-neutral-800" />
        </div>
      </div>
      <div className="aspect-square w-full animate-pulse rounded-xl bg-neutral-800" />
      <div className="h-4 w-2/3 animate-pulse rounded-md bg-neutral-800" />
    </div>
  );
}
