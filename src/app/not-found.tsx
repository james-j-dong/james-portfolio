import Link from "next/link";
import type { ReactNode } from "react";
import { Box } from "@/components/Box";

export default function NotFound(): ReactNode {
  return (
    <Box title="ERR/404">
      <div className="flex flex-col gap-2">
        <p className="text-red text-lg">
          <span className="text-fg-muted">&gt; </span>
          segmentation fault: route not found
        </p>
        <p className="text-fg-dim text-sm">
          The path you requested does not exist in this terminal&apos;s
          filesystem.
        </p>
        <p className="mt-4 text-sm">
          <Link href="/" className="text-blue hover:text-red">
            ← return to /
          </Link>
        </p>
      </div>
    </Box>
  );
}
