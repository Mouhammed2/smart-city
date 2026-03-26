import type { ReactNode } from "react";

type DashboardContentProps = {
  children: ReactNode;
};

export function DashboardContent({ children }: DashboardContentProps) {
  return <main className="flex-1 overflow-x-hidden p-6 md:p-12">{children}</main>;
}


