import type { ReactNode } from "react";

type TerminalFrameProps = {
  children: ReactNode;
};

export function TerminalFrame({ children }: TerminalFrameProps): ReactNode {
  return (
    <div className="min-h-screen">
      <div className="border-fg-faint mx-auto flex min-h-screen max-w-[100ch] flex-col border-x">
        {children}
      </div>
    </div>
  );
}
