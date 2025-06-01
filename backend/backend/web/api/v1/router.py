from fastapi.routing import APIRouter

from . import auth, tasks

v1_router = APIRouter()

v1_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Auth"],
)
v1_router.include_router(
    tasks.router,
    prefix="/tasks",
    tags=["Tasks"],
)
