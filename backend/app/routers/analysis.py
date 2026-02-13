from fastapi import APIRouter
from app.models.schemas import AnalysisRequest

router = APIRouter()

@router.post("/analyze-image")
async def analyze_image(request: AnalysisRequest):
    # TODO: Call Gemini service
    return {"image_id": request.image_id, "status": "analyzing"}
