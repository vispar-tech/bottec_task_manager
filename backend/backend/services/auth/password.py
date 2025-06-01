from typing import Optional

from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher
from pwdlib.hashers.bcrypt import BcryptHasher


class PasswordHelper:
    """Password hashing and verification helper."""

    _pwd_context = PasswordHash(
        (
            Argon2Hasher(),
            BcryptHasher(),
        ),
    )

    @staticmethod
    def verify_and_update(
        plain_password: str,
        hashed_password: str,
    ) -> tuple[bool, Optional[str]]:
        """Verify a password against its hashed version.

        Args:
            plain_password (str): The plain text password to verify.
            hashed_password (str): The hashed password to compare against.

        Returns:
            bool: True if the password matches the hash, False otherwise.
            Optional[str]: The updated hashed password if the hash needs to be
              updated, None otherwise.
        """
        return PasswordHelper._pwd_context.verify_and_update(
            plain_password,
            hashed_password,
        )

    @staticmethod
    def hash(password: str) -> str:
        """Hash a password.

        Args:
            password (str): The plain text password to hash.

        Returns:
            str: The hashed password.
        """
        return PasswordHelper._pwd_context.hash(password)
