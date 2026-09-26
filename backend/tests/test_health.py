from fastapi.testclient import TestClient
from main import app

# ─────────────────────────────────────────────────────────────────────────────
# Health Check Tests
#
# These are the first tests for Smart Auto Cars backend.
# TestClient from FastAPI allows us to make real HTTP requests to the app
# without needing a running server.
#
# Run with: pytest tests/ -v
# ─────────────────────────────────────────────────────────────────────────────

client = TestClient(app)


def test_root_endpoint_returns_200():
    """
    The root endpoint / must return HTTP 200 OK.
    If this fails it means the FastAPI app itself failed to start.
    """
    response = client.get("/")
    assert response.status_code == 200


def test_root_endpoint_returns_correct_message():
    """The root endpoint must return the expected JSON structure."""
    response = client.get("/")
    data = response.json()
    assert data["status"] == "running"
    assert data["message"] == "Smart Auto Cars API"


def test_health_endpoint_returns_200():
    """
    The /health endpoint must return HTTP 200 OK.
    This endpoint is called by GitHub Actions and the deployment
    platform to confirm the service is alive.
    """
    response = client.get("/health")
    assert response.status_code == 200


def test_health_endpoint_returns_healthy_status():
    """The /health endpoint must return status: healthy."""
    response = client.get("/health")
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Smart Auto Cars API"
