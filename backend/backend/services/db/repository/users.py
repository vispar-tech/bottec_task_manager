from typing import Any

from sqlalchemy.sql import select

from backend.db.models.users import User
from backend.services.db.repository import BaseRepository


class UsersRepository(BaseRepository[User]):
    """Users repository."""

    model = User

    async def get_by_email(self, email: str) -> User | None:
        """
        Get a user by email.

        Args:
            email (str): The user's email.

        Returns:
            User | None: The user if found, otherwise None.
        """
        result = await self.session.execute(
            select(self.model).where(self.model.email == email),
        )
        return result.scalar_one_or_none()

    async def create(self, **user_values: dict[str, Any]) -> User:
        """
        Create a new user.

        Args:
            user_values (dict): The user attributes.

        Returns:
            User: The newly created user.
        """
        user = await self.add(**user_values)
        await self.session.flush()
        return user
