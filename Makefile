.PHONY: setup migrate backend frontend test

setup:
	python3 -m venv .venv
	.venv/bin/python -m pip install -r requirements-dev.txt
	.venv/bin/alembic upgrade head

migrate:
	.venv/bin/alembic upgrade head

backend:
	.venv/bin/python -m uvicorn backend.app.main:app --reload --port 8000

frontend:
	python3 -m http.server 8080

test:
	.venv/bin/pytest
