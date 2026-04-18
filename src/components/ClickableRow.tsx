"use client";
import { useRouter } from "next/navigation";
import type { KeyboardEvent, ReactNode } from "react";

type ClickableRowProps = {
    href: string;
    children: ReactNode;
    className?: string;
};

export function ClickableRow({ href, children, className = "" }: ClickableRowProps): ReactNode {
    const router = useRouter();
    return (
        <tr
            onClick={() => router.push(href)}
            onKeyDown={(e: KeyboardEvent<HTMLTableRowElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(href);
                }
            }}
            className={`cursor-pointer hover:bg-bg-raised ${className}`.trim()}
        >
            {children}
        </tr>
    );
}
