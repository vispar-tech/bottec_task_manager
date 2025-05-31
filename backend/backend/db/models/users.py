from backend.db.base import Base


class User(Base):
    """User model."""

    __tablename__ = "users"
