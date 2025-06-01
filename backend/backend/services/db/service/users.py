import uuid
from typing import TYPE_CHECKING, Any

from fastapi import HTTPException, status

from backend.db.models.users import User
from backend.services.auth.password import PasswordHelper
from backend.services.db.repository.users import UsersRepository
from backend.services.db.service import BaseService
from backend.web.api.v1.auth.schema import UserLogin

if TYPE_CHECKING:
    from backend.web.api.v1.auth.schema import UserRegister


class UsersService(BaseService[User, UsersRepository]):
    """Users service."""

    repository_class = UsersRepository

    def parse_id(self, value: Any) -> uuid.UUID:
        """Parse UUID from value."""
        if isinstance(value, uuid.UUID):
            return value
        try:
            return uuid.UUID(value)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid UUID",
            ) from e

    async def authenticate(self, credentials: UserLogin) -> User | None:
        """
        Authenticate a user.

        Args:
            credentials (UserLogin): The user login credentials.

        Returns:
            User | None: The authenticated user if successful, otherwise None.
        """
        user = await self.get_by_email(credentials.email)
        if not user:
            PasswordHelper.hash(credentials.password)
            return None

        verified, updated_password_hash = PasswordHelper.verify_and_update(
            credentials.password,
            user.hashed_password,
        )
        if not verified:
            return None
        # Update password hash to a more robust one if needed
        if updated_password_hash is not None:
            updated_user = await self.repository.update(
                user.id,
                hashed_password=updated_password_hash,
            )
            if not updated_user:
                raise Exception("Failed to update password hash")
            user = updated_user

        return user

    async def get_by_email(self, email: str) -> User | None:
        """
        Get a user by email.

        Args:
            email (str): The user's email.

        Returns:
            User | None: The user if found, otherwise None.
        """
        return await self.repository.get_by_email(email)

    async def get_by_id(self, user_id: uuid.UUID) -> User | None:
        """
        Get a user by id.

        Args:
            user_id (str): The user's id.

        Returns:
            User | None: The user if found, otherwise None.
        """
        return await self.repository.find_one_or_none_by_id(user_id)

    async def create(self, user_data: "UserRegister") -> User:
        """
        Create a new user.

        Args:
            user_data (UserRegister): The user registration data.

        Returns:
            User: The newly created user.

        Raises:
            Exception: If a user with the given email already exists.
        """
        existing_user = await self.get_by_email(user_data.email)
        if existing_user is not None:
            raise Exception("User with this email already exists")

        user_dict = user_data.model_dump(include={"email", "password"})
        password = user_dict.pop("password")
        user_dict["hashed_password"] = PasswordHelper.hash(password)

        return await self.repository.create(**user_dict)
