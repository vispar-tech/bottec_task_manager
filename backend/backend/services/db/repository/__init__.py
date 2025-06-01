from typing import (
    Any,
    Generic,
    Optional,
    Type,
    TypeVar,
)
from uuid import UUID

from sqlalchemy import (
    delete,
    exc,
    select,
    update,
)
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.base import Base

T = TypeVar("T", bound=Base)
ID = TypeVar("ID", UUID, int, str)


class BaseRepository(Generic[T]):
    """Base repository class for database operations.

    Attributes:
        model (Type[T]): The model class associated with the repository.
        session (AsyncSession): The database session.
    """

    model: Type[T]
    primary_key: str = "id"

    def __init__(self, session: AsyncSession) -> None:
        """Initialize the repository with a database session.

        Args:
            session (AsyncSession): The database session.
        """
        self.session = session

    async def add(self, **values: Any) -> T:
        """Create new record with given values.

        Args:
            **values: Field-value pairs for new record

        Returns:
            Newly created model instance
        """
        new_instance = self.model(**values)
        self.session.add(new_instance)
        return new_instance

    async def find_one_or_none_by_id(
        self,
        data_id: ID,
    ) -> Optional[T]:
        """Retrieve record by primary key.

        Args:
            data_id: Primary key value

        Returns:
            Model instance or None if not found
        """
        result = await self.session.execute(
            select(self.model).filter_by(**{self.primary_key: data_id}),
        )
        return result.scalar_one_or_none()

    async def update(
        self,
        item_id: ID,
        **update_data: Any,
    ) -> Optional[T]:
        """Update record by primary key.

        Args:
            item_id: Primary key value
            **update_data: Field-value pairs to update

        Returns:
            Updated model instance or None if not found

        Raises:
            sqlalchemy.exc.NoResultFound: If no record matches ID
        """
        try:
            result = await self.session.execute(
                update(self.model)
                .where(getattr(self.model, self.primary_key) == item_id)
                .values(**update_data)
                .returning(self.model),
            )
            return result.scalar_one()
        except exc.NoResultFound:
            return None

    async def delete(self, item_id: ID) -> None:
        """Delete record by primary key.

        Args:
            item_id: Primary key value to delete
        """
        await self.session.execute(
            delete(self.model).where(
                getattr(self.model, self.primary_key) == item_id,
            ),
        )
