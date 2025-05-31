.PHONY: install run migrate


install:
	poetry install
run:
	poetry run python -m backend
migrate:
	poetry run alembic upgrade head

