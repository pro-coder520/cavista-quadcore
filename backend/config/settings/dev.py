from pathlib import Path

from .base import *  # noqa: F401, F403

DEBUG = True

# Override database to SQLite for local development (no Postgres needed)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": Path(__file__).resolve().parent.parent.parent / "db.sqlite3",
    }
}
