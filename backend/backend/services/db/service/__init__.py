from typing import Any, Generic, Type, TypeVar

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.base import Base
from backend.db.dependencies import get_db_session
from backend.services.db.repository import BaseRepository

T = TypeVar("T", bound=Base)
R = TypeVar("R", bound=BaseRepository[Any])  # need Any here to satisfy mypy


class BaseService(Generic[T, R]):
    """Base service class that provides common functionality.

    Attributes:
        repository_class (Type[BaseRepository[T]]): Repository class associated
          with the service.
    """

    repository_class: Type[R]

    def __init__(self, session: AsyncSession = Depends(get_db_session)) -> None:
        """Initialize the service.

        Args:
            session (AsyncSession): The database session.
        """
        if not hasattr(self, "repository_class"):
            raise NotImplementedError("Service must define a repository_class")
        self.repository = self.repository_class(session=session)
