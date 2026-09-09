"""Render a content type's template and write the resulting markdown file."""

import re
from datetime import date
from pathlib import Path
from string import Template

from pf.config import Config, TypeConfig
from pf.errors import PfError

DRAFT_PLACEHOLDER: str = "draft"


def normalize_title(title: str) -> str:
    """Collapse whitespace so the title always fits on one frontmatter line."""
    return " ".join(title.split())


def slugify(title: str) -> str:
    slug: str = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    if not slug:
        raise PfError(f"title '{title}' produces an empty slug")
    return slug


def today_iso() -> str:
    return date.today().isoformat()


def format_tags(raw: str) -> str:
    """Render ``"a, b,,c"`` as ``[a, b, c]`` and ``""`` as ``[]``."""
    tags: list[str] = [tag.strip() for tag in raw.split(",") if tag.strip()]
    return f"[{', '.join(tags)}]"


def build_context(
    type_cfg: TypeConfig,
    title: str,
    *,
    draft: bool,
    tags: str,
    summary: str | None,
) -> dict[str, str]:
    """Merge the type's defaults with the values computed from the CLI input."""
    clean_title: str = normalize_title(title)
    context: dict[str, str] = dict(type_cfg.defaults)
    context["title"] = clean_title
    context["slug"] = slugify(clean_title)
    context["date"] = today_iso()
    context["tags"] = format_tags(tags)
    if summary is not None:
        context["summary"] = normalize_title(summary)
    context.setdefault("summary", "")
    context[DRAFT_PLACEHOLDER] = "true" if draft else "false"
    return context


def read_template(path: Path, root: Path) -> Template:
    try:
        return Template(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise PfError(f"template not found: {_relative(path, root)}") from exc


def supports_placeholder(template: Template, name: str) -> bool:
    return name in template.get_identifiers()


def render(template: Template, context: dict[str, str], source: str) -> str:
    try:
        return template.substitute(context)
    except KeyError as exc:
        raise PfError(f"{source} uses unknown placeholder ${exc.args[0]}") from exc
    except ValueError as exc:
        raise PfError(f"{source} has an invalid placeholder: {exc}") from exc


def resolve_output_path(type_cfg: TypeConfig, context: dict[str, str]) -> Path:
    filename: str = render(
        Template(type_cfg.filename), context, f"[types.{type_cfg.name}] filename"
    )
    return type_cfg.output_dir / filename


def write_file(path: Path, content: str, *, force: bool, root: Path) -> None:
    if path.exists() and not force:
        raise PfError(
            f"{_relative(path, root)} already exists (use --force to overwrite)"
        )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def scaffold(
    config: Config,
    type_cfg: TypeConfig,
    title: str,
    *,
    draft: bool,
    tags: str,
    summary: str | None,
    force: bool,
) -> Path:
    """Create a new file for ``type_cfg`` and return its absolute path."""
    template: Template = read_template(type_cfg.template, config.root)
    if draft and not supports_placeholder(template, DRAFT_PLACEHOLDER):
        raise PfError(
            f"type '{type_cfg.name}' does not support --draft "
            f"(template has no ${DRAFT_PLACEHOLDER} placeholder)"
        )

    context: dict[str, str] = build_context(
        type_cfg, title, draft=draft, tags=tags, summary=summary
    )
    content: str = render(template, context, _relative(type_cfg.template, config.root))
    output_path: Path = resolve_output_path(type_cfg, context)
    write_file(output_path, content, force=force, root=config.root)
    return output_path


def _relative(path: Path, root: Path) -> str:
    """Display ``path`` relative to ``root`` when possible."""
    try:
        return path.relative_to(root).as_posix()
    except ValueError:
        return str(path)
