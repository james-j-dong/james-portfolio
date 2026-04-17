import type { ReactNode } from "react";

type TerminalFrameProps = {
    children: ReactNode;
};

export function TerminalFrame({ children }: TerminalFrameProps): ReactNode {
    return (
        <div className="min-h-screen">
            <div className="mx-auto flex min-h-screen max-w-[100ch] flex-col border-x border-fg-faint">
                {children}
            </div>
        </div>
    );
}
