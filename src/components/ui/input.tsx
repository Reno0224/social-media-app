import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "bg-neutral-950 text-md  w-full p-4 rounded-xl border border-neutral-900 placeholder:text-neutral-600",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
