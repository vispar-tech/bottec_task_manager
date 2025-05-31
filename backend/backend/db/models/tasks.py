from backend.db.base import Base


class Task(Base):
    """Task model."""

    __tablename__ = "tasks"
