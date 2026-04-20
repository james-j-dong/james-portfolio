"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Cursor } from "@/components/Cursor";
import type { VDir, VEntry, VFile } from "@/lib/virtual-fs";

type TerminalProps = {
  fs: VDir;
  user: string;
  host: string;
};

type LsEntry = { name: string; isDir: boolean };

type Line =
  | { kind: "prompt"; cwd: string[]; command: string }
  | { kind: "text"; tone: "fg" | "dim" | "err"; content: string }
  | { kind: "ls"; entries: LsEntry[] };

const COMMANDS: ReadonlyArray<{ name: string; help: string }> = [
  { name: "ls", help: "list directory contents" },
  { name: "cd", help: "change the current directory" },
  { name: "cat", help: "print file contents" },
  { name: "pwd", help: "print the current directory" },
  { name: "whoami", help: "print the current user" },
  { name: "date", help: "print the current date and time" },
  { name: "echo", help: "print arguments" },
  { name: "clear", help: "clear the scrollback" },
  { name: "help", help: "list available commands" },
];

function formatCwd(cwd: string[]): string {
  return cwd.length === 0 ? "~" : `~/${cwd.join("/")}`;
}

function normalizePath(cwd: string[], target: string): string[] {
  const isAbsolute = target.startsWith("/");
  const segments = target.split("/").filter((s) => s.length > 0);
  const stack: string[] = isAbsolute ? [] : [...cwd];
  for (const seg of segments) {
    if (seg === ".") continue;
    if (seg === "..") {
      stack.pop();
      continue;
    }
    stack.push(seg);
  }
  return stack;
}

function lookup(root: VDir, path: string[]): VEntry | null {
  let node: VEntry = root;
  for (const seg of path) {
    if (node.type !== "dir") return null;
    const child: VEntry | undefined = node.children.find((c) => c.name === seg);
    if (!child) return null;
    node = child;
  }
  return node;
}

function resolvePath(root: VDir, cwd: string[], target: string): VEntry | null {
  return lookup(root, normalizePath(cwd, target));
}

function nodeToCwd(root: VDir, cwd: string[], target: string): string[] | null {
  const path = normalizePath(cwd, target);
  const node = lookup(root, path);
  if (!node || node.type !== "dir") return null;
  return path;
}

