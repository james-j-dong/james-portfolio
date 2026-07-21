"use client";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

type ClickableRowProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function ClickableRow({
  href,
  children,
  className = "",
}: ClickableRowProps): ReactNode {
  const router = useRouter();
  return (
    <tr
      onClick={(e: MouseEvent<HTMLTableRowElement>) => {
        // Links inside the row (post titles, external project links)
        // handle their own navigation.
        if ((e.target as HTMLElement).closest("a")) return;
        router.push(href);
      }}
      className={`hover:bg-bg-raised cursor-pointer ${className}`.trim()}
    >
      {children}
    </tr>
  );
}
