import type { ReactNode } from "react";

type CursorProps = {
    className?: string;
};

export function Cursor({ className = "" }: CursorProps): ReactNode {
    return (
        <span aria-hidden="true" className={`cursor-blink ${className}`}>
            █
        </span>
    );
}
