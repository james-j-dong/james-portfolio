import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "harloop",
    year: 2025,
    name: "harloop",
    tags: ["video-creation", "nextjs", "postgres"],
    links: [
      { href: "https://harloop.com" },
      { href: "https://github.com/james-j-dong/app-harloop" },
    ],
    description: "Current main project. Video Creation and distribution pipeline for individuals and businesses.",
  },
  {
    slug: "cuelock",
    year: 2025,
    name: "cuelock",
    tags: ["nextjs", "python", "ai", "integrations"],
    links: [{ href: "https://cuelock.com" }],
    description: "Expansion based NRR software for CSMs.",
  },
  {
    slug: "etsy-auto-dropshipper",
    year: 2024,
    name: "etsy auto-dropshipper",
    tags: ["chromium", "dropship", "vite"],
    links: [{ href: "https://github.com/james-j-dong/Etsy-Chrome-Extension" }],
    description:
      "Automated dropshipping tool with gpt 3.5, net 200k. Got banned.",
  },
  {
    slug: "sprout",
    year: 2022,
    name: "sprout",
    tags: ["machine learning", "UT", "XGBoost"],
    links: [{ href: "https://github.com/james-j-dong/sprout-food-solutions" }],
    description:
      "Using machine learning to predict food consumption in restaurants",
  },
];
