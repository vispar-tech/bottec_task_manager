from datetime import datetime
from typing import TYPE_CHECKING, Optional, Self, Sequence

from pydantic import Field

from backend.web.schemas import BaseModel, Paginated

if TYPE_CHECKING:
    from backend.db.models.tasks import Task


class TaskCreate(BaseModel):
    """Task creation request payload."""

    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1, max_length=2048)
    is_done: bool


class TaskUpdate(BaseModel):
    """Task update request payload."""

    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = Field(None, max_length=2048)
    is_done: Optional[bool] = Field(None)


class TaskOut(BaseModel):
    """Task response payload."""

    id: int
    title: str
    description: str
    is_done: bool
    created_at: datetime

    @classmethod
    def to_paginated(
        cls,
        items: list["Task"] | Sequence["Task"],
        total: int,
        page: int,
        size: int,
    ) -> Paginated[Self]:
        """Create a Paginated from a list and total."""
        return Paginated(
            items=[cls.model_validate(item) for item in items],
            total=total,
            page=page,
            size=size,
        )
