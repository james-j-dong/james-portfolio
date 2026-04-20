import type { ReactNode } from "react";

type KeyLabelProps = {
  keyName: string;
  label: string;
};

function KeyLabel({ keyName, label }: KeyLabelProps): ReactNode {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="bg-fg text-bg px-1.5">{keyName}</span>
      <span className="text-fg-dim">{label}</span>
    </span>
  );
}

export function StatusBar(): ReactNode {
  return (
    <footer className="border-fg-faint flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t px-4 py-2 text-xs">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <KeyLabel keyName="F1" label="HELP" />
        <KeyLabel keyName="F2" label="INDEX" />
        <KeyLabel keyName="F3" label="SEARCH" />
        <KeyLabel keyName="F5" label="REFRESH" />
        <KeyLabel keyName="F10" label="CONTACT" />
      </div>
      <div className="text-fg-dim flex gap-x-4">
        <span>READY</span>
        <span className="text-green inline-flex items-center gap-1">
          <span className="bg-green inline-block h-2 w-2" />
          <span>LIVE</span>
        </span>
      </div>
    </footer>
  );
}
