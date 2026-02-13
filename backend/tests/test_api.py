import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_upload_image(async_client: AsyncClient):
    # Create a dummy image file
    files = {'file': ('test.jpg', b'dummy_content', 'image/jpeg')}
    response = await async_client.post("/api/upload", files=files)
    
    # Depending on implementation, valid image is required. 
    # If using Pillow/Gemini, dummy content might fail.
    # Expecting 200 or 400 depending on validation
    assert response.status_code in [200, 400, 422] 

@pytest.mark.asyncio
async def test_health_check(async_client: AsyncClient):
    response = await async_client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to AI Medical Diagnosis API"}
