import type { ReactNode } from "react";

type BoxProps = {
    title?: string;
    children: ReactNode;
    className?: string;
};

export function Box({ title, children, className = "" }: BoxProps): ReactNode {
    return (
        <section className={`relative border border-fg-faint p-4 ${className}`}>
            {title ? (
                <span className="absolute -top-[0.6em] left-3 bg-bg px-2 text-sm text-fg-dim">
                    [ {title} ]
                </span>
            ) : null}
            {children}
        </section>
    );
}
