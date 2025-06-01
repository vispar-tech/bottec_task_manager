from fastapi import APIRouter, Depends, HTTPException, Response, status

from backend.db.models.users import User
from backend.services.auth import auth_service
from backend.services.auth.depends import get_current_user
from backend.services.db.service.users import UsersService
from backend.web.api.v1.auth.schema import UserLogin, UserRead, UserRegister

router = APIRouter()


@router.post(
    "/login",
    summary="Log in a user",
    status_code=status.HTTP_204_NO_CONTENT,
    description="Authenticate a user and return a response with an access token.",
    operation_id="login_user",
)
async def login(
    credentials: UserLogin,
    users_service: UsersService = Depends(),
) -> Response:
    """
    Log in a user.

    Args:
        credentials (UserLogin): The user login credentials.
        users_service (UsersService): The users service.
        auth_service (AuthService): The authentication service.

    Returns:
        Response: The response with the token in a cookie.
    """
    user = await users_service.authenticate(credentials)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )
    return await auth_service.get_login_response(user)


@router.post(
    "/refresh",
    summary="Refresh token",
    description="Refresh current tokens.",
    operation_id="refresh_token",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def refresh_token(
    refresh_token: str = Depends(auth_service.refresh_scheme),
    users_service: UsersService = Depends(),
) -> Response:
    return await auth_service.get_refresh_response(refresh_token, users_service)


@router.post(
    "/register",
    response_model=UserRead,
    summary="Register a new user",
    description="Create a new user account with the provided registration data.",
    operation_id="register_user",
)
async def register(
    form_data: UserRegister,
    service: UsersService = Depends(),
) -> User:
    """
    Register a new user.

    Args:
        form_data (UserRegister): The form data with email, password, etc.
        service (UsersService): The users service.

    Returns:
        UserRead: The newly created user.
    """
    return await service.create(form_data)


@router.get(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Log out user",
    description="Clear the user's authentication cookie to log them out.",
    operation_id="logout_user",
)
async def logout(response: Response) -> None:
    """
    Log out.

    Args:
        response (Response): The response object.

    Returns:
        dict: A message indicating that the logout was successful.
    """
    response.delete_cookie(key="access_token")


@router.get(
    "/users/me",
    response_model=UserRead,
    summary="Get current user",
    description="Retrieve the currently authenticated user's information.",
    operation_id="read_current_user",
)
async def read_users_me(
    user: User = Depends(get_current_user),
) -> User:
    """
    Get the current user.

    Args:
        user (User): The current user.

    Returns:
        UserRead: The current user.
    """
    return user
