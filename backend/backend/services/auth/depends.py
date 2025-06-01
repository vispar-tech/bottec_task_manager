from typing import Any, Callable, Coroutine

from backend.db.models.users import User
from backend.services.auth import auth_service

get_current_user: Callable[..., Coroutine[Any, Any, User | None]] = (
    auth_service.current_user(optional=False)
)
