from typing import Any, Callable, Dict, Optional, Sequence

from sqlalchemy import ColumnElement, func, select
from sqlalchemy.orm import InstrumentedAttribute

from backend.db.models.tasks import Task
from backend.services.db.repository import BaseRepository

FilterFnsType = Dict[InstrumentedAttribute[Any], Callable[[Any], ColumnElement[bool]]]

filter_fns: FilterFnsType = {
    Task.title: lambda value: Task.title.contains(value),
    Task.description: lambda value: Task.description.contains(value),
    Task.is_done: lambda value: Task.is_done.is_(value),
    Task.user_id: lambda value: Task.user_id == value
}


class TasksRepository(BaseRepository[Task]):
    """Repository for tasks."""

    model = Task

    async def find_all(
        self,
        filters: Optional[Dict[str, Any]] = None,
        sort_by: Optional[str] = None,
        sort_order: str = "asc",
        page: int = 1,
        size: int = 50,
    ) -> tuple[Sequence[Task], int]:
        """Get all tasks with filters, sorting and pagination."""
        query = select(self.model)

        if filters:
            for key, value in filters.items():
                if value is not None and hasattr(self.model, key):
                    query = query.where(filter_fns[getattr(self.model, key)](value))

        if sort_by and hasattr(self.model, sort_by):
            sort_column = getattr(self.model, sort_by)
            if sort_order.lower() == "desc":
                query = query.order_by(sort_column.desc())
            else:
                query = query.order_by(sort_column.asc())

        count_query = select(func.count()).select_from(self.model)
        if filters:
            for key, value in filters.items():
                if value is not None and hasattr(self.model, key):
                    count_query = count_query.where(
                        filter_fns[getattr(self.model, key)](value)
                    )
        total = await self.session.scalar(count_query) or 0

        offset = (page - 1) * size
        query = query.offset(offset).limit(size)

        result = await self.session.execute(query)
        tasks = result.scalars().all()
        return tasks, total
