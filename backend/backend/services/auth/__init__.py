from typing import Any, Callable, Coroutine, Literal, Optional

from fastapi import Depends, HTTPException, Response, status
from fastapi.security import APIKeyCookie

from backend.db.models.users import User
from backend.services.auth.jwt import JWTStrategy
from backend.services.db.service.users import UsersService
from backend.settings import settings

SAMESITE = Literal["lax", "strict", "none"] | None
ACCESS_TOKEN_NAME = "accessToken"  # noqa: S105
REFRESH_TOKEN_NAME = "refreshToken"  # noqa: S105
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7


class AuthService:
    """Authentication service."""

    def __init__(
        self,
        cookie_path: str = "/",
        cookie_domain: Optional[str] = None,
        cookie_secure: bool = True,
        cookie_httponly: bool = True,
        cookie_samesite: SAMESITE = "lax",
    ) -> None:
        self.cookie_path = cookie_path
        self.cookie_domain = cookie_domain
        self.cookie_secure = cookie_secure
        self.cookie_httponly = cookie_httponly
        self.cookie_samesite: SAMESITE = cookie_samesite
        self.access_scheme = APIKeyCookie(name=ACCESS_TOKEN_NAME, auto_error=False)
        self.refresh_scheme = APIKeyCookie(name=REFRESH_TOKEN_NAME, auto_error=False)
        self.access_strategy = JWTStrategy(
            secret=settings.users_secret,
            algorithm="HS256",
            lifetime_seconds=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
        self.refresh_strategy = JWTStrategy(
            secret=settings.users_secret,
            algorithm="HS256",
            lifetime_seconds=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        )

    def current_user(
        self,
        optional: bool = False,
    ) -> Callable[..., Coroutine[Any, Any, User | None]]:
        """Current user dependency."""

        async def current_user_dependency(
            users_service: UsersService = Depends(),
            access_token: str | None = Depends(self.access_scheme),
        ) -> User | None:
            current_user = await self.access_strategy.read_token(
                access_token,
                users_service,
            )
            if not current_user and not optional:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
            return current_user

        return current_user_dependency

    def get_login_response(self, user: User) -> Response:
        """Login user and returns response with refresh and access cookies."""
        access_token = self.access_strategy.write_token(user)
        refresh_token = self.refresh_strategy.write_token(user)

        response = Response(status_code=status.HTTP_204_NO_CONTENT)
        response.set_cookie(
            ACCESS_TOKEN_NAME,
            access_token,
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            path=self.cookie_path,
            domain=self.cookie_domain,
            secure=self.cookie_secure,
            httponly=self.cookie_httponly,
            samesite=self.cookie_samesite,
        )
        response.set_cookie(
            REFRESH_TOKEN_NAME,
            refresh_token,
            max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
            path=self.cookie_path,
            domain=self.cookie_domain,
            secure=self.cookie_secure,
            httponly=self.cookie_httponly,
            samesite=self.cookie_samesite,
        )
        return response

    async def get_refresh_response(
        self,
        refresh_token: str,
        users_service: UsersService,
    ) -> Response:
        """Refresh current tokens."""
        user = await self.refresh_strategy.read_token(
            refresh_token,
            users_service,
        )
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный токен",
            )

        new_access_token = self.access_strategy.write_token(user)
        new_refresh_token = self.refresh_strategy.write_token(user)

        response = Response(status_code=status.HTTP_204_NO_CONTENT)
        response.set_cookie(
            ACCESS_TOKEN_NAME,
            new_access_token,
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            path=self.cookie_path,
            domain=self.cookie_domain,
            secure=self.cookie_secure,
            httponly=self.cookie_httponly,
            samesite=self.cookie_samesite,
        )
        response.set_cookie(
            REFRESH_TOKEN_NAME,
            new_refresh_token,
            max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
            path=self.cookie_path,
            domain=self.cookie_domain,
            secure=self.cookie_secure,
            httponly=self.cookie_httponly,
            samesite=self.cookie_samesite,
        )
        return response

    def get_logout_response(self) -> Response:
        """Clear the user's authentication cookie to log them out."""
        response = Response(status_code=status.HTTP_204_NO_CONTENT)
        response.set_cookie(
            ACCESS_TOKEN_NAME,
            "",
            max_age=0,
            path=self.cookie_path,
            domain=self.cookie_domain,
            secure=self.cookie_secure,
            httponly=self.cookie_httponly,
            samesite=self.cookie_samesite,
        )
        response.set_cookie(
            REFRESH_TOKEN_NAME,
            "",
            max_age=0,
            path=self.cookie_path,
            domain=self.cookie_domain,
            secure=self.cookie_secure,
            httponly=self.cookie_httponly,
            samesite=self.cookie_samesite,
        )
        return response


auth_service = AuthService(cookie_secure=not settings.reload)
