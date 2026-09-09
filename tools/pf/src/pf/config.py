"""Locate and parse ``pf.toml``.

The config lives at the project root and declares one ``[types.<name>]`` table per
content type. Paths inside it are relative to the directory containing ``pf.toml``.
"""

import tomllib
from dataclasses import dataclass, field
from pathlib import Path

from pf.errors import PfError

CONFIG_FILENAME: str = "pf.toml"
REQUIRED_TYPE_KEYS: tuple[str, ...] = ("template", "output_dir", "filename")


@dataclass(frozen=True)
class TypeConfig:
    name: str
    template: Path
    output_dir: Path
    filename: str
    defaults: dict[str, str] = field(default_factory=dict)


@dataclass(frozen=True)
class Config:
    root: Path
    types: dict[str, TypeConfig]


def find_config_file(start: Path) -> Path:
    """Return the nearest ``pf.toml`` in ``start`` or any of its parents."""
    for directory in (start, *start.parents):
        candidate: Path = directory / CONFIG_FILENAME
        if candidate.is_file():
            return candidate
    raise PfError(f"{CONFIG_FILENAME} not found in {start} or any parent directory")


def load_config(config_path: Path) -> Config:
    """Parse ``pf.toml`` into a ``Config``."""
    try:
        with config_path.open("rb") as handle:
            raw: dict[str, object] = tomllib.load(handle)
    except tomllib.TOMLDecodeError as exc:
        raise PfError(f"failed to parse {config_path}: {exc}") from exc

    root: Path = config_path.parent
    raw_types: object = raw.get("types")
    if not isinstance(raw_types, dict) or not raw_types:
        raise PfError(f"{CONFIG_FILENAME} defines no [types.*] tables")

    types: dict[str, TypeConfig] = {}
    for name, raw_type in raw_types.items():
        if not isinstance(raw_type, dict):
            raise PfError(f"[types.{name}] must be a table")
        types[name] = _parse_type(name, raw_type, root)
    return Config(root=root, types=types)


def _parse_type(name: str, raw: dict[str, object], root: Path) -> TypeConfig:
    for key in REQUIRED_TYPE_KEYS:
        value: object = raw.get(key)
        if not isinstance(value, str) or not value:
            raise PfError(f"[types.{name}] is missing required key '{key}'")

    raw_defaults: object = raw.get("defaults", {})
    if not isinstance(raw_defaults, dict):
        raise PfError(f"[types.{name}.defaults] must be a table")
    defaults: dict[str, str] = {}
    for key, value in raw_defaults.items():
        if not isinstance(value, str):
            raise PfError(f"[types.{name}.defaults] '{key}' must be a string")
        defaults[key] = value

    return TypeConfig(
        name=name,
        template=root / str(raw["template"]),
        output_dir=root / str(raw["output_dir"]),
        filename=str(raw["filename"]),
        defaults=defaults,
    )


def get_type(config: Config, name: str) -> TypeConfig:
    type_cfg: TypeConfig | None = config.types.get(name)
    if type_cfg is None:
        available: str = ", ".join(sorted(config.types))
        raise PfError(f"unknown type '{name}'; available types: {available}")
    return type_cfg
