from datetime import datetime, timedelta, timezone
from typing import Any, Optional

import jwt

from backend.db.models.users import User
from backend.services.db.service.users import UsersService


class JWTStrategy:
    """JWT strategy for authentication."""

    def __init__(
        self,
        secret: str,
        algorithm: str = "HS256",
        lifetime_seconds: Optional[int] = None,
    ) -> None:
        self.secret = secret
        self.algorithm = algorithm
        self.lifetime_seconds = lifetime_seconds

    async def read_token(
        self,
        token: Optional[str],
        users_service: UsersService,
    ) -> Optional[User]:
        """
        Read token from request and return user if token is valid.

        Args:
            token: The token from request.
            users_service: The users service.

        Returns:
            Optional[User]: The user if token is valid, otherwise None.
        """
        if token is None:
            return None

        try:
            data = jwt.decode(token, self.secret, algorithms=[self.algorithm])  # type: ignore
            user_id = data.get("sub")
            if user_id is None:
                return None
        except jwt.PyJWTError:
            return None

        try:
            return await users_service.get_by_id(users_service.parse_id(user_id))
        except ValueError:
            return None

    async def write_token(self, user: User) -> str:
        """
        Write token for user.

        Args:
            user: The user to write token for.

        Returns:
            str: The token.
        """
        payload: dict[str, Any] = {"sub": str(user.id)}
        if self.lifetime_seconds:
            expire = datetime.now(timezone.utc) + timedelta(
                seconds=self.lifetime_seconds,
            )
            payload["exp"] = expire
        return jwt.encode(payload, self.secret, algorithm=self.algorithm)  # type: ignore
