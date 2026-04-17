"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Tab = {
    n: number;
    label: string;
    href: string;
    match: (pathname: string) => boolean;
};

const tabs: Tab[] = [
    { n: 1, label: "ABOUT", href: "/", match: (p) => p === "/" },
    { n: 2, label: "WORK", href: "/work", match: (p) => p.startsWith("/work") },
    { n: 3, label: "LOG", href: "/log", match: (p) => p.startsWith("/log") },
    { n: 4, label: "CONTACT", href: "/contact", match: (p) => p.startsWith("/contact") },
];

export function TabBar(): ReactNode {
    const pathname = usePathname();
    return (
        <nav className="flex flex-wrap gap-x-6 gap-y-1 border-b border-fg-faint px-4 py-2 text-sm">
            {tabs.map((tab) => {
                const active = tab.match(pathname);
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={
                            active
                                ? "text-red"
                                : "text-fg-dim hover:text-fg"
                        }
                    >
                        <span className="text-fg-muted">{tab.n})</span> {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}
