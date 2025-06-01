from typing import Generic, List, Sequence, TypeVar

from pydantic import BaseModel as PydanticBaseModel
from pydantic import ConfigDict
from pydantic.alias_generators import to_camel


class BaseModel(PydanticBaseModel):
    """Base Pydantic model with camel alias."""

    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )


T = TypeVar("T", bound=BaseModel)


class Paginated(BaseModel, Generic[T]):
    """Base Pydantic model for paginated response."""

    items: Sequence[T] | List[T]
    total: int
    page: int
    size: int
