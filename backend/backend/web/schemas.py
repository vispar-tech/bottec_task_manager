from pydantic import ConfigDict
from pydantic.alias_generators import to_camel


class BaseModel:
    """Base Pydantic model with camel alias."""

    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
