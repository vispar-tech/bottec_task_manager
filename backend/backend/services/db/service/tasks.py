from typing import Any, Dict, Optional, Sequence
from uuid import UUID

from backend.db.models.tasks import Task
from backend.services.db.repository.tasks import TasksRepository
from backend.services.db.service import BaseService
from backend.web.api.v1.tasks.schema import TaskCreate, TaskUpdate


class TasksService(BaseService[Task, TasksRepository]):
    """
    Tasks service.

    Attributes:
        repository_class: The repository class for tasks.
    """

    repository_class = TasksRepository

    async def get_all_tasks(
        self,
        filters: Optional[Dict[str, Any]] = None,
        sort_by: Optional[str] = None,
        sort_order: str = "asc",
        page: int = 1,
        size: int = 50,
    ) -> tuple[Sequence[Task], int]:
        """
        Get all tasks with filters, sorting and pagination.

        Args:
            filters (Optional[Dict[str, Any]]): The filters to apply.
            sort_by (Optional[str]): The field to sort by.
            sort_order (str): The sort order.
            page (int): The page number.
            size (int): The page size.

        Returns:
            tuple[Sequence[Task], int]: The tasks and the total count.
        """
        return await self.repository.find_all(filters, sort_by, sort_order, page, size)

    async def create_task(self, task_data: TaskCreate, user_id: UUID) -> Task:
        """
        Create a new task.

        Args:
            task_data (TaskCreate): The task data.
            user_id (UUID): The user ID.

        Returns:
            Task: The created task.
        """
        task = await self.repository.add(**task_data.model_dump(), user_id=user_id)
        await self.repository.session.commit()
        return task

    async def get_task(self, task_id: int) -> Optional[Task]:
        """
        Get a task by ID.

        Args:
            task_id (int): The task ID.

        Returns:
            Optional[Task]: The task if found, otherwise None.
        """
        return await self.repository.find_one_or_none_by_id(task_id)

    async def update_task(self, task_id: int, task_data: TaskUpdate) -> Optional[Task]:
        """
        Update a task.

        Args:
            task_id (int): The task ID.
            task_data (TaskUpdate): The task data.

        Returns:
            Optional[Task]: The updated task if found, otherwise None.
        """
        updated_task = await self.repository.update(
            task_id,
            **task_data.model_dump(exclude_unset=True),
        )
        if updated_task:
            await self.repository.session.commit()
        return updated_task

    async def delete_task(self, task_id: int) -> None:
        """
        Delete a task.

        Args:
            task_id (int): The task ID.
        """
        await self.repository.delete(task_id)
        await self.repository.session.commit()
