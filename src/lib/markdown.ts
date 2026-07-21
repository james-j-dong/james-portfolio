import { Marked, type Token, type Tokens } from "marked";
import { createHighlighter, type Highlighter } from "shiki";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeUrl(url: string): string {
  if (/^(https?:|mailto:|\/|#)/.test(url)) return url;
  return "#";
}

const SHIKI_THEME = "github-dark-dimmed";
const SHIKI_LANGS = [
  "ts",
  "tsx",
  "js",
  "jsx",
  "python",
  "bash",
  "sh",
  "json",
  "css",
  "html",
  "md",
] as const;

let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [SHIKI_THEME],
      langs: [...SHIKI_LANGS],
    });
  }
  return highlighterPromise;
}

type HighlightedCode = Tokens.Code & { _highlighted?: string };

const marked = new Marked({
  gfm: true,
  breaks: false,
  async: true,
  async walkTokens(token) {
    if (token.type !== "code") return;
    const code = token as HighlightedCode;
    const highlighter = await getHighlighter();
    const lang = (code.lang || "").trim().toLowerCase();
    const loaded = new Set<string>(highlighter.getLoadedLanguages());
    const effectiveLang = loaded.has(lang) ? lang : "text";
    code._highlighted = highlighter.codeToHtml(code.text, {
      lang: effectiveLang,
      theme: SHIKI_THEME,
    });
  },
  renderer: {
    code(token: Tokens.Code): string {
      const code = token as HighlightedCode;
      if (code._highlighted) return code._highlighted;
      return `<pre><code>${escapeHtml(code.text)}</code></pre>`;
    },
    html(token: Tokens.HTML | Tokens.Tag): string {
      return escapeHtml(token.text);
    },
    link(
      this: { parser: { parseInline: (tokens: Token[]) => string } },
      token: Tokens.Link,
    ): string {
      const inner = this.parser.parseInline(token.tokens);
      const titleAttr = token.title
        ? ` title="${escapeHtml(token.title)}"`
        : "";
      return `<a href="${escapeHtml(safeUrl(token.href))}"${titleAttr}>${inner}</a>`;
    },
    image(token: Tokens.Image): string {
      const titleAttr = token.title
        ? ` title="${escapeHtml(token.title)}"`
        : "";
      return `<img src="${escapeHtml(safeUrl(token.href))}" alt="${escapeHtml(token.text)}"${titleAttr} loading="lazy" decoding="async">`;
    },
  },
});

export async function renderMarkdown(body: string): Promise<string> {
  return await marked.parse(body);
}

export type FrontmatterData = Record<string, string | string[]>;

export function parseFrontmatter(
  raw: string,
  source: string,
): {
  data: FrontmatterData;
  body: string;
} {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
  if (!m) {
    throw new Error(`Missing frontmatter in ${source}`);
  }
  const data: FrontmatterData = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^(\w+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    const [, key, value] = kv;
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      data[key] = value;
    }
  }
  return { data, body: m[2] };
}
