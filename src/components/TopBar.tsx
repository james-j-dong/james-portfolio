import type { ReactNode } from "react";
import pkg from "../../package.json";
import { Clock } from "@/components/Clock";
import { site } from "@/content/site";

type NextPkg = { dependencies?: { next?: string } };

function nextVersion(): string {
    const deps = (pkg as NextPkg).dependencies ?? {};
    const raw = deps.next ?? "";
    return raw.replace(/^[^\d]*/, "");
}

export function TopBar(): ReactNode {
    const version = nextVersion();
    return (
        <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-fg-faint px-4 py-2 text-sm">
            <span className="font-bold tracking-wider text-fg">
                {site.name} <span className="text-fg-dim">{"// PORTFOLIO"}</span>
            </span>
            <span className="hidden text-fg-muted md:inline">
                HOST:{site.hostname} USER:visitor SHELL:next@{version}
            </span>
            <Clock />
        </header>
    );
}
