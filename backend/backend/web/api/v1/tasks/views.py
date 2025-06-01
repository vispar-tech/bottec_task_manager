from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.db.models.tasks import Task
from backend.db.models.users import User
from backend.services.auth.depends import get_current_user
from backend.services.db.service.tasks import TasksService
from backend.web.api.v1.tasks.schema import TaskCreate, TaskOut, TaskUpdate
from backend.web.schemas import Paginated

router = APIRouter(dependencies=[Depends(get_current_user)])


@router.get(
    "/",
    response_model=Paginated[TaskOut],
    summary="Get all tasks",
    operation_id="read_tasks",
    description="Retrieve all tasks for the current user.",
)
async def get_tasks(
    title: str | None = Query(None, max_length=255),
    is_done: bool | None = Query(None),
    sort_by: str | None = Query(
        "created_at",
        enum=["title", "description", "is_done", "created_at"],
    ),
    sort_order: str = Query("asc", enum=["asc", "desc"]),
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1),
    user: User = Depends(get_current_user),
    tasks_service: TasksService = Depends(),
) -> Paginated[TaskOut]:
    """Получить список задач с фильтрацией, сортировкой и пагинацией."""
    filters: dict[str, Any] = {"title": title, "is_done": is_done, "user_id": user.id}
    tasks, total = await tasks_service.get_all_tasks(
        filters,
        sort_by,
        sort_order,
        page,
        size,
    )
    return TaskOut.to_paginated(tasks, total, page, size)


@router.post(
    "/",
    response_model=TaskOut,
    summary="Create a new task",
    operation_id="create_task",
    description="Create a new task for the current user.",
)
async def create_task(
    task_data: TaskCreate,
    user: User = Depends(get_current_user),
    tasks_service: TasksService = Depends(),
) -> Task:
    """Создать новую задачу."""
    return await tasks_service.create_task(task_data, user.id)


@router.get(
    "/{task_id}",
    response_model=TaskOut,
    summary="Get a task by ID",
    operation_id="read_task",
    description="Retrieve a task by ID for the current user.",
)
async def get_task(
    task_id: int,
    user: User = Depends(get_current_user),
    tasks_service: TasksService = Depends(),
) -> Task:
    """Получить задачу по ID."""
    task = await tasks_service.get_task(task_id)
    if task is None or task.user_id != user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put(
    "/{task_id}",
    response_model=TaskOut,
    summary="Update a task",
    operation_id="update_task",
    description="Update a task for the current user.",
)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    user: User = Depends(get_current_user),
    tasks_service: TasksService = Depends(),
) -> Task:
    """Обновить задачу."""
    task = await tasks_service.update_task(task_id, task_data)
    if task is None or task.user_id != user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a task",
    operation_id="delete_task",
    description="Delete a task for the current user.",
)
async def delete_task(
    task_id: int,
    tasks_service: TasksService = Depends(),
) -> None:
    """Удалить задачу."""
    await tasks_service.delete_task(task_id)