function listEntries(dir: VDir): LsEntry[] {
  return dir.children
    .map((c) => ({ name: c.name, isDir: c.type === "dir" }))
    .sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

function helpText(): string {
  const pad = Math.max(...COMMANDS.map((c) => c.name.length));
  return COMMANDS.map((c) => `  ${c.name.padEnd(pad)}  ${c.help}`).join("\n");
}

export function Terminal({ fs, user, host }: TerminalProps): ReactNode {
  const [lines, setLines] = useState<Line[]>([]);
  const [cwd, setCwd] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState<number>(-1);
  const [focused, setFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const runCommand = useCallback(
    (raw: string): Line[] => {
      const trimmed: string = raw.trim();
      if (trimmed.length === 0) return [];
      const [name, ...args] = trimmed.split(/\s+/);
      switch (name) {
        case "help":
          return [{ kind: "text", tone: "fg", content: helpText() }];
        case "pwd":
          return [
            {
              kind: "text",
              tone: "fg",
              content: cwd.length === 0 ? "/" : `/${cwd.join("/")}`,
            },
          ];
        case "whoami":
          return [{ kind: "text", tone: "fg", content: user }];
        case "date":
          return [{ kind: "text", tone: "fg", content: new Date().toString() }];
        case "echo":
          return [{ kind: "text", tone: "fg", content: args.join(" ") }];
        case "clear":
          return [];
        case "ls": {
          const target = args[0] ?? ".";
          const node = resolvePath(fs, cwd, target);
          if (!node) {
            return [
              {
                kind: "text",
                tone: "err",
                content: `ls: cannot access '${target}': No such file or directory`,
              },
            ];
          }
          if (node.type === "file") {
            return [
              { kind: "ls", entries: [{ name: node.name, isDir: false }] },
            ];
          }
          return [{ kind: "ls", entries: listEntries(node) }];
        }
        case "cd": {
          const target = args[0] ?? "/";
          const nextCwd = nodeToCwd(fs, cwd, target);
          if (nextCwd === null) {
            const node = resolvePath(fs, cwd, target);
            if (node && node.type === "file") {
              return [
                {
                  kind: "text",
                  tone: "err",
                  content: `cd: not a directory: ${target}`,
                },
              ];
            }
            return [
              {
                kind: "text",
                tone: "err",
                content: `cd: no such file or directory: ${target}`,
              },
            ];
          }
          setCwd(nextCwd);
          return [];
        }
        case "cat": {
          if (args.length === 0) {
            return [
              { kind: "text", tone: "err", content: "cat: missing operand" },
            ];
          }
          const out: Line[] = [];
          for (const arg of args) {
            const node = resolvePath(fs, cwd, arg);
            if (!node) {
              out.push({
                kind: "text",
                tone: "err",
                content: `cat: ${arg}: No such file or directory`,
              });
              continue;
            }
            if (node.type === "dir") {
              out.push({
                kind: "text",
                tone: "err",
                content: `cat: ${arg}: Is a directory`,
              });
              continue;
            }
            const file = node as VFile;
            out.push({
              kind: "text",
              tone: "fg",
              content: file.content.replace(/\n$/, ""),
            });
          }
          return out;
        }
        default:
          return [
            {
              kind: "text",
              tone: "err",
              content: `${name}: command not found`,
            },
          ];
      }
    },
    [cwd, fs, user],
  );

  const submit = useCallback(() => {
    const raw = input;
    const promptLine: Line = { kind: "prompt", cwd, command: raw };
    const output = runCommand(raw);
    const cleared = raw.trim() === "clear";
    setLines((prev) => (cleared ? [] : [...prev, promptLine, ...output]));
    if (raw.trim().length > 0) {
      setHistory((prev) => [...prev, raw]);
    }
    setHistIndex(-1);
    setInput("");
  }, [input, cwd, runCommand]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submit();
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (history.length === 0) return;
        const next =
          histIndex === -1 ? history.length - 1 : Math.max(0, histIndex - 1);
        setHistIndex(next);
        setInput(history[next] ?? "");
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (histIndex === -1) return;
        const next = histIndex + 1;
        if (next >= history.length) {
          setHistIndex(-1);
          setInput("");
        } else {
          setHistIndex(next);
          setInput(history[next] ?? "");
        }
        return;
      }
      if (event.ctrlKey && event.key.toLowerCase() === "l") {
        event.preventDefault();
        setLines([]);
        return;
      }
      if (event.ctrlKey && event.key.toLowerCase() === "c") {
        event.preventDefault();
        setLines((prev) => [
          ...prev,
          { kind: "prompt", cwd, command: `${input}^C` },
        ]);
        setInput("");
        setHistIndex(-1);
        return;
      }
    },
    [cwd, histIndex, history, input, submit],
  );

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);
    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);
    return () => {
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", onBlur);
    };
  }, []);

  const promptPrefix = useMemo(() => `${user}@${host}`, [user, host]);

  return (
    <div
      onClick={focusInput}
      className="cursor-text text-sm"
      role="group"
      aria-label="Terminal"
    >
      {lines.map((line, i) => (
        <LineView key={i} line={line} promptPrefix={promptPrefix} />
      ))}
      <div className="wrap-break-word whitespace-pre-wrap">
        <span className="text-fg-muted">{promptPrefix}</span>
        <span className="text-fg-muted">:</span>
        <span className="text-blue-dim">{formatCwd(cwd)}</span>
        <span className="text-fg-muted">$</span> <span>{input}</span>
        {focused ? <span className="text-fg">█</span> : <Cursor />}
      </div>
      <label className="sr-only" htmlFor="terminal-input">
        Terminal command input
      </label>
      <input
        id="terminal-input"
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="sr-only"
        aria-label="Terminal command input"
        // Browser extensions (password managers, form fillers) often
        // inject attributes on inputs before React hydrates.
        suppressHydrationWarning
      />
    </div>
  );
}

function LineView({
  line,
  promptPrefix,
}: {
  line: Line;
  promptPrefix: string;
}): ReactNode {
  if (line.kind === "prompt") {
    return (
      <div className="wrap-break-word whitespace-pre-wrap">
        <span className="text-fg-muted">{promptPrefix}</span>
        <span className="text-fg-muted">:</span>
        <span className="text-blue-dim">{formatCwd(line.cwd)}</span>
        <span className="text-fg-muted">$</span>{" "}
        <span className="text-fg">{line.command}</span>
      </div>
    );
  }
  if (line.kind === "ls") {
    return (
      <div className="flex flex-wrap gap-x-4">
        {line.entries.map((e) => (
          <span key={e.name} className={e.isDir ? "text-blue-dim" : "text-fg"}>
            {e.isDir ? `${e.name}/` : e.name}
          </span>
        ))}
      </div>
    );
  }
  const toneClass =
    line.tone === "err"
      ? "text-red-dim"
      : line.tone === "dim"
        ? "text-fg-dim"
        : "text-fg";
  return (
    <pre
      className={`font-mono wrap-break-word whitespace-pre-wrap ${toneClass}`}
    >
      {line.content}
    </pre>
  );
}
