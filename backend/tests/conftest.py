import pytest
import pytest_asyncio
from httpx import AsyncClient
from app.main import app
from unittest.mock import MagicMock
import sys
import os

# Add app to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

@pytest_asyncio.fixture
async def async_client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.fixture
def mock_gemini_response():
    mock = MagicMock()
    mock.text = """
    {
        "diagnosis": "Normal",
        "confidence": 0.95,
        "details": {
            "findings": ["No abnormalities detected"],
            "differential_diagnosis": [],
            "recommendations": ["Routine follow-up"],
            "medical_explanation": "Scan is clear.",
            "patient_explanation": "Everything looks good.",
            "image_url": "",
            "annotations": [],
            "severity": "normal"
        }
    }
    """
    return mock
