import type { ReactNode } from "react";

type BoxProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Box({ title, children, className = "" }: BoxProps): ReactNode {
  return (
    <section className={`border-fg-faint relative border p-4 ${className}`}>
      {title ? (
        <span className="bg-bg text-fg-dim absolute -top-[0.6em] left-3 px-2 text-sm">
          [ {title} ]
        </span>
      ) : null}
      {children}
    </section>
  );
}
