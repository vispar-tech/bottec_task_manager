from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import UJSONResponse

from backend.log import configure_logging
from backend.web.api.v1.router import v1_router
from backend.web.lifespan import lifespan_setup

APP_ROOT = Path(__file__).parent.parent


def get_app() -> FastAPI:
    """
    Get FastAPI application.

    This is the main constructor of an application.
    """
    configure_logging()
    app = FastAPI(
        title="crm_backend",
        description="Task manager API",
        lifespan=lifespan_setup,
        default_response_class=UJSONResponse,
    )

    app.include_router(router=v1_router, prefix="/v1")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://localhost:3030"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app
