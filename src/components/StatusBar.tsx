import type { ReactNode } from "react";

type KeyLabelProps = {
    keyName: string;
    label: string;
};

function KeyLabel({ keyName, label }: KeyLabelProps): ReactNode {
    return (
        <span className="inline-flex items-center gap-1">
            <span className="bg-fg px-1.5 text-bg">{keyName}</span>
            <span className="text-fg-dim">{label}</span>
        </span>
    );
}

export function StatusBar(): ReactNode {
    return (
        <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-fg-faint px-4 py-2 text-xs">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
                <KeyLabel keyName="F1" label="HELP" />
                <KeyLabel keyName="F2" label="INDEX" />
                <KeyLabel keyName="F3" label="SEARCH" />
                <KeyLabel keyName="F5" label="REFRESH" />
                <KeyLabel keyName="F10" label="CONTACT" />
            </div>
            <div className="flex gap-x-4 text-fg-dim">
                <span>READY</span>
                <span className="inline-flex items-center gap-1 text-green">
                    <span className="inline-block h-2 w-2 bg-green" />
                    <span>LIVE</span>
                </span>
            </div>
        </footer>
    );
}
