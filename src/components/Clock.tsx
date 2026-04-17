"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

const PLACEHOLDER = "---------- --:--:-- UTC";

function formatNow(): string {
    const now = new Date();
    const y = now.getUTCFullYear();
    const mo = String(now.getUTCMonth() + 1).padStart(2, "0");
    const d = String(now.getUTCDate()).padStart(2, "0");
    const h = String(now.getUTCHours()).padStart(2, "0");
    const mi = String(now.getUTCMinutes()).padStart(2, "0");
    const s = String(now.getUTCSeconds()).padStart(2, "0");
    return `${y}-${mo}-${d} ${h}:${mi}:${s} UTC`;
}

export function Clock(): ReactNode {
    const [time, setTime] = useState<string>(PLACEHOLDER);

    useEffect(() => {
        setTime(formatNow());
        const id = setInterval(() => setTime(formatNow()), 1000);
        return () => clearInterval(id);
    }, []);

    return <span className="tabular-nums text-fg-dim">{time}</span>;
}
