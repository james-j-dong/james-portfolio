"use client";
import type { MouseEvent, ReactNode } from "react";
import type { ProjectLink } from "@/lib/types";

type ProjectLinksProps = {
    links: ProjectLink[];
    align?: "left" | "right";
};

function hostnameLabel(href: string): string {
    try {
        const url = new URL(href);
        return url.hostname.replace(/^www\./, "");
    } catch {
        return href;
    }
}

export function ProjectLinks({ links, align = "right" }: ProjectLinksProps): ReactNode {
    if (links.length === 0) {
        return <span className="text-fg-muted">—</span>;
    }
    return (
        <>
            {links.map((link, index) => (
                <div key={link.href + index} className={align === "right" ? "text-right" : ""}>
                    <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={(e: MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
                        className="whitespace-nowrap"
                    >
                        {link.label ?? hostnameLabel(link.href)}
                        <span aria-hidden="true" className="ml-1">↗</span>
                    </a>
                </div>
            ))}
        </>
    );
}
