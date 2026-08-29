import fs from "node:fs/promises";
import { cache } from "react";
import type { ReactNode } from "react";
import { PORTRAIT_FILE } from "@/lib/content-fs";

// The cell is 0.6em x 1.2em — IBM Plex Mono's advance width and the line
// pitch scripts/generate-ascii-portrait.py generates the art for. Keep
// these three in sync with that script's ADVANCE and PORTRAIT_PITCH.
const FONT_SIZE = 10;
const CELL_W = 6;
const ROW_H = 12;
const BASELINE = 9;

const readPortrait = cache(async (): Promise<string[]> => {
  const raw = await fs.readFile(PORTRAIT_FILE, "utf8");
  // Spaces become non-breaking spaces (same advance width in a monospace
  // font). SVG whitespace collapsing rules vary by renderer and xml:space
  // is deprecated; NBSP sidesteps the question entirely, so every
  // character keeps the advance that textLength accounts for.
  return raw.replace(/\n$/, "").replace(/ /g, "\u00A0").split("\n");
});

type AsciiPortraitProps = {
  className?: string;
};

// The portrait is rendered as inline SVG text rather than a <pre> so it
// scales like an image: glyphs stay vector-crisp at any size instead of
// hitting sub-pixel font rendering on small screens.
export async function AsciiPortrait({
  className = "",
}: AsciiPortraitProps): Promise<ReactNode> {
  const rows = await readPortrait();
  const cols = Math.max(...rows.map((r) => r.length));
  const width = cols * CELL_W;
  const height = rows.length * ROW_H;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      // Unhinted, linearly scaled glyphs: without this Firefox grid-fits
      // the tiny text and paints it much bolder than Chrome does.
      textRendering="geometricPrecision"
      role="img"
      aria-label="ASCII art portrait of James Dong"
      fill="currentColor"
      fontSize={FONT_SIZE}
      className={className}
    >
      {rows.map((row, i) => (
        <text
          key={i}
          x={0}
          y={i * ROW_H + BASELINE}
          textLength={row.length * CELL_W}
          lengthAdjust="spacingAndGlyphs"
        >
          {row}
        </text>
      ))}
    </svg>
  );
}
