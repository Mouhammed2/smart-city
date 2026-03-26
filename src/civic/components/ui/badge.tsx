import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-normal",
  {
    variants: {
      variant: {
        default: "bg-blue-700 text-white",
        secondary: "bg-emerald-100 text-emerald-800",
        warning: "bg-amber-100 text-amber-800",
        outline: "border border-slate-300 text-slate-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };

