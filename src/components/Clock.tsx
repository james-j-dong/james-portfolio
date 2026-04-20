"use client";

import { useSyncExternalStore } from "react";
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

let cachedTime: string = PLACEHOLDER;

function subscribe(callback: () => void): () => void {
  cachedTime = formatNow();
  const id = setInterval(() => {
    cachedTime = formatNow();
    callback();
  }, 1000);
  return () => clearInterval(id);
}

function getSnapshot(): string {
  return cachedTime;
}

function getServerSnapshot(): string {
  return PLACEHOLDER;
}

export function Clock(): ReactNode {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <span className="text-fg-dim tabular-nums">{time}</span>;
}
