"""Command-line entry point for ``pf``."""

from pathlib import Path
from typing import Annotated

import typer

from pf.config import Config, TypeConfig, find_config_file, get_type, load_config
from pf.errors import PfError
from pf.scaffold import scaffold

app = typer.Typer(no_args_is_help=True, add_completion=False)


@app.callback()
def root() -> None:
    """Scaffold markdown content for the portfolio site from pf.toml templates."""
    # A Typer app with a single command collapses it into the root command.
    # This empty callback keeps ``new`` as an explicit subcommand.


@app.command()
def new(
    type_name: Annotated[
        str,
        typer.Argument(metavar="TYPE", help="A content type declared in pf.toml."),
    ],
    title: Annotated[
        str, typer.Argument(help="Title of the new entry; the slug is derived from it.")
    ],
    draft: Annotated[
        bool, typer.Option("--draft", help="Mark the entry as a draft (draft: true).")
    ] = False,
    tags: Annotated[str, typer.Option("--tags", help="Comma-separated tags.")] = "",
    summary: Annotated[
        str | None, typer.Option("--summary", help="One-line summary.")
    ] = None,
    force: Annotated[
        bool, typer.Option("--force", help="Overwrite the file if it already exists.")
    ] = False,
) -> None:
    """Create a new markdown file from the type's template."""
    try:
        config: Config = load_config(find_config_file(Path.cwd()))
        type_cfg: TypeConfig = get_type(config, type_name)
        written: Path = scaffold(
            config,
            type_cfg,
            title,
            draft=draft,
            tags=tags,
            summary=summary,
            force=force,
        )
    except PfError as exc:
        typer.echo(f"error: {exc}", err=True)
        raise typer.Exit(code=1)
    typer.echo(written.relative_to(config.root).as_posix())


def main() -> None:
    app()
