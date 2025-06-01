from typing import Any

from pydantic import EmailStr, model_validator

from backend.web.schemas import BaseModel


class UserRead(BaseModel):
    """Schema for user read."""

    email: str


class UserLogin(BaseModel):
    """Schema for user login."""

    email: str
    password: str


class InvalidCredentialsResponse(BaseModel):
    """Schema for invalid credentials."""

    detail: str


class UserRegister(BaseModel):
    """Schema for user registration."""

    email: EmailStr
    password: str
    password_confirm: str

    @model_validator(mode="before")
    @classmethod
    def validate_passwords_match(cls, values: dict[str, Any]) -> dict[str, Any]:
        """Validate that the passwords match."""
        if values["password"] != values["passwordConfirm"]:
            raise ValueError("Пороли не совпадают")
        return values
