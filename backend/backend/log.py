import logging
import sys

from backend.settings import settings


def configure_logging() -> None:
    """Configures logging."""
    logging.basicConfig(
        stream=sys.stdout,
        level=settings.log_level.value,
        format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
