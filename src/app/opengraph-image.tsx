import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — software engineer portfolio`;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const FONT_DIR = path.join(process.cwd(), "src", "assets", "fonts");

export default async function Image(): Promise<ImageResponse> {
  const [regular, bold] = await Promise.all([
    readFile(path.join(FONT_DIR, "IBMPlexMono-Regular.ttf")),
    readFile(path.join(FONT_DIR, "IBMPlexMono-Bold.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#000000",
        padding: 40,
        fontFamily: "IBM Plex Mono",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          border: "2px solid #393939",
          padding: 56,
        }}
      >
        <div style={{ display: "flex", color: "#8d8d8d", fontSize: 28 }}>
          {site.handle}@{site.hostname}:~$ whoami
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#f4f4f4",
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 24,
            }}
          >
            <div style={{ display: "flex", color: "#c6c6c6", fontSize: 32 }}>
              software engineer / {site.location}
            </div>
            <div
              style={{
                width: 18,
                height: 38,
                backgroundColor: "#f4f4f4",
                marginLeft: 16,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 28,
          }}
        >
          <div style={{ display: "flex", color: "#8d8d8d" }}>
            {"// PORTFOLIO"}
          </div>
          <div style={{ display: "flex", color: "#78a9ff" }}>
            {site.hostname}
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "IBM Plex Mono",
          data: regular,
          style: "normal",
          weight: 400,
        },
        {
          name: "IBM Plex Mono",
          data: bold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
