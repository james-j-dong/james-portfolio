# pf

Scaffolds markdown content for the portfolio site from templates declared in
`pf.toml` at the repo root.

## Usage

Run from anywhere inside the repo:

    npm run pf -- new blog "Post title" --tags "a, b" --summary "One line" --draft
    npm run pf -- new project "Project name" --summary "One line"

Options:

- `--draft` — write `draft: true` (only for types whose template has `$draft`).
  Drafts render in `npm run dev` but are excluded from production builds.
- `--tags "a, b"` — comma-separated tags, written as `[a, b]`.
- `--summary "..."` — one-line summary.
- `--force` — overwrite an existing file.

Prints the created path relative to the repo root. Errors go to stderr with exit 1.

## Configuration

Each `[types.<name>]` table in `pf.toml` needs:

- `template` — path to a template file (relative to the repo root)
- `output_dir` — where files are written (relative to the repo root)
- `filename` — pattern for the file name, e.g. `${date}-${slug}.md`

An optional `[types.<name>.defaults]` table supplies fallback values (e.g. `summary`).

Templates are Python `string.Template` files. Available placeholders:
`$title`, `$slug`, `$date`, `$tags`, `$summary`, `$draft`, plus any key from `defaults`.
Values are written unquoted because the site's frontmatter parser does not strip quotes.

## Development

    uv run --project tools/pf pf --help
