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
    <header className="border-fg-faint flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b px-4 py-2 text-sm">
      <span className="text-fg font-bold tracking-wider">
        {site.name} <span className="text-fg-dim">{"// PORTFOLIO"}</span>
      </span>
      <span className="text-fg-muted hidden md:inline">
        HOST:{site.hostname} USER:visitor RUNTIME:next@{version}
      </span>
      <Clock />
    </header>
  );
}
