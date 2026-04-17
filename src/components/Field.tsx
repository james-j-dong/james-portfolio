import type { ReactNode } from "react";

type FieldProps = {
    label: string;
    children: ReactNode;
};

export function Field({ label, children }: FieldProps): ReactNode {
    return (
        <div className="flex gap-4 text-sm">
            <span className="w-24 shrink-0 text-fg-dim uppercase">{label}</span>
            <span className="text-fg">{children}</span>
        </div>
    );
}
